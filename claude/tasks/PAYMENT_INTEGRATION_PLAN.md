# Payment Integration Plan

## Current Implementation Status ✅

### What's Ready Now
1. **Usage Tracking System**: Database tables and functions for monitoring evaluation limits
2. **Freemium Model**: 1 free evaluation per month, with upgrade prompts
3. **Pricing UI**: Modal with clear pricing tiers (Free, Pro $19/mo, Enterprise $99/mo)
4. **Backend Structure**: Edge Function checks usage limits before processing

### GPT-4 Vision + Freemium Economics
- **Cost per evaluation**: ~$0.05-0.08 (GPT-4 Vision)
- **Pro pricing**: $19/100 evals = $0.19 per evaluation
- **Margin**: ~75% profit margin per evaluation
- **Free tier**: Loss leader (1 eval/month = ~$0.08 cost)

## Payment Integration Options

### Option 1: Stripe (Recommended) 
**Why**: Industry standard, excellent developer experience, handles taxes/compliance

**Implementation Steps:**
1. **Stripe Account Setup**
   - Create Stripe account
   - Set up products and pricing in Stripe Dashboard
   - Configure webhooks for subscription events

2. **Frontend Integration**
   - Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
   - Create checkout flow components
   - Handle success/cancel redirects

3. **Backend Integration** 
   - Add Stripe webhook handler (Supabase Edge Function)
   - Update user subscription status on payment events
   - Handle subscription lifecycle (create, update, cancel)

4. **Database Updates**
   - User table already has `stripe_customer_id` and `stripe_subscription_id` fields
   - Add subscription status tracking
   - Handle proration and billing cycles

**Estimated Timeline**: 1-2 weeks for full integration

### Option 2: LemonSqueezy
**Why**: Simpler setup, handles EU VAT automatically, merchant of record

**Implementation Steps:**
1. **LemonSqueezy Setup**
   - Create account and products
   - Configure webhook endpoints
   - Set up tax handling

2. **Integration**
   - Use LemonSqueezy checkout overlay
   - Handle webhook events for subscription updates
   - Update user subscription status

**Estimated Timeline**: 3-5 days for basic integration

### Option 3: Paddle
**Why**: Good for SaaS, handles global tax compliance, merchant of record

**Implementation Steps:**
1. **Paddle Setup**
   - Create account and configure products
   - Set up webhook handling
   - Configure tax settings

2. **Integration**
   - Implement Paddle checkout
   - Handle subscription events
   - Update user tiers based on payments

**Estimated Timeline**: 1 week for integration

## Recommended Implementation: Stripe

### Phase 1: Basic Subscription (Week 1)
1. **Stripe Setup**
   ```bash
   # Install Stripe CLI for local testing
   stripe login
   stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
   ```

2. **Create Subscription Products**
   - Pro: $19/month (price_1...)
   - Enterprise: $99/month (price_1...)

3. **Frontend Checkout Flow**
   ```typescript
   // In PricingModal.tsx
   const handleUpgrade = async (priceId: string) => {
     const { data } = await supabase.functions.invoke('create-checkout-session', {
       body: { priceId, userId }
     });
     
     if (data.url) {
       window.location.href = data.url;
     }
   };
   ```

4. **Supabase Edge Function**: `create-checkout-session`
   ```typescript
   import Stripe from 'stripe';
   
   const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
   
   const { priceId, userId } = await req.json();
   
   const session = await stripe.checkout.sessions.create({
     customer_email: userEmail,
     line_items: [{ price: priceId, quantity: 1 }],
     mode: 'subscription',
     success_url: `${origin}/dashboard?success=true`,
     cancel_url: `${origin}/pricing?canceled=true`,
   });
   
   return Response.json({ url: session.url });
   ```

### Phase 2: Webhook Handling (Week 2)
1. **Stripe Webhook Handler**: `stripe-webhook`
   - Handle `customer.subscription.created`
   - Handle `customer.subscription.updated` 
   - Handle `customer.subscription.deleted`
   - Handle `invoice.payment_succeeded`
   - Handle `invoice.payment_failed`

2. **User Status Updates**
   ```sql
   -- Update user subscription when payment succeeds
   UPDATE users 
   SET 
     subscription_tier = 'pro',
     stripe_customer_id = $1,
     stripe_subscription_id = $2,
     subscription_status = 'active',
     subscription_current_period_end = $3
   WHERE id = $4;
   ```

### Phase 3: Advanced Features (Week 3-4)
1. **Customer Portal**: Let users manage billing
2. **Usage-Based Billing**: Track overages for enterprise
3. **Proration**: Handle mid-cycle upgrades/downgrades
4. **Dunning Management**: Handle failed payments

## Security Considerations

1. **API Keys**
   - Store Stripe keys as environment variables
   - Use publishable key in frontend
   - Keep secret key server-side only

2. **Webhook Security**
   - Verify webhook signatures
   - Use Stripe CLI for local testing
   - Implement idempotency keys

3. **User Verification**
   - Validate user authentication before checkout
   - Prevent subscription hijacking
   - Handle edge cases (deleted users, etc.)

## Testing Strategy

1. **Stripe Test Mode**
   - Use test card numbers: `4242424242424242`
   - Test subscription lifecycle
   - Test webhook events

2. **Local Development**
   - Use Stripe CLI to forward webhooks
   - Test with ngrok for external access
   - Validate all payment flows

3. **Staging Environment**
   - Deploy to staging with test keys
   - Full end-to-end testing
   - User acceptance testing

## Launch Checklist

### Pre-Launch
- [ ] Stripe account approved for production
- [ ] All webhook endpoints configured
- [ ] Payment flows tested end-to-end
- [ ] Customer portal tested
- [ ] Error handling implemented
- [ ] Security review completed

### Launch Day
- [ ] Switch to production Stripe keys
- [ ] Monitor webhook delivery
- [ ] Test live payment flow
- [ ] Monitor error logs
- [ ] Customer support ready

### Post-Launch
- [ ] Monitor subscription metrics
- [ ] Track conversion rates
- [ ] Monitor failed payments
- [ ] Customer feedback collection
- [ ] Iterate on pricing/features

## Success Metrics

### Key Metrics to Track
1. **Conversion Rate**: Free → Paid users
2. **Monthly Churn**: Subscription cancellations
3. **Customer Lifetime Value (CLV)**: Revenue per user
4. **Usage Patterns**: Evaluations per user/month
5. **Support Tickets**: Payment-related issues

### Initial Targets
- **Free → Pro conversion**: 2-5% monthly
- **Pro plan retention**: >85% monthly
- **Support ticket rate**: <2% of transactions

This plan provides a complete path from current freemium model to full payment integration, with realistic timelines and clear success metrics.
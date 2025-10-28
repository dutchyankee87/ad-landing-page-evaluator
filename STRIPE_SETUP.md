# Stripe Integration Setup Guide

## 🎯 Current Status
✅ Publishable key configured: `pk_live_51SMpj1FhgriIx8RjyAblznZeYHcITFGbwMY1Ojik3VrIsuf9Yg3m3tiXtcXI3wx72ov3Syx0WtcNJ8zRoetz93B700tEscOsY4`

## 🔑 Next Steps

### 1. Get Your Secret Key
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Live Secret Key** (starts with `sk_live_`)
3. Add it to your `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_live_your_actual_secret_key
   ```

### 2. Create Products in Stripe Dashboard

Navigate to **Products** → **Add Product** and create these exact products:

#### Pro Plan Monthly
- **Name**: ADalign Pro Monthly
- **Pricing**: $29.00 USD / month
- **Price ID**: Copy this and update `STRIPE_PRICE_IDS.pro_monthly` in `/src/lib/subscription.ts`

#### Pro Plan Yearly  
- **Name**: ADalign Pro Yearly
- **Pricing**: $290.00 USD / year (save $58)
- **Price ID**: Copy this and update `STRIPE_PRICE_IDS.pro_yearly`

#### Agency Plan Monthly
- **Name**: ADalign Agency Monthly  
- **Pricing**: $99.00 USD / month
- **Price ID**: Copy this and update `STRIPE_PRICE_IDS.agency_monthly`

#### Agency Plan Yearly
- **Name**: ADalign Agency Yearly
- **Pricing**: $990.00 USD / year (save $198)
- **Price ID**: Copy this and update `STRIPE_PRICE_IDS.agency_yearly`

#### Enterprise Plan Monthly
- **Name**: ADalign Enterprise Monthly
- **Pricing**: $299.00 USD / month  
- **Price ID**: Copy this and update `STRIPE_PRICE_IDS.enterprise_monthly`

#### Enterprise Plan Yearly
- **Name**: ADalign Enterprise Yearly
- **Pricing**: $2990.00 USD / year (save $598)
- **Price ID**: Copy this and update `STRIPE_PRICE_IDS.enterprise_yearly`

### 3. Configure Webhooks

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
3. **Events to listen for**:
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Signing Secret** (starts with `whsec_`)
5. Add to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
   ```

### 4. Update Price IDs in Code

After creating products, update `/src/lib/subscription.ts`:

```typescript
export const STRIPE_PRICE_IDS = {
  pro_monthly: 'price_your_actual_pro_monthly_id',
  pro_yearly: 'price_your_actual_pro_yearly_id', 
  agency_monthly: 'price_your_actual_agency_monthly_id',
  agency_yearly: 'price_your_actual_agency_yearly_id',
  enterprise_monthly: 'price_your_actual_enterprise_monthly_id',
  enterprise_yearly: 'price_your_actual_enterprise_yearly_id',
} as const;
```

### 5. Database Migration

Run the database migration to add Stripe fields to users table:

```sql
ALTER TABLE users 
ADD COLUMN bonus_evaluations INTEGER DEFAULT 0,
ADD COLUMN stripe_customer_id TEXT UNIQUE,
ADD COLUMN stripe_subscription_id TEXT UNIQUE,
ADD COLUMN subscription_status TEXT,
ADD COLUMN subscription_current_period_end TIMESTAMP WITH TIME ZONE,
ALTER COLUMN tier TYPE TEXT;

-- Update tier constraint to include new tiers
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_tier_check;
ALTER TABLE users ADD CONSTRAINT users_tier_check 
CHECK (tier IN ('free', 'pro', 'agency', 'enterprise'));

-- Add indexes for Stripe fields
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription ON users(stripe_subscription_id);
```

### 6. Configure Customer Portal

1. Go to **Settings** → **Billing** → **Customer portal**
2. Enable customer portal
3. Configure allowed actions:
   - ✅ Update payment methods
   - ✅ Update billing information  
   - ✅ View invoice history
   - ✅ Cancel subscriptions

### 7. Test Payment Flow

1. Deploy your changes
2. Go to `/pricing` page
3. Test subscription flow with Stripe test cards
4. Verify webhooks are working in Stripe dashboard

## 🚀 Go Live Checklist

- [ ] Secret key added to `.env`
- [ ] All 6 products created in Stripe
- [ ] Price IDs updated in code
- [ ] Webhook endpoint configured
- [ ] Database migration completed
- [ ] Customer portal configured
- [ ] Test payment completed
- [ ] Webhooks receiving events successfully

## 💡 Tips

- Use Stripe's test mode first to verify everything works
- Monitor webhook delivery in Stripe dashboard
- Set up email notifications for failed payments
- Consider adding promotional codes for discounts

## 🔧 Troubleshooting

**Webhook not receiving events?**
- Check webhook URL is correct
- Verify webhook secret matches
- Check Vercel function logs

**Payment failing?**
- Verify price IDs are correct
- Check product is active in Stripe
- Ensure webhook handles subscription events

Your Stripe integration is ready to generate revenue! 🎉
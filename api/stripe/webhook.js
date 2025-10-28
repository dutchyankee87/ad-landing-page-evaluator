import Stripe from 'stripe';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { users } from '../../src/lib/db/schema.js';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('Stripe webhook event:', event.type);

  // Initialize database connection
  let db = null;
  if (process.env.DATABASE_URL) {
    const client = postgres(process.env.DATABASE_URL, { prepare: false });
    db = drizzle(client);
  } else {
    console.error('No database connection available');
    return res.status(500).json({ error: 'Database connection failed' });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object, db);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object, db);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object, db);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object, db);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleSubscriptionChange(subscription, db) {
  console.log('Processing subscription change:', subscription.id);
  
  const customer = await stripe.customers.retrieve(subscription.customer);
  
  if (!customer.email) {
    console.error('No email found for customer:', subscription.customer);
    return;
  }

  // Determine tier based on price ID
  const priceId = subscription.items.data[0]?.price?.id;
  const tier = getTierFromPriceId(priceId);
  
  await db
    .update(users)
    .set({
      stripeCustomerId: subscription.customer,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      tier: tier,
      updatedAt: new Date()
    })
    .where(eq(users.email, customer.email));
    
  console.log(`Updated user subscription: ${customer.email} -> ${tier}`);
}

async function handleSubscriptionCanceled(subscription, db) {
  console.log('Processing subscription cancellation:', subscription.id);
  
  await db
    .update(users)
    .set({
      subscriptionStatus: 'canceled',
      tier: 'free',
      updatedAt: new Date()
    })
    .where(eq(users.stripeSubscriptionId, subscription.id));
    
  console.log(`Canceled subscription: ${subscription.id}`);
}

async function handlePaymentSucceeded(invoice, db) {
  console.log('Processing successful payment:', invoice.id);
  
  if (invoice.subscription) {
    // Reset monthly usage on successful payment
    await db
      .update(users)
      .set({
        monthlyEvaluations: 0,
        updatedAt: new Date()
      })
      .where(eq(users.stripeSubscriptionId, invoice.subscription));
  }
}

async function handlePaymentFailed(invoice, db) {
  console.log('Processing failed payment:', invoice.id);
  
  if (invoice.subscription) {
    await db
      .update(users)
      .set({
        subscriptionStatus: 'past_due',
        updatedAt: new Date()
      })
      .where(eq(users.stripeSubscriptionId, invoice.subscription));
  }
}

function getTierFromPriceId(priceId) {
  const tierMap = {
    'price_1SN97pFhgriIx8RjiK7LApeS': 'pro',    // Pro Monthly
    'price_1SN9BeFhgriIx8RjSUBZm7rx': 'pro',    // Pro Yearly
    'price_1SN99FFhgriIx8RjPqiWWOgl': 'agency', // Agency Monthly
    'price_1SN9DTFhgriIx8RjL6PIx6aX': 'agency', // Agency Yearly
    'price_1SN9EmFhgriIx8Rj2tFxCps4': 'enterprise', // Enterprise Monthly
    'price_1SN9GJFhgriIx8RjwFrMKhnx': 'enterprise', // Enterprise Yearly
  };
  
  return tierMap[priceId] || 'free';
}
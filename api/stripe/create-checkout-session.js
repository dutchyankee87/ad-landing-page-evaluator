import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { priceId, customerEmail } = req.body;

  if (!priceId) {
    return res.status(400).json({ error: 'Price ID is required' });
  }

  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing`,
      customer_email: customerEmail,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      
      // Optional: Add metadata for tracking
      metadata: {
        source: 'adalign_pricing_page'
      },
      
      // Optional: Collect tax automatically
      automatic_tax: { enabled: false }, // Set to true if you want automatic tax calculation
      
      // Optional: Add subscription data
      subscription_data: {
        metadata: {
          source: 'adalign_pricing_page'
        }
      }
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
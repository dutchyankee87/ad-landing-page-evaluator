// Stripe client configuration
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Client-side Stripe instance
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.warn('Stripe publishable key not found');
      return Promise.resolve(null);
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Helper function to redirect to Stripe Checkout (following Stripe quickstart pattern)
export async function redirectToCheckout(priceId: string, userEmail?: string) {
  try {
    // Create checkout session on server
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerEmail: userEmail,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    // Redirect to Stripe Checkout
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Checkout redirect error:', error);
    throw error;
  }
}

// Helper function to create a customer portal session
export async function redirectToCustomerPortal() {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Portal redirect error:', error);
    throw error;
  }
}
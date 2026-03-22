import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51...placeholder...';
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('WARNING: STRIPE_SECRET_KEY is not defined in .env. Stripe features will fail.');
}

const stripe = new Stripe(STRIPE_KEY);

/**
 * Create a Stripe Payment Intent
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code (e.g., 'usd')
 * @param {Object} metadata - Additional info for Stripe
 * @returns {Promise<Object>} - The created Payment Intent
 */
export async function createPaymentIntent(amount, currency = 'usd', metadata = {}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (error) {
    if (error.type === 'StripeAuthenticationError' || STRIPE_KEY.includes('placeholder')) {
      console.error('Stripe Authentication Error: Using mock payment intent for development.');
      return {
        id: 'pi_mock_' + Date.now(),
        client_secret: 'pi_mock_secret_' + Date.now(),
      };
    }
    console.error('Stripe error:', error);
    throw new Error('Failed to create payment intent');
  }
}

/**
 * Verify a Stripe Webhook signature
 * @param {Buffer} body - Raw request body
 * @param {string} signature - Stripe-Signature header
 * @returns {Object} - The verified event
 */
export function verifyWebhook(body, signature) {
  try {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook verification failed:', error);
    throw new Error(`Webhook Error: ${error.message}`);
  }
}

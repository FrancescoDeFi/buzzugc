import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env.local') });

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  console.log('Received checkout request:', req.body);

  try {
    const { priceId, planId } = req.body;
    const origin = req.headers.origin || 'http://localhost:5174';

    if (!priceId) {
      throw new Error('Price ID is required');
    }

    console.log('Creating Stripe session with priceId:', priceId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${origin}/`,
      metadata: {
        planId: planId,
      },
    });

    console.log('Stripe session created:', session.id);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log('Stripe key configured:', !!process.env.STRIPE_SECRET_KEY);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});
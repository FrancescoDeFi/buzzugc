# Stripe Integration (Client-only)

This app uses a pure client-side Stripe Checkout flow. No backend session creation is required.

## What’s implemented

- Client-only redirect to Checkout using `@stripe/stripe-js`
- Centralized plan and price mapping in `services/stripeService.ts`
- Pricing UI wired to trigger Checkout
- Success/cancel handling via URL params in `App.tsx`

## Setup

1) Get your Stripe publishable key
- Stripe Dashboard → Developers → API keys → Publishable key (`pk_*`).

2) Add env var for Vite
- In your `.env` (or deployment env), set:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx_or_pk_test_xxx
```

3) Product and price IDs
- Already configured in code:
  - Starter: product `prod_T3MDxu75j4N3Wx`, price `price_1S7FVWCyEFxXrv4D5I2muWZ4`
  - Professional: product `prod_T3MFZuYnkHPND9`, price `price_1S7FX0CyEFxXrv4DtPmuax2n`

## How it works

- `pages/PricingPaywall.tsx` calls `checkoutWithPrice(planId)` from `services/stripeService.ts`.
- The service loads Stripe with `VITE_STRIPE_PUBLISHABLE_KEY` and calls `stripe.redirectToCheckout` with the appropriate price ID and `mode: 'subscription'`.
- On success, Stripe redirects back to `/?success=true&session_id=...&plan=...`.
- `App.tsx` reads these query params and shows `PaymentSuccess`.

## Customizing

- Update plan features/pricing UI in `pages/PricingPaywall.tsx`.
- Add or change plan mappings in `services/stripeService.ts` (`STRIPE_PRICES`).
- Override redirect URLs by passing `successUrl`/`cancelUrl` to `checkoutWithPrice` if needed.

## Notes

- For subscriptions, the price IDs must be recurring prices in Stripe.
- Client-only Checkout can’t verify payments on the client. The app currently treats a successful redirect return as success for UX. If you later add a backend, verify sessions and update user entitlements server-side.

## Testing

- Use test mode (`pk_test_...`) and Stripe test cards (e.g., 4242 4242 4242 4242).
- Start app: `npm run dev` and try purchasing from the pricing page.

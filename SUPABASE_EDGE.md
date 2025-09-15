Supabase Edge Functions migration

Overview
- Moves sensitive logic (Fal.ai calls, Stripe secret usage, quotas) from the browser to secure serverless functions.
- Client invokes functions with the user’s Supabase JWT for per-user authorization.

Prerequisites
- Supabase project created
- Supabase CLI installed: `npm i -g supabase`
- Logged in: `supabase login`
- Linked to your project: `supabase link --project-ref <your-project-ref>`

Secrets
- Set your Fal key as a secret:
  - `supabase secrets set FAL_KEY=your_fal_secret_key`

Local development
- Start Edge Function locally (no JWT verification while testing):
  - `supabase functions serve generate-ugc --no-verify-jwt`
  - The function URL will be printed (e.g., http://localhost:54321/functions/v1/generate-ugc)
  - Supabase JS in the app will call this automatically via `supabase.functions.invoke('generate-ugc')`

Deploy
- `supabase functions deploy generate-ugc`
- Ensure your frontend uses the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` that point to your project.

What changed in the app
- Added `supabase/functions/generate-ugc/index.ts` (Deno Edge Function):
  - Accepts `{ imageDataUrl, avatarImageUrl, script }`
  - Uses server-side `FAL_KEY` to contact Fal.ai
  - Responds with `{ videoUrl }`
- Updated `services/geminiService.ts`:
  - Prefers `supabase.functions.invoke('generate-ugc')`
  - Falls back to local `/api/generate-ugc` for dev environments

Notes
- Replace the placeholder `falEndpoint` in the function with the official Fal.ai endpoint for your model and payload structure.
- To enforce user quotas, read the authenticated user from the JWT:
  - `const authHeader = req.headers.get('authorization')` (format: `Bearer <token>`)
  - Validate or use RLS-protected tables with Supabase’s service role (outside Edge) or via RPC.

Next steps (optional)
- Add a `stripe-webhook` Edge Function to update user entitlements.
- Add rate limiting or per-plan checks inside `generate-ugc`.


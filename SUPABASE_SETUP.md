# Supabase Google OAuth Setup Guide

## Fixing Google Sign-in Redirect Issues

If Google sign-in redirects are failing on your deployed site, follow these steps:

### 1. Configure Redirect URLs in Supabase

Go to your [Supabase Dashboard](https://app.supabase.com) and navigate to:
**Authentication → URL Configuration**

Add these redirect URLs:
```
https://your-app.vercel.app
https://your-custom-domain.com (if you have one)
http://localhost:5173 (for local development)
http://localhost:5174 (for local development)
http://localhost:3000 (for Vercel dev)
```

Replace `your-app` with your actual Vercel app name.

### 2. Configure Google OAuth Provider

In Supabase Dashboard, go to:
**Authentication → Providers → Google**

Make sure you have:
- Client ID (from Google Cloud Console)
- Client Secret (from Google Cloud Console)
- Both fields properly configured

### 3. Update Google Cloud Console

Go to [Google Cloud Console](https://console.cloud.google.com):

1. Select your project
2. Go to **APIs & Services → Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add these to **Authorized redirect URIs**:
   ```
   https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
   ```
   Replace `YOUR_SUPABASE_PROJECT` with your actual Supabase project ID.

### 4. Environment Variables in Vercel

Ensure these are set in your Vercel project settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 5. Common Issues and Solutions

#### Issue: "Redirect URI mismatch"
**Solution**: The redirect URL in your app must exactly match one in Supabase and Google Console.

#### Issue: "User stuck after selecting Google account"
**Solution**: Check browser console for errors. Usually means the redirect URL isn't properly configured.

#### Issue: "Invalid redirect_uri"
**Solution**: Make sure your Vercel deployment URL is added to both Supabase and Google OAuth settings.

### 6. Testing

1. Open browser DevTools Console
2. Try to sign in with Google
3. Check for any error messages
4. The console will log the redirect URL being used

### 7. Debugging Tips

Add this temporary code to see what URL is being used:
```javascript
console.log('Current origin:', window.location.origin);
console.log('Full URL:', window.location.href);
```

### 8. Important Notes

- After updating Supabase settings, it may take a few minutes to propagate
- Clear your browser cache and cookies if sign-in was previously failing
- Make sure your Vercel deployment has finished before testing

## Need More Help?

1. Check Supabase logs: Dashboard → Logs → Auth
2. Check browser console for detailed error messages
3. Verify all URLs match exactly (no trailing slashes difference)
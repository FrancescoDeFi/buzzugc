import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import img1 from '../images/image1.png';
import img2 from '../images/image2.png';
import img3 from '../images/image3.png';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Fallback for demo mode when Supabase is not configured
        console.warn('Supabase not configured, using demo mode');
        onLogin(email);
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              app_url: window.location.origin
            }
          },
        });
        if (signUpError) throw signUpError;
        onLogin(email);
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onLogin(data.user?.email ?? email);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Fallback for demo mode when Supabase is not configured
        console.warn('Supabase not configured, using demo mode');
        onLogin('demo@buzzugc.com');
        return;
      }

      // After Google OAuth, return users to main app
      const redirectTo = `${window.location.origin}/`;
      console.log('Google OAuth redirect URL:', redirectTo);

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          // PKCE is default; keep it explicit and ensure we handle code exchange on return
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });

      if (oauthError) {
        console.error('OAuth error:', oauthError);
        throw oauthError;
      }

      // The OAuth flow will redirect, so we don't need to do anything else here
      console.log('OAuth initiated, redirecting to Google...');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Video examples */}
      <div className="hidden lg:flex lg:w-2/3 bg-white p-8">
        <div className="w-full flex items-center justify-center">
          <div className="grid grid-cols-3 gap-6 max-w-4xl">
            {/* AI demo images (uniform size and layout) */}
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100">
              <img src={img1} alt="AI Avatar Demo 1" className="w-full h-full object-cover" />
            </div>
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100">
              <img src={img2} alt="AI Avatar Demo 2" className="w-full h-full object-cover" />
            </div>
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100">
              <img src={img3} alt="AI Avatar Demo 3" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Bottom stats section */}
        <div className="absolute bottom-8 left-8 right-1/3">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex text-yellow-400">
              {'★'.repeat(5)}
            </div>
            <span className="text-xl font-bold text-gray-800">4.8</span>
          </div>
          <p className="text-gray-600">Used by thousands of Brands</p>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="w-full lg:w-1/3 flex items_center justify_center p-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-900">buzzUGC</span>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 text-gray-900">{isSignUp ? 'Create account' : 'Sign in'}</h1>
            <p className="text-gray-700">Start making UGC content with AI.</p>
          </div>

          {/* Google Sign Up */}
          <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-4 text-gray-800 disabled:opacity-50">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items_center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-700">Or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text_gray-800 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!email.trim() || !password.trim() || loading}
            >
              {loading ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-center text-sm text-red-600">{error}</p>
          )}

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-gray-700">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

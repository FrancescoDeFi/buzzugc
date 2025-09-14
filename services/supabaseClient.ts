import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Authentication features will be disabled.');
}

// Create a dummy client if env vars are missing to prevent app crash
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithOAuth: async () => ({ error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } }
        })
      },
      from: () => ({
        select: () => ({
          order: () => ({
            data: [],
            error: null
          })
        }),
        insert: async () => ({ data: null, error: new Error('Supabase not configured') })
      })
    } as any;



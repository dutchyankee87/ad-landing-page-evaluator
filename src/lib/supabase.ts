import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for Supabase auth
export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    company?: string;
  };
};

export type Session = {
  user: User;
  access_token: string;
};
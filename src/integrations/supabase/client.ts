import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log to help debug
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Lovable Cloud environment variables are missing. Please ensure Cloud is properly enabled.');
  throw new Error('Lovable Cloud is not configured. Please contact support if this persists.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

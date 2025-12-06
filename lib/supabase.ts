import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvpiquvbgrdtjlixqmlt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_D8QeDOQCzrZ0JWVD7LTPjw_WRWV8hzu';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
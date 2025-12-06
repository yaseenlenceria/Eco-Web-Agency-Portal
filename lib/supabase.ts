import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvpiquvbgrdtjlixqmlt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cGlxdXZiZ3JkdGpsaXhxbWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMTQ4ODIsImV4cCI6MjA1MTU5MDg4Mn0.4m7FfWkUWJ_y4c0xMx1zFp9V7gY-8b1Jf2VhZq9A9n4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
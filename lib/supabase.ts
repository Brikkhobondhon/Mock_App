import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate that credentials are provided
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file');
  console.error('Check SUPABASE_SETUP.md for setup instructions');
  
  // Provide helpful error message
  throw new Error(
    'Supabase credentials not found. Please create a .env file with your Supabase URL and API key. ' +
    'See SUPABASE_SETUP.md for detailed instructions.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug connection
console.log('🔗 Supabase connection initialized');
console.log('🌐 URL:', supabaseUrl);
console.log('🔑 Key length:', supabaseAnonKey.length);

// Test the connection
supabase.from('employees').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
    } else {
      console.log('✅ Supabase connection successful! Employee count:', count);
    }
  })
  .catch(error => {
    console.error('❌ Failed to test Supabase connection:', error);
  });

// Database types for TypeScript
export interface Employee {
  id: number;
  name: string;
  designation: string;
  department: string;
  created_at: string;
  photo_url?: string;
  updated_at?: string;
}

// Database table name
export const EMPLOYEES_TABLE = 'employees'; 
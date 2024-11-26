import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://fxvmowmuqidbywkigwft.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dm1vd211cWlkYnl3a2lnd2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NjQ5NjEsImV4cCI6MjA0ODE0MDk2MX0.Z6SC0fQWZcIe2taFkDno9CrrN0Zl-ezQs7MbALmKx8Y';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 
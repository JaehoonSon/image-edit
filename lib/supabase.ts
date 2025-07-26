import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mgrvscrypxoohasneksp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncnZzY3J5cHhvb2hhc25la3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzY0OTgsImV4cCI6MjA2NDgxMjQ5OH0.3yXnh014CnPRKe_R3ThzNrachw6PFUZzSy_RYLbctxo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

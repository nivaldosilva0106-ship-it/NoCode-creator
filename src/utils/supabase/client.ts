import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Key not configured in .env.local");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

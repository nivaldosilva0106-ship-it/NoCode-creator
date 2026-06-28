import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("[Supabase Server] URL or Key not configured in .env.local");
}

export const supabaseServer = createClient(supabaseUrl, supabaseKey);

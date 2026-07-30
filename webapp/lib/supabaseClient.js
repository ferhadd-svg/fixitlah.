import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// `null` when env vars aren't set yet (e.g. local dev before a Supabase
// project exists) — callers should check `isSupabaseConfigured` and fall
// back to demo content rather than crashing the page.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

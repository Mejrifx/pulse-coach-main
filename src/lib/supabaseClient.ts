import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/**
 * True when both URL and anon key are set (e.g. in `.env` locally or in the host’s
 * build env). Vite replaces `import.meta.env` at **build** time — add the same vars
 * in Vercel/Netlify/etc. and redeploy.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

/** Browser-safe client (anon key + RLS). `null` if env is missing — do not call `createClient` with empty strings (throws). */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

const dummyClient = {
  from: () => ({
    select: async () => ({ data: null, error: new Error("Supabase not configured") }),
    insert: async () => ({ data: null, error: new Error("Supabase not configured") }),
    update: async () => ({ data: null, error: new Error("Supabase not configured") }),
    delete: async () => ({ data: null, error: new Error("Supabase not configured") }),
    eq: () => ({
      maybeSingle: async () => ({ data: null, error: new Error("Supabase not configured") }),
    }),
    order: () => ({
      select: async () => ({ data: null, error: new Error("Supabase not configured") }),
    }),
  }),
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: new Error("Supabase not configured") }),
      remove: async () => ({ data: null, error: new Error("Supabase not configured") }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
    }),
  },
};

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase environment variables not set. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY"
  );
}

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
    })
  : dummyClient;

export default supabase;

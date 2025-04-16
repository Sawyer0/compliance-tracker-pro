import { useState, useEffect } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

export function useSupabase() {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initializeClient() {
      try {
        console.log("Initializing Supabase client with token...");

        const tokenResponse = await fetch("/api/supabase-token");
        if (!tokenResponse.ok) {
          throw new Error(`Failed to fetch token: ${tokenResponse.status}`);
        }

        const { token } = await tokenResponse.json();
        console.log("Token received:", !!token);

        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          }
        );

        console.log("Supabase client created with token");
        setClient(supabase);
      } catch (err) {
        console.error("Error initializing Supabase client:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    initializeClient();
  }, []);

  return { client, loading, error };
}

import { useState, useEffect } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

// Create a singleton instance of the Supabase client
let supabaseClientInstance: SupabaseClient | null = null;

// Keep track of authentication state
let authToken: string | null = null;

export function useSupabase() {
  const [client, setClient] = useState<SupabaseClient | null>(
    supabaseClientInstance
  );
  const [loading, setLoading] = useState(!supabaseClientInstance);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If we already have a client instance, don't create a new one
    if (supabaseClientInstance) {
      setClient(supabaseClientInstance);
      setLoading(false);
      return;
    }

    async function initializeClient() {
      try {
        // Only fetch a new token if we don't have one yet
        if (!authToken) {
          const tokenResponse = await fetch("/api/supabase-token");
          if (!tokenResponse.ok) {
            throw new Error(`Failed to fetch token: ${tokenResponse.status}`);
          }
          const { token } = await tokenResponse.json();
          authToken = token;
        }

        // Create the client only once
        if (!supabaseClientInstance) {
          supabaseClientInstance = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
              global: {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              },
              // Disable automatic refresh of auth token to prevent multiple listeners
              auth: {
                autoRefreshToken: false,
                persistSession: true,
              },
            }
          );
        }

        setClient(supabaseClientInstance);
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

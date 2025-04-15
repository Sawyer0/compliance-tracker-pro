import { useState, useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/getSupabaseClient";

export function useSupabase() {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initSupabase() {
      try {
        setLoading(true);
        const res = await fetch("/api/supabase-token");

        if (!res.ok) {
          throw new Error("Failed to fetch Supabase token");
        }

        const { token } = await res.json();
        const supabaseClient = getSupabaseClient(token);
        setClient(supabaseClient);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }

    initSupabase();
  }, []);

  return { client, loading, error };
}

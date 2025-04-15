"use client";

import { useEffect, useState, ReactNode } from "react";
import { getSupabaseClient } from "@/lib/getSupabaseClient";

interface Props {
  children: (supabase: any) => ReactNode;
}

export default function SecureSupabaseProvider({ children }: Props) {
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const fetchTokenAndInit = async () => {
      const res = await fetch("/api/supabase-token");
      const { token } = await res.json();
      const client = getSupabaseClient(token);
      setSupabase(client);
    };

    fetchTokenAndInit();
  }, []);

  if (!supabase) return <div>Loading dashboard...</div>;

  return <>{children(supabase)}</>;
}

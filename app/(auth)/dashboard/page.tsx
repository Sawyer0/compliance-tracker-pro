"use client";

import { getSupabaseClient } from "@/lib/getSupabaseClient";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [supabase, setSupabase] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/assign-role", { method: "POST" });
    const initSupabase = async () => {
      const res = await fetch("/api/supabase-token");
      const { token } = await res.json();
      const client = getSupabaseClient(token);
      setSupabase(client);
    };

    initSupabase();
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("departments").select("*");
      if (error) {
        console.error("Error fetching departments:", error);
      } else {
        setDepartments(data);
      }
    };

    fetchDepartments();
  }, [supabase]);

  return (
    <div>
      <h1>Welcome to your dashboard</h1>
      <ul>
        {departments.map((dept) => (
          <li key={dept.id}>
            {dept.name} - {dept.progress}% complete
          </li>
        ))}
      </ul>
    </div>
  );
}

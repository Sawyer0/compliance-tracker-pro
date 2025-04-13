"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/getSupabaseClient";
import DashboardCard from "@/components/DashboardCard";

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome to your dashboard</h1>

      <ul className="space-y-4">
        {departments.map((dept) => (
          <DashboardCard
            key={dept.id}
            id={dept.id}
            name={dept.name}
            progress={dept.progress}
            totalTasks={dept.totalTasks}
            overdueTasks={dept.overdueTasks}
          />
        ))}
      </ul>

      <p className="text-sm text-gray-400">
        {departments.length} departments tracked
      </p>
    </div>
  );
}

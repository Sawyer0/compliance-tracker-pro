"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/getSupabaseClient";
import DashboardCard from "@/components/DashboardCard";
import { Department } from "@/types/checklist";

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
      const { data, error } = await supabase.from("departments").select(`
          id,
          name,
          checklists (
            completed,
            due_date
          )
        `);

      if (error) {
        console.error("Error fetching departments:", error);
      } else {
        const enrichedDepartments = data.map((dept: Department) => {
          const totalTasks = dept.checklists?.length || 0;
          const completedTasks =
            dept.checklists?.filter((task) => task.completed).length || 0;
          const overdueTasks =
            dept.checklists?.filter(
              (task) => !task.completed && new Date(task.due_date) < new Date()
            ).length || 0;

          const progress =
            totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0;

          return {
            ...dept,
            totalTasks,
            overdueTasks,
            progress,
          };
        });

        setDepartments(enrichedDepartments);
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
            totalTasks={dept.totalTasks}
            overdueTasks={dept.overdueTasks}
            progress={dept.progress}
          />
        ))}
      </ul>

      <p className="text-sm text-gray-400">
        {departments.length} departments tracked
      </p>
    </div>
  );
}

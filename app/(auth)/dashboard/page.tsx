"use client";

import { useEffect, useState } from "react";
import QuickActionCards from "@/components/dashboard/QuickActionCards";
import { getSupabaseClient } from "@/lib/getSupabaseClient";
import KpiCards from "@/components/dashboard/KpiCards";
import CompletionBarChart from "@/components/dashboard/CompletionBarChart";
import TasksLineChart from "@/components/dashboard/TasksLineChart";

import { Department } from "@/types/checklist";

export default function DashboardPage() {
  const [supabase, setSupabase] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);

  const flatChecklists = departments.flatMap((dept: Department) =>
    dept.checklists.map((item: any) => ({
      ...item,
      department: dept.name,
    }))
  );

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
            due_date,
            created_at
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <QuickActionCards />
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Quick Stats</h2>
        <KpiCards departments={departments} />
      </div>

      <p className="text-sm text-gray-400">
        {departments.length} departments tracked
      </p>

      <div className="dashboard-section">
        <h2 className="section-title">Task Completion by Department</h2>
        <CompletionBarChart departments={departments} />
      </div>
      <div className="dashboard-section">
        <h2 className="section-title">Tasks Completed Over Time</h2>
        <TasksLineChart checklistItems={flatChecklists} />
      </div>
    </div>
  );
}

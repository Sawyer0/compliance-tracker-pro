"use client";

import { useEffect } from "react";
import QuickActionCards from "@/components/dashboard/QuickActionCards";
import KpiCards from "@/components/dashboard/KpiCards";
import CompletionBarChart from "@/components/dashboard/CompletionBarChart";
import TasksLineChart from "@/components/dashboard/TasksLineChart";
import { useDepartments } from "@/lib/hooks/useDepartments";
import { ChecklistItem, Department } from "@/types/checklist";

export default function DashboardPage() {
  const { departments, isLoading, isError, error } = useDepartments();

  useEffect(() => {
    fetch("/api/assign-role", { method: "POST" });
  }, []);

  const flatChecklists = departments.flatMap((dept: Department) =>
    dept.checklists.map((item: ChecklistItem) => ({
      ...item,
      department: dept.name,
    }))
  );

  if (isLoading) {
    return <p className="loading-text">Loading dashboard data...</p>;
  }

  if (isError) {
    return (
      <p className="error-text">
        Error loading dashboard: {(error as Error).message}
      </p>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6 w-full">
          <h2 className="section-title">Quick Actions</h2>
          <QuickActionCards variant="left" />
          <QuickActionCards variant="right" />

          <div className="dashboard-section">
            <h2 className="section-title">Quick Stats</h2>
            <KpiCards departments={departments} />
          </div>
        </div>

        <div className="space-y-6 w-full">
          <div className="dashboard-section space-y-6">
            <div>
              <h2 className="section-title">Task Completion by Department</h2>
              <CompletionBarChart departments={departments} />
            </div>
            <div>
              <h2 className="section-title">Tasks Completed Over Time</h2>
              <TasksLineChart checklistItems={flatChecklists} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

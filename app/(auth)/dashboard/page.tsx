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
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-6 sm:space-y-8 w-full">
          <div className="actions-section">
            <h2 className="actions-title">Quick Actions</h2>
            <div>
              <div className="hidden sm:block">
                <div className="space-y-2 sm:space-y-4">
                  <QuickActionCards variant="left" />
                  <QuickActionCards variant="right" />
                </div>
              </div>
              <div className="sm:hidden">
                <QuickActionCards variant="left" />
                <div className="mt-2">
                  <QuickActionCards variant="right" />
                </div>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h2 className="section-title mb-4">Quick Stats</h2>
            <KpiCards
              departments={departments.map((dept) => ({
                id: dept.id,
                name: dept.name,
                progress: dept.progress,
                totalTasks: dept.totalTasks || 0,
                overdueTasks: dept.overdueTasks || 0,
              }))}
            />
          </div>
        </div>

        <div className="charts-section">
          <div className="space-y-6 w-full">
            <div>
              <h2 className="chart-title">Task Completion by Department</h2>
              <div className="chart-container">
                <CompletionBarChart
                  departments={departments.map((dept) => ({
                    id: dept.id,
                    name: dept.name,
                    progress: dept.progress,
                  }))}
                />
              </div>
            </div>
            <div>
              <h2 className="chart-title">Tasks Completed Over Time</h2>
              <div className="chart-container">
                <TasksLineChart checklistItems={flatChecklists} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

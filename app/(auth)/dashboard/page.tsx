"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import QuickActionCards from "@/components/dashboard/QuickActionCards";
import KpiCards from "@/components/dashboard/KpiCards";
import { useDepartments } from "@/lib/hooks/useDepartments";
import { ChecklistItem, Department } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Dynamic imports for heavy components
const CompletionBarChart = dynamic(
  () => import("@/components/dashboard/CompletionBarChart"),
  {
    loading: () => (
      <div className="loading-skeleton h-64 bg-gray-100 animate-pulse rounded-lg" />
    ),
    ssr: false,
  }
);

const TasksLineChart = dynamic(
  () => import("@/components/dashboard/TasksLineChart"),
  {
    loading: () => (
      <div className="loading-skeleton h-64 bg-gray-100 animate-pulse rounded-lg" />
    ),
    ssr: false,
  }
);

const CreateDepartmentModal = dynamic(
  () =>
    import("@/components/departments").then((mod) => mod.CreateDepartmentModal),
  { ssr: false }
);

export default function DashboardPage() {
  const { departments, isLoading, isError, error } = useDepartments();
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] =
    useState(false);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <Button
          onClick={() => setIsCreateDepartmentModalOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          New Department
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
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

          <div className="stats-section lg:hidden">
            <h2 className="section-title mb-4">Quick Stats</h2>
            <Suspense
              fallback={
                <div className="loading-skeleton h-48 bg-gray-100 animate-pulse rounded-lg" />
              }
            >
              <KpiCards
                departments={departments.map((dept) => ({
                  id: dept.id,
                  name: dept.name,
                  progress: dept.progress,
                  totalTasks: dept.totalTasks || 0,
                  overdueTasks: dept.overdueTasks || 0,
                }))}
              />
            </Suspense>
          </div>

          <div className="charts-section">
            <div className="space-y-6 w-full">
              <div>
                <h2 className="chart-title">Task Completion by Department</h2>
                <div className="chart-container">
                  <Suspense
                    fallback={
                      <div className="loading-skeleton h-64 bg-gray-100 animate-pulse rounded-lg" />
                    }
                  >
                    <CompletionBarChart
                      departments={departments.map((dept) => ({
                        id: dept.id,
                        name: dept.name,
                        progress: dept.progress,
                      }))}
                    />
                  </Suspense>
                </div>
              </div>
              <div>
                <h2 className="chart-title">Tasks Completed Over Time</h2>
                <div className="chart-container">
                  <Suspense
                    fallback={
                      <div className="loading-skeleton h-64 bg-gray-100 animate-pulse rounded-lg" />
                    }
                  >
                    <TasksLineChart checklistItems={flatChecklists} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="stats-section">
            <h2 className="section-title mb-4">Quick Stats</h2>
            <Suspense
              fallback={
                <div className="loading-skeleton h-48 bg-gray-100 animate-pulse rounded-lg" />
              }
            >
              <KpiCards
                departments={departments.map((dept) => ({
                  id: dept.id,
                  name: dept.name,
                  progress: dept.progress,
                  totalTasks: dept.totalTasks || 0,
                  overdueTasks: dept.overdueTasks || 0,
                }))}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {isCreateDepartmentModalOpen && (
        <CreateDepartmentModal
          isOpen={isCreateDepartmentModalOpen}
          onClose={() => setIsCreateDepartmentModalOpen(false)}
        />
      )}
    </div>
  );
}

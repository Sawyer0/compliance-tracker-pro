import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface KpiCardsProps {
  departments: {
    id: string;
    name: string;
    totalTasks: number;
    overdueTasks: number;
    progress: number;
  }[];
}

export default function KpiCards({ departments }: KpiCardsProps) {
  const totalTasks = departments.reduce((sum, d) => sum + d.totalTasks, 0);
  const completedTasks = Math.round(
    (departments.reduce((sum, d) => sum + d.progress, 0) / 100) *
      departments.length
  );
  const overdueTasks = departments.reduce((sum, d) => sum + d.overdueTasks, 0);
  const percentComplete =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // State for counter animation
  const [counts, setCounts] = useState({
    total: 0,
    percent: 0,
    overdue: 0,
    depts: 0,
  });

  useEffect(() => {
    // Animation duration in ms
    const duration = 1500;
    const steps = 30;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        total: Math.round(progress * totalTasks),
        percent: Math.round(progress * percentComplete),
        overdue: Math.round(progress * overdueTasks),
        depts: Math.round(progress * departments.length),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts({
          total: totalTasks,
          percent: percentComplete,
          overdue: overdueTasks,
          depts: departments.length,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [totalTasks, percentComplete, overdueTasks, departments.length]);

  return (
    <div className="kpi-cards">
      <div className="stat-container">
        <div className="stat-title">TOTAL TASKS</div>
        <div className="stat-value text-indigo-900">{counts.total}</div>
      </div>

      <div className="stat-container">
        <div className="stat-title">COMPLETED</div>
        <div className="stat-value">
          <Badge
            className={`${
              percentComplete > 50 ? "bg-indigo-600" : "bg-indigo-300"
            } text-white px-3 py-1 text-sm rounded-full`}
          >
            {counts.percent}%
          </Badge>
        </div>
      </div>

      <div className="stat-container">
        <div className="stat-title">OVERDUE</div>
        <div className="stat-value">
          {overdueTasks > 0 ? (
            <Badge className="bg-rose-500 text-white px-3 py-1 text-sm rounded-full">
              {counts.overdue}
            </Badge>
          ) : (
            <span className="text-indigo-900">0</span>
          )}
        </div>
      </div>

      <div className="stat-container">
        <div className="stat-title">DEPARTMENTS</div>
        <div className="stat-value text-indigo-900">{counts.depts}</div>
      </div>
    </div>
  );
}

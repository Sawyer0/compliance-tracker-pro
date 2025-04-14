"use client";

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

  return (
    <div className="kpi-cards">
      <div className="kpi-card">
        <div className="kpi-title">Total Tasks</div>
        <div className="kpi-value">{totalTasks}</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-title">Completed</div>
        <div className="kpi-value">{percentComplete}%</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-title">Overdue</div>
        <div className="kpi-value text-red-600">{overdueTasks}</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-title">Departments</div>
        <div className="kpi-value">{departments.length}</div>
      </div>
    </div>
  );
}

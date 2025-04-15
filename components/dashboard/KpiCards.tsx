import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="kpi-cards">
      <Card>
        <CardContent className="p-4 text-center">
          <CardTitle className="kpi-title">Total Tasks</CardTitle>
          <div className="kpi-value">{totalTasks}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <CardTitle className="kpi-title">Completed</CardTitle>
          <div className="kpi-value">
            <Badge variant={percentComplete > 50 ? "default" : "secondary"}>
              {percentComplete}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <CardTitle className="kpi-title">Overdue</CardTitle>
          <div className="kpi-value">
            {overdueTasks > 0 ? (
              <Badge variant="destructive">{overdueTasks}</Badge>
            ) : (
              <span>0</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <CardTitle className="kpi-title">Departments</CardTitle>
          <div className="kpi-value">{departments.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}

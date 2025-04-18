import React, { useEffect, useState } from "react";

import {
  Clock,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  ListChecks,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { theme} from "@/lib/theme";


interface KpiCardsProps {
  departments: {
    id: string;
    name: string;
    totalTasks: number;
    overdueTasks: number;
    progress: number;
  }[];
}

const TrendIndicator = ({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) => {
  const difference = current - previous;
  if (difference === 0) return null;

  if (difference > 0) {
    return (
      <div className="flex items-center text-emerald-500">
        <ArrowUp className="h-4 w-4 mr-1" />
        <span className={`text-xs`}>+{difference.toFixed(1)}%</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-rose-500">
      <ArrowDown className="h-4 w-4 mr-1" />
      <span className={`text-xs`}>{difference.toFixed(1)}%</span>
    </div>
  );
};

const kpiCardStyles = {
  container: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
  card: `${theme.rounded.lg} border-gray-200 hover:border-gray-300 ${theme.transitions.default}`,
  cardHeader: "pb-2 space-y-0",
  cardTitle: `text-sm font-medium text-gray-500`,
  cardContent: "space-y-2",
  value: `text-2xl font-bold text-gray-900`,
  icon: {
    base: "p-2 rounded-full",
    tasks: "bg-indigo-100 text-indigo-600",
    completed: "bg-emerald-100 text-emerald-600",
    overdue: "bg-rose-100 text-rose-600",
    rate: "bg-amber-100 text-amber-600",
  },
};

export default function KpiCards({ departments }: KpiCardsProps) {
  const totalTasks = departments.reduce((sum, d) => sum + d.totalTasks, 0);
  const completedTasks = Math.round(
    (departments.reduce((sum, d) => sum + d.progress, 0) / 100) *
      departments.length
  );
  const overdueTasks = departments.reduce((sum, d) => sum + d.overdueTasks, 0);
  const percentComplete =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const [counts, setCounts] = useState({
    total: 0,
    percent: 0,
    overdue: 0,
    depts: 0,
  });

  useEffect(() => {
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
    <div className={kpiCardStyles.container}>
      <Card className={kpiCardStyles.card}>
        <CardHeader className={kpiCardStyles.cardHeader}>
          <CardTitle className={kpiCardStyles.cardTitle}>Total Tasks</CardTitle>
        </CardHeader>
        <CardContent className={kpiCardStyles.cardContent}>
          <div className="flex items-center justify-between">
            <span className={kpiCardStyles.value}>{totalTasks}</span>
            <div
              className={`${kpiCardStyles.icon.base} ${kpiCardStyles.icon.tasks}`}
            >
              <ListChecks className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={kpiCardStyles.card}>
        <CardHeader className={kpiCardStyles.cardHeader}>
          <CardTitle className={kpiCardStyles.cardTitle}>Completed</CardTitle>
        </CardHeader>
        <CardContent className={kpiCardStyles.cardContent}>
          <div className="flex items-center justify-between">
            <span className={kpiCardStyles.value}>{completedTasks}</span>
            <div
              className={`${kpiCardStyles.icon.base} ${kpiCardStyles.icon.completed}`}
            >
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={kpiCardStyles.card}>
        <CardHeader className={kpiCardStyles.cardHeader}>
          <CardTitle className={kpiCardStyles.cardTitle}>Overdue</CardTitle>
        </CardHeader>
        <CardContent className={kpiCardStyles.cardContent}>
          <div className="flex items-center justify-between">
            <span className={kpiCardStyles.value}>{overdueTasks}</span>
            <div
              className={`${kpiCardStyles.icon.base} ${kpiCardStyles.icon.overdue}`}
            >
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={kpiCardStyles.card}>
        <CardHeader className={kpiCardStyles.cardHeader}>
          <CardTitle className={kpiCardStyles.cardTitle}>
            Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent className={kpiCardStyles.cardContent}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className={kpiCardStyles.value}>
                {percentComplete.toFixed(1)}%
              </span>
              <TrendIndicator current={percentComplete} previous={0} />
            </div>
            <div
              className={`${kpiCardStyles.icon.base} ${kpiCardStyles.icon.rate}`}
            >
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

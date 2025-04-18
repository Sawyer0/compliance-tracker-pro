"use client";

import React from "react";
import Link from "next/link";
import { Building, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardCardProps {
  id: string;
  name: string;
  progress?: number;
  totalTasks?: number;
  overdueTasks?: number;
}

const dashboardCardStyles = {
  link: "group block transition hover:scale-[1.01] transition-all duration-150",
  iconContainer:
    "bg-blue-100 text-blue-600 p-2 rounded-lg flex items-center justify-center",
  titleContainer: "flex items-center gap-4",
  progressText: "text-sm text-gray-500",
  emptyStateText: "text-sm italic text-gray-400",
  progressBarContainer: "h-2 w-full bg-gray-200 rounded-full overflow-hidden",
  progressBarFill: "h-full bg-brand rounded-full transition-all",
  statsContainer: "flex items-center justify-between text-sm text-gray-600",
  statsCount: "font-medium text-gray-900",
  statsOverdue: "flex items-center gap-1",
  statsIcon: "h-4 w-4 text-rose-500",
  statsEmpty: "italic",
  viewMore: "text-sm font-medium text-blue-600 hover:underline",
};

export default function DashboardCard({
  id,
  name,
  progress = 0,
  totalTasks = 0,
  overdueTasks = 0,
}: DashboardCardProps) {
  const noTasks = totalTasks === 0;

  return (
    <Link
      href={`/dashboard/department/${id}`}
      aria-label={`View ${name} department details`}
      className={dashboardCardStyles.link}
    >
      <Card className="h-full">
        <CardHeader>
          <div className={dashboardCardStyles.titleContainer}>
            <div className={dashboardCardStyles.iconContainer}>
              <Building className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>{name}</CardTitle>
              <p className={dashboardCardStyles.progressText}>
                {noTasks ? (
                  <span className={dashboardCardStyles.emptyStateText}>
                    No tasks yet
                  </span>
                ) : (
                  `${progress}% complete`
                )}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className={dashboardCardStyles.progressBarContainer}>
            <div
              role="progressbar"
              className={dashboardCardStyles.progressBarFill}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={dashboardCardStyles.statsContainer}>
            <div>
              Total Tasks:{" "}
              <span className={dashboardCardStyles.statsCount}>
                {totalTasks}
              </span>
            </div>
            <div className={dashboardCardStyles.statsOverdue}>
              <AlertCircle className={dashboardCardStyles.statsIcon} />
              <span>
                Overdue:{" "}
                {overdueTasks > 0 ? (
                  <Badge variant="destructive">{overdueTasks}</Badge>
                ) : (
                  <span className={dashboardCardStyles.statsEmpty}>0</span>
                )}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <span className={dashboardCardStyles.viewMore}>View Details →</span>
        </CardFooter>
      </Card>
    </Link>
  );
}

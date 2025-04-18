import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusType = "pending" | "in-progress" | "completed" | "overdue";

interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
}

const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  pending: {
    label: "Pending",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  "in-progress": {
    label: "In Progress",
    bgColor: "bg-amber-100",
    textColor: "text-amber-800",
  },
  completed: {
    label: "Completed",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-800",
  },
  overdue: {
    label: "Overdue",
    bgColor: "bg-rose-100",
    textColor: "text-rose-800",
  },
};

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showLabel?: boolean;
  icon?: React.ReactNode;
}

export function StatusBadge({
  status,
  className,
  showLabel = true,
  icon,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {icon || config.icon}
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

export function getTaskStatus(completed: boolean, dueDate: string): StatusType {
  if (completed) {
    return "completed";
  }

  const now = new Date();
  const taskDueDate = new Date(dueDate);

  if (taskDueDate < now) {
    return "overdue";
  }

  // Can add more logic here to determine in-progress vs pending
  return "pending";
}

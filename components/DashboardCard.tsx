"use client";

import React from "react";
import Link from "next/link";
import { Building, AlertCircle } from "lucide-react";

interface DashboardCardProps {
  id: string;
  name: string;
  progress?: number;
  totalTasks?: number;
  overdueTasks?: number;
}

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
      className="group block rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md hover:scale-[1.01]"
    >
      <li className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-semibold">{name}</div>
            <div className="text-sm text-gray-500">
              {noTasks ? (
                <span className="italic text-gray-400">No tasks yet</span>
              ) : (
                `${progress}% complete`
              )}
            </div>
          </div>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            role="progressbar"
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Total Tasks:{" "}
            <span className="font-medium text-gray-900">{totalTasks}</span>
          </div>
          <div className="flex items-center gap-1 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>
              Overdue:{" "}
              <span className="italic text-red-500">{overdueTasks}</span>
            </span>
          </div>
        </div>

        <div className="text-sm text-right text-blue-600 font-medium hover:underline">
          View Details →
        </div>
      </li>
    </Link>
  );
}

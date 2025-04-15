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
      className="group block transition hover:scale-[1.01]"
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>{name}</CardTitle>
              <p className="text-sm text-gray-500">
                {noTasks ? (
                  <span className="italic text-gray-400">No tasks yet</span>
                ) : (
                  `${progress}% complete`
                )}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
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
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span>
                Overdue:{" "}
                {overdueTasks > 0 ? (
                  <Badge variant="destructive">{overdueTasks}</Badge>
                ) : (
                  <span className="italic">0</span>
                )}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <span className="text-sm text-blue-600 font-medium hover:underline">
            View Details →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";

interface Props {
  departments: {
    id: string;
    name: string;
    progress: number;
  }[];
}

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-indigo-600">
          Progress: <span className="font-bold">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function CompletionBarChart({ departments }: Props) {
  const sortedDepartments = [...departments].sort(
    (a, b) => b.progress - a.progress
  );

  const topDepartments = sortedDepartments.slice(0, 4);

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-gray-800">
          Department Progress
        </CardTitle>

        <Dialog>
          <DialogTrigger asChild>
            <div
              className="hidden sm:flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer"
              aria-label="Expand chart"
            >
              <Maximize2 className="h-4 w-4" />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[80vh] bg-white p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-xl">
                Department Completion Rates
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 h-[calc(100%-60px)] bg-white overflow-auto">
              <div className="min-w-[800px] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departments}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      tickLine={{ stroke: "#E5E7EB" }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      tickLine={{ stroke: "#E5E7EB" }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="progress"
                      fill="#4F46E5"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* Mobile view (hidden on larger screens) */}
        <div className="sm:hidden">
          <Dialog>
            <DialogTrigger className="w-full">
              <div className="cursor-pointer">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={topDepartments}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6B7280", fontSize: 10 }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      tickLine={false}
                    />
                    <YAxis domain={[0, 100]} hide={true} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="progress"
                      fill="#4F46E5"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center">
                  <div className="mt-2 text-xs text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50">
                    {departments.length > 4 &&
                      `+ ${departments.length - 4} more`}{" "}
                    Tap to expand
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[80vh] bg-white p-0">
              <DialogHeader className="p-4 border-b">
                <DialogTitle className="text-xl">
                  Department Completion Rates
                </DialogTitle>
              </DialogHeader>
              <div className="p-4 h-[calc(100%-60px)] bg-white overflow-auto">
                <div className="min-w-[800px] h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departments}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={{ stroke: "#E5E7EB" }}
                        tickLine={{ stroke: "#E5E7EB" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={{ stroke: "#E5E7EB" }}
                        tickLine={{ stroke: "#E5E7EB" }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="progress"
                        fill="#4F46E5"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Desktop normal view (hidden on small screens) */}
        <div className="hidden sm:block">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={departments}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={{ stroke: "#E5E7EB" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={{ stroke: "#E5E7EB" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="progress"
                fill="#4F46E5"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

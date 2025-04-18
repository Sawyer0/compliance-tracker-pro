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

const chartStyles = {
  container: {
    fullHeight: "h-full",
    minWidth: "min-w-[800px]",
  },
  chart: {
    bar: {
      fill: "#4F46E5",
      radius: [4, 4, 0, 0] as [number, number, number, number],
      animationDuration: 1500,
    },
    grid: {
      stroke: "#f0f0f0",
      strokeDasharray: "3 3",
    },
    axis: {
      tick: {
        fill: "#6B7280",
        fontSize: 12,
      },
      line: {
        stroke: "#E5E7EB",
      },
    },
  },
  tooltip: {
    container: "bg-white p-3 border border-gray-200 shadow rounded-md",
    label: "font-medium text-gray-800",
    value: "text-indigo-600",
    valueHighlight: "font-bold",
  },
  dialog: {
    trigger:
      "hidden sm:flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-150",
    content: "sm:max-w-[90vw] w-[90vw] h-[80vh] bg-white p-0",
    header: "p-4 border-b",
    title: "text-xl",
    contentArea: "p-4 h-[calc(100%-60px)] bg-white overflow-auto",
  },
  mobile: {
    tapToExpand:
      "mt-2 text-xs text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50",
  },
};

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={chartStyles.tooltip.container}>
        <p className={chartStyles.tooltip.label}>{label}</p>
        <p className={chartStyles.tooltip.value}>
          Progress:{" "}
          <span className={chartStyles.tooltip.valueHighlight}>
            {payload[0].value}%
          </span>
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
              className={chartStyles.dialog.trigger}
              aria-label="Expand chart"
            >
              <Maximize2 className="h-4 w-4" />
            </div>
          </DialogTrigger>
          <DialogContent className={chartStyles.dialog.content}>
            <DialogHeader className={chartStyles.dialog.header}>
              <DialogTitle className={chartStyles.dialog.title}>
                Department Completion Rates
              </DialogTitle>
            </DialogHeader>
            <div className={chartStyles.dialog.contentArea}>
              <div
                className={
                  chartStyles.container.minWidth +
                  " " +
                  chartStyles.container.fullHeight
                }
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departments}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid
                      strokeDasharray={chartStyles.chart.grid.strokeDasharray}
                      stroke={chartStyles.chart.grid.stroke}
                    />
                    <XAxis
                      dataKey="name"
                      tick={chartStyles.chart.axis.tick}
                      axisLine={chartStyles.chart.axis.line}
                      tickLine={chartStyles.chart.axis.line}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={chartStyles.chart.axis.tick}
                      axisLine={chartStyles.chart.axis.line}
                      tickLine={chartStyles.chart.axis.line}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="progress"
                      fill={chartStyles.chart.bar.fill}
                      radius={chartStyles.chart.bar.radius}
                      animationDuration={
                        chartStyles.chart.bar.animationDuration
                      }
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
                      tick={{ ...chartStyles.chart.axis.tick, fontSize: 10 }}
                      axisLine={chartStyles.chart.axis.line}
                      tickLine={false}
                    />
                    <YAxis domain={[0, 100]} hide={true} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="progress"
                      fill={chartStyles.chart.bar.fill}
                      radius={chartStyles.chart.bar.radius}
                      animationDuration={
                        chartStyles.chart.bar.animationDuration
                      }
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center">
                  <div className={chartStyles.mobile.tapToExpand}>
                    {departments.length > 4 &&
                      `+ ${departments.length - 4} more`}{" "}
                    Tap to expand
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className={chartStyles.dialog.content}>
              <DialogHeader className={chartStyles.dialog.header}>
                <DialogTitle className={chartStyles.dialog.title}>
                  Department Completion Rates
                </DialogTitle>
              </DialogHeader>
              <div className={chartStyles.dialog.contentArea}>
                <div
                  className={
                    chartStyles.container.minWidth +
                    " " +
                    chartStyles.container.fullHeight
                  }
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departments}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid
                        strokeDasharray={chartStyles.chart.grid.strokeDasharray}
                        stroke={chartStyles.chart.grid.stroke}
                      />
                      <XAxis
                        dataKey="name"
                        tick={chartStyles.chart.axis.tick}
                        axisLine={chartStyles.chart.axis.line}
                        tickLine={chartStyles.chart.axis.line}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={chartStyles.chart.axis.tick}
                        axisLine={chartStyles.chart.axis.line}
                        tickLine={chartStyles.chart.axis.line}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="progress"
                        fill={chartStyles.chart.bar.fill}
                        radius={chartStyles.chart.bar.radius}
                        animationDuration={
                          chartStyles.chart.bar.animationDuration
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Desktop view (hidden on small screens) */}
        <div className="hidden sm:block">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={departments}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray={chartStyles.chart.grid.strokeDasharray}
                stroke={chartStyles.chart.grid.stroke}
              />
              <XAxis
                dataKey="name"
                tick={chartStyles.chart.axis.tick}
                axisLine={chartStyles.chart.axis.line}
                tickLine={chartStyles.chart.axis.line}
              />
              <YAxis
                domain={[0, 100]}
                tick={chartStyles.chart.axis.tick}
                axisLine={chartStyles.chart.axis.line}
                tickLine={chartStyles.chart.axis.line}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="progress"
                fill={chartStyles.chart.bar.fill}
                radius={chartStyles.chart.bar.radius}
                animationDuration={chartStyles.chart.bar.animationDuration}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

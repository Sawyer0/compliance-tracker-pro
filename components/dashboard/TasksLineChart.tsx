"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  completed: boolean;
  created_at: string;
}

interface Props {
  checklistItems: ChecklistItem[];
}

const chartStyles = {
  container: {
    fullHeight: "h-full",
    minWidth: "min-w-[800px]",
  },
  chart: {
    line: {
      stroke: "#10B981",
      strokeWidth: 2,
      dot: {
        stroke: "#10B981",
        strokeWidth: 2,
        fill: "#fff",
        radius: 4,
      },
      activeDot: {
        stroke: "#059669",
        strokeWidth: 2,
        fill: "#10B981",
        radius: 6,
      },
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
    container: cn("bg-white p-3 border border-gray-200 shadow rounded-md"),
    label: cn("font-medium text-gray-800"),
    value: "text-emerald-600",
    valueHighlight: "font-bold",
  },
  dialog: {
    trigger: cn(
      "hidden sm:flex items-center justify-center h-8 w-8",
      "rounded-md",
      "border border-gray-200 hover:bg-gray-50 cursor-pointer",
      "transition-all duration-150"
    ),
    content: "sm:max-w-[90vw] w-[90vw] h-[80vh] bg-white p-0",
    header: "p-4 border-b",
    title: cn("text-xl"),
    contentArea: "p-4 h-[calc(100%-60px)] bg-white overflow-auto",
  },
  mobile: {
    tapToExpand: cn(
      "mt-2",
      "text-xs",
      "text-emerald-600 px-2 py-1 rounded hover:bg-emerald-50"
    ),
  },
};

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={chartStyles.tooltip.container}>
        <p className={chartStyles.tooltip.label}>{label}</p>
        <p className={chartStyles.tooltip.value}>
          Tasks Completed:{" "}
          <span className={chartStyles.tooltip.valueHighlight}>
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function TasksLineChart({ checklistItems }: Props) {
  const completed = checklistItems.filter((item) => item.completed);

  let counts: { [key: string]: number } = {};
  completed.forEach((item) => {
    const isoDate = item.created_at.slice(0, 10);
    const date = new Date(isoDate).toLocaleDateString();
    counts[date] = (counts[date] || 0) + 1;
  });

  const data = Object.entries(counts)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get only the most recent dates for the mini chart
  const recentData = data.slice(-5);

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className={cn("text-lg", "text-gray-800")}>
          Task Completion Trend
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
                Tasks Completed Over Time
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
                  <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray={chartStyles.chart.grid.strokeDasharray}
                      stroke={chartStyles.chart.grid.stroke}
                    />
                    <XAxis
                      dataKey="date"
                      tick={chartStyles.chart.axis.tick}
                      axisLine={chartStyles.chart.axis.line}
                      tickLine={chartStyles.chart.axis.line}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={chartStyles.chart.axis.tick}
                      axisLine={chartStyles.chart.axis.line}
                      tickLine={chartStyles.chart.axis.line}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: "10px" }} />
                    <Line
                      name="Completed Tasks"
                      type="monotone"
                      dataKey="count"
                      stroke={chartStyles.chart.line.stroke}
                      strokeWidth={chartStyles.chart.line.strokeWidth}
                      dot={{
                        stroke: chartStyles.chart.line.dot.stroke,
                        strokeWidth: chartStyles.chart.line.dot.strokeWidth,
                        fill: chartStyles.chart.line.dot.fill,
                        r: chartStyles.chart.line.dot.radius,
                      }}
                      activeDot={{
                        stroke: chartStyles.chart.line.activeDot.stroke,
                        strokeWidth:
                          chartStyles.chart.line.activeDot.strokeWidth,
                        fill: chartStyles.chart.line.activeDot.fill,
                        r: chartStyles.chart.line.activeDot.radius,
                      }}
                      animationDuration={
                        chartStyles.chart.line.animationDuration
                      }
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* Mobile condensed view (hidden on larger screens) */}
        <div className="sm:hidden">
          <Dialog>
            <DialogTrigger className="w-full">
              <div className="cursor-pointer">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart
                    data={recentData}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="date"
                      tick={{ ...chartStyles.chart.axis.tick, fontSize: 10 }}
                      axisLine={chartStyles.chart.axis.line}
                      tickLine={false}
                      tickFormatter={(value) =>
                        value.split("/").slice(0, 2).join("/")
                      }
                    />
                    <YAxis allowDecimals={false} hide={true} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={chartStyles.chart.line.stroke}
                      strokeWidth={chartStyles.chart.line.strokeWidth}
                      dot={{
                        stroke: chartStyles.chart.line.dot.stroke,
                        strokeWidth: chartStyles.chart.line.dot.strokeWidth,
                        fill: chartStyles.chart.line.dot.fill,
                        r: 3,
                      }}
                      activeDot={{
                        stroke: chartStyles.chart.line.activeDot.stroke,
                        strokeWidth:
                          chartStyles.chart.line.activeDot.strokeWidth,
                        fill: chartStyles.chart.line.activeDot.fill,
                        r: 5,
                      }}
                      animationDuration={
                        chartStyles.chart.line.animationDuration
                      }
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-center">
                  <div className={chartStyles.mobile.tapToExpand}>
                    {data.length > 5 && `+ ${data.length - 5} more dates`} Tap
                    to expand
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className={chartStyles.dialog.content}>
              <DialogHeader className={chartStyles.dialog.header}>
                <DialogTitle className={chartStyles.dialog.title}>
                  Tasks Completed Over Time
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
                    <LineChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray={chartStyles.chart.grid.strokeDasharray}
                        stroke={chartStyles.chart.grid.stroke}
                      />
                      <XAxis
                        dataKey="date"
                        tick={chartStyles.chart.axis.tick}
                        axisLine={chartStyles.chart.axis.line}
                        tickLine={chartStyles.chart.axis.line}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={chartStyles.chart.axis.tick}
                        axisLine={chartStyles.chart.axis.line}
                        tickLine={chartStyles.chart.axis.line}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: "10px" }} />
                      <Line
                        name="Completed Tasks"
                        type="monotone"
                        dataKey="count"
                        stroke={chartStyles.chart.line.stroke}
                        strokeWidth={chartStyles.chart.line.strokeWidth}
                        dot={{
                          stroke: chartStyles.chart.line.dot.stroke,
                          strokeWidth: chartStyles.chart.line.dot.strokeWidth,
                          fill: chartStyles.chart.line.dot.fill,
                          r: chartStyles.chart.line.dot.radius,
                        }}
                        activeDot={{
                          stroke: chartStyles.chart.line.activeDot.stroke,
                          strokeWidth:
                            chartStyles.chart.line.activeDot.strokeWidth,
                          fill: chartStyles.chart.line.activeDot.fill,
                          r: chartStyles.chart.line.activeDot.radius,
                        }}
                        animationDuration={
                          chartStyles.chart.line.animationDuration
                        }
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Desktop normal view (hidden on small screens) */}
        <div className="hidden sm:block">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray={chartStyles.chart.grid.strokeDasharray}
                stroke={chartStyles.chart.grid.stroke}
              />
              <XAxis
                dataKey="date"
                tick={chartStyles.chart.axis.tick}
                axisLine={chartStyles.chart.axis.line}
                tickLine={chartStyles.chart.axis.line}
              />
              <YAxis
                allowDecimals={false}
                tick={chartStyles.chart.axis.tick}
                axisLine={chartStyles.chart.axis.line}
                tickLine={chartStyles.chart.axis.line}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Line
                name="Completed Tasks"
                type="monotone"
                dataKey="count"
                stroke={chartStyles.chart.line.stroke}
                strokeWidth={chartStyles.chart.line.strokeWidth}
                dot={{
                  stroke: chartStyles.chart.line.dot.stroke,
                  strokeWidth: chartStyles.chart.line.dot.strokeWidth,
                  fill: chartStyles.chart.line.dot.fill,
                  r: chartStyles.chart.line.dot.radius,
                }}
                activeDot={{
                  stroke: chartStyles.chart.line.activeDot.stroke,
                  strokeWidth: chartStyles.chart.line.activeDot.strokeWidth,
                  fill: chartStyles.chart.line.activeDot.fill,
                  r: chartStyles.chart.line.activeDot.radius,
                }}
                animationDuration={chartStyles.chart.line.animationDuration}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

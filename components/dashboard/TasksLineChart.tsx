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
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

interface ChecklistItem {
  id: string;
  completed: boolean;
  created_at: string;
}

interface Props {
  checklistItems: ChecklistItem[];
}

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-emerald-600">
          Tasks Completed: <span className="font-bold">{payload[0].value}</span>
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

  // Sort data by date
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
        <CardTitle className="text-lg text-gray-800">
          Task Completion Trend
        </CardTitle>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              aria-label="Expand chart"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[80vh] bg-white p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-xl">
                Tasks Completed Over Time
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 h-[calc(100%-60px)] bg-white overflow-auto">
              <div className="min-w-[800px] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      tickLine={{ stroke: "#E5E7EB" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      tickLine={{ stroke: "#E5E7EB" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: "10px" }} />
                    <Line
                      name="Completed Tasks"
                      type="monotone"
                      dataKey="count"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{
                        stroke: "#10B981",
                        strokeWidth: 2,
                        fill: "#fff",
                        r: 4,
                      }}
                      activeDot={{
                        stroke: "#059669",
                        strokeWidth: 2,
                        fill: "#10B981",
                        r: 6,
                      }}
                      animationDuration={1500}
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
              <ResponsiveContainer width="100%" height={180}>
                <LineChart
                  data={recentData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6B7280", fontSize: 10 }}
                    axisLine={{ stroke: "#E5E7EB" }}
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
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{
                      stroke: "#10B981",
                      strokeWidth: 2,
                      fill: "#fff",
                      r: 3,
                    }}
                    activeDot={{
                      stroke: "#059669",
                      strokeWidth: 2,
                      fill: "#10B981",
                      r: 5,
                    }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-xs text-emerald-600"
                >
                  {data.length > 5 && `+ ${data.length - 5} more dates`} Tap to
                  expand
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[80vh] bg-white p-0">
              <DialogHeader className="p-4 border-b">
                <DialogTitle className="text-xl">
                  Tasks Completed Over Time
                </DialogTitle>
              </DialogHeader>
              <div className="p-4 h-[calc(100%-60px)] bg-white overflow-auto">
                <div className="min-w-[800px] h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={{ stroke: "#E5E7EB" }}
                        tickLine={{ stroke: "#E5E7EB" }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={{ stroke: "#E5E7EB" }}
                        tickLine={{ stroke: "#E5E7EB" }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: "10px" }} />
                      <Line
                        name="Completed Tasks"
                        type="monotone"
                        dataKey="count"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{
                          stroke: "#10B981",
                          strokeWidth: 2,
                          fill: "#fff",
                          r: 4,
                        }}
                        activeDot={{
                          stroke: "#059669",
                          strokeWidth: 2,
                          fill: "#10B981",
                          r: 6,
                        }}
                        animationDuration={1500}
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={{ stroke: "#E5E7EB" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Line
                name="Completed Tasks"
                type="monotone"
                dataKey="count"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ stroke: "#10B981", strokeWidth: 2, fill: "#fff", r: 4 }}
                activeDot={{
                  stroke: "#059669",
                  strokeWidth: 2,
                  fill: "#10B981",
                  r: 6,
                }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

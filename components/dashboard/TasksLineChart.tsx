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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-800">Task Completion Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart 
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line
              name="Completed Tasks"
              type="monotone"
              dataKey="count"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ stroke: '#10B981', strokeWidth: 2, fill: '#fff', r: 4 }}
              activeDot={{ stroke: '#059669', strokeWidth: 2, fill: '#10B981', r: 6 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChecklistItem {
  id: string;
  completed: boolean;
  created_at: string;
}

interface Props {
  checklistItems: ChecklistItem[];
}

export default function TasksLineChart({ checklistItems }: Props) {
  const completed = checklistItems.filter((item) => item.completed);

  let counts: { [key: string]: number } = {};
  completed.forEach((item) => {
    const isoDate = item.created_at.slice(0, 10);
    const date = new Date(isoDate).toLocaleDateString();
    counts[date] = (counts[date] || 0) + 1;
  });

  const data = Object.entries(counts).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#10B981"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

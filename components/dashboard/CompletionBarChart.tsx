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
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-800">Department Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departments} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
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
      </CardContent>
    </Card>
  );
}

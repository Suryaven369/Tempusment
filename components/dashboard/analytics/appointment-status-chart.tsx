"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface AppointmentStatusChartProps {
  data: { name: string; value: number; color: string }[];
}

export function AppointmentStatusChart({ data }: AppointmentStatusChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [value, "Appointments"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
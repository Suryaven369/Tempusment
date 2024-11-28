"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Appointment, Payment } from "@/types";

interface HistoryStatsProps {
  appointments: Appointment[];
  payments: Payment[];
}

export function ClientHistoryStats({ appointments, payments }: HistoryStatsProps) {
  // Calculate lifetime value
  const lifetimeValue = payments.reduce((total, payment) => total + Number(payment.amount), 0);

  // Calculate completion rate
  const completedAppointments = appointments.filter(app => app.status === "completed").length;
  const completionRate = appointments.length > 0 
    ? Math.round((completedAppointments / appointments.length) * 100)
    : 0;

  // Calculate monthly appointment frequency
  const monthlyData = appointments.reduce((acc: Record<string, number>, appointment) => {
    const month = format(new Date(appointment.date), "MMM yyyy");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  // Get last 6 months for chart
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  const months = eachMonthOfInterval({ start: sixMonthsAgo, end: today });

  const chartData = months.map(date => {
    const month = format(date, "MMM yyyy");
    return {
      month,
      appointments: monthlyData[month] || 0
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${lifetimeValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total revenue from all appointments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Of appointments completed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Appointments booked to date
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Appointment Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="appointments" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
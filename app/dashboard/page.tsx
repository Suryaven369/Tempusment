"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { NewAppointmentDialog } from "@/components/dashboard/new-appointment-dialog";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { format } from "date-fns";

export default function DashboardPage() {
  const { stats, loading } = useDashboardStats();
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">{today}</p>
        </div>
        <NewAppointmentDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Appointments"
          value={stats.totalAppointments}
          description="All time appointments"
          loading={loading}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          description="All time revenue"
          loading={loading}
        />
        <StatsCard
          title="Total Clients"
          value={stats.totalClients}
          description="Active clients"
          loading={loading}
        />
        <StatsCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          description="Completed appointments"
          loading={loading}
        />
      </div>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentAppointments />
        </CardContent>
      </Card>
    </div>
  );
}

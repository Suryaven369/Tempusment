"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { NewAppointmentDialog } from "@/components/dashboard/new-appointment-dialog";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { format } from "date-fns";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function DashboardContent() {
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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentAppointments />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
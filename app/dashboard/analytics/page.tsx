"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { RevenueChart } from "@/components/dashboard/analytics/revenue-chart";
import { AppointmentStatusChart } from "@/components/dashboard/analytics/appointment-status-chart";
import { ServicePopularityChart } from "@/components/dashboard/analytics/service-popularity-chart";
import { ClientGrowthChart } from "@/components/dashboard/analytics/client-growth-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalyticsData } from "@/hooks/use-analytics-data";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

export default function AnalyticsPage() {
  const { data, loading } = useAnalyticsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    );
  }

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatPercentage = (value: number) => {
    const formatted = Math.abs(value).toFixed(1);
    return value >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your business performance and growth
          </p>
        </div>
        <CalendarDateRangePicker />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.revenue.total)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {data.revenue.total >= data.revenue.previousMonth ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  {formatPercentage(calculatePercentageChange(data.revenue.total, data.revenue.previousMonth))}
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.appointments.total}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {data.appointments.total >= data.appointments.previousMonth ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  {formatPercentage(calculatePercentageChange(data.appointments.total, data.appointments.previousMonth))}
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.clients.total}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {data.clients.total >= data.clients.previousMonth ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  {formatPercentage(calculatePercentageChange(data.clients.total, data.clients.previousMonth))}
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.services.total}</div>
                <p className="text-xs text-muted-foreground">
                  Most popular: {data.services.popularity[0]?.name || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={data.revenue.monthlyData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={data.revenue.monthlyData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentStatusChart data={data.appointments.statusDistribution} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Popularity</CardTitle>
            </CardHeader>
            <CardContent>
              <ServicePopularityChart data={data.services.popularity} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientGrowthChart data={data.clients.monthlyGrowth} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
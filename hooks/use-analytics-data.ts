"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getAllAppointments, getAllClients, getAllServices } from "@/lib/firebase-collections";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import type { Appointment, Client, Service } from "@/types";

export interface AnalyticsData {
  revenue: {
    total: number;
    previousMonth: number;
    monthlyData: { name: string; revenue: number }[];
  };
  appointments: {
    total: number;
    previousMonth: number;
    statusDistribution: { name: string; value: number; color: string }[];
  };
  clients: {
    total: number;
    previousMonth: number;
    monthlyGrowth: { month: string; clients: number }[];
  };
  services: {
    total: number;
    popularity: { name: string; appointments: number }[];
  };
}

const statusColors = {
  completed: "var(--chart-1)",
  scheduled: "var(--chart-2)",
  cancelled: "var(--chart-3)",
  "no-show": "var(--chart-4)",
  "arrived-late": "var(--chart-5)",
};

export function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        const [appointments, clients, services] = await Promise.all([
          getAllAppointments(),
          getAllClients(),
          getAllServices(),
        ]);

        // Calculate date ranges
        const now = new Date();
        const currentMonth = startOfMonth(now);
        const lastMonth = startOfMonth(subMonths(now, 1));
        const last6Months = eachMonthOfInterval({
          start: subMonths(currentMonth, 5),
          end: currentMonth,
        });

        // Revenue calculations
        const monthlyRevenue = appointments.reduce((acc, appointment) => {
          const date = new Date(appointment.date);
          const monthKey = format(date, "MMM");
          acc[monthKey] = (acc[monthKey] || 0) + Number(appointment.price);
          return acc;
        }, {} as Record<string, number>);

        const revenueData = last6Months.map(month => ({
          name: format(month, "MMM"),
          revenue: monthlyRevenue[format(month, "MMM")] || 0,
        }));

        const currentMonthRevenue = appointments
          .filter(apt => new Date(apt.date) >= currentMonth)
          .reduce((sum, apt) => sum + Number(apt.price), 0);

        const previousMonthRevenue = appointments
          .filter(apt => {
            const date = new Date(apt.date);
            return date >= lastMonth && date < currentMonth;
          })
          .reduce((sum, apt) => sum + Number(apt.price), 0);

        // Appointment status distribution
        const statusCount = appointments.reduce((acc, apt) => {
          acc[apt.status] = (acc[apt.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const statusDistribution = Object.entries(statusCount).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
          color: statusColors[status as keyof typeof statusColors] || "var(--chart-1)",
        }));

        // Client growth
        const clientsByMonth = last6Months.map(month => {
          const monthEnd = endOfMonth(month);
          const clientCount = clients.filter(
            client => new Date(client.createdAt) <= monthEnd
          ).length;
          return {
            month: format(month, "MMM"),
            clients: clientCount,
          };
        });

        // Service popularity
        const serviceAppointments = services.map(service => ({
          name: service.name,
          appointments: appointments.filter(apt => apt.serviceId === service.id).length,
        })).sort((a, b) => b.appointments - a.appointments).slice(0, 6);

        const currentMonthAppointments = appointments.filter(
          apt => new Date(apt.date) >= currentMonth
        ).length;

        const previousMonthAppointments = appointments.filter(
          apt => {
            const date = new Date(apt.date);
            return date >= lastMonth && date < currentMonth;
          }
        ).length;

        setData({
          revenue: {
            total: currentMonthRevenue,
            previousMonth: previousMonthRevenue,
            monthlyData: revenueData,
          },
          appointments: {
            total: currentMonthAppointments,
            previousMonth: previousMonthAppointments,
            statusDistribution,
          },
          clients: {
            total: clients.length,
            previousMonth: clients.filter(
              client => new Date(client.createdAt) >= lastMonth && 
                       new Date(client.createdAt) < currentMonth
            ).length,
            monthlyGrowth: clientsByMonth,
          },
          services: {
            total: services.filter(s => s.active).length,
            popularity: serviceAppointments,
          },
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return { data, loading };
}
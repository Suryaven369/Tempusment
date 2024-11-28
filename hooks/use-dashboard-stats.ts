"use client";

import { useState, useEffect } from "react";
import { getDashboardStats } from "@/lib/firebase-collections";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

export interface DashboardStats {
  totalAppointments: number;
  totalRevenue: number;
  totalClients: number;
  completionRate: number;
}

const initialStats: DashboardStats = {
  totalAppointments: 0,
  totalRevenue: 0,
  totalClients: 0,
  completionRate: 0,
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    async function fetchStats() {
      if (!user) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const dashboardStats = await getDashboardStats();
        if (mounted) {
          setStats(dashboardStats);
        }
      } catch (error: any) {
        console.error('Error fetching stats:', error);
        if (mounted) {
          toast({
            title: "Error",
            description: "Failed to load dashboard statistics. Please try refreshing the page.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      mounted = false;
    };
  }, [user, toast]);

  return { stats, loading };
}
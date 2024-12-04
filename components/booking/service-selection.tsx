"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBooking } from "@/lib/contexts/booking-context";
import { getBusinessServices } from "@/lib/collections/services";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { Service } from "@/types";

interface ServiceSelectionProps {
  userId: string;
}

export function ServiceSelection({ userId }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useBooking();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchServices() {
      try {
        const fetchedServices = await getBusinessServices(userId);
        setServices(fetchedServices.filter(service => service.active));
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [userId, toast]);

  const handleServiceSelect = (service: Service) => {
    dispatch({ type: "SELECT_SERVICE", service });
    dispatch({ type: "NEXT_STEP" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No services available.</p>
      </div>
    );
  }

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Select a Service</h2>
        <p className="text-muted-foreground">
          Choose the service you'd like to book
        </p>
      </div>

      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{category}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryServices.map((service) => (
              <Card
                key={service.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  state.selectedService?.id === service.id && "border-primary"
                )}
                onClick={() => handleServiceSelect(service)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                      <div className="text-sm text-muted-foreground">
                        Duration: {formatDuration(service.duration)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatCurrency(service.price)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
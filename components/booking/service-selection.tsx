"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Service } from "@/types";
import { getAllServices } from "@/lib/firebase-collections";
import { useToast } from "@/components/ui/use-toast";

interface ServiceSelectionProps {
  userId: string;
  onNext: () => void;
}

export function ServiceSelection({ userId, onNext }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchServices() {
      try {
        const fetchedServices = await getAllServices();
        setServices(fetchedServices);
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
  }, [toast]);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    onNext();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Select a Service</h2>
        <p className="text-muted-foreground">
          Choose the service you'd like to book
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all ${
              selectedService === service.id
                ? "border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => service.id && handleServiceSelect(service.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {service.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${service.price}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.duration} mins
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

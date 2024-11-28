"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { getAllServices } from "@/lib/firebase-collections";
import type { Service } from "@/types";

interface ServiceSelectionProps {
  userId: string;
  onNext: () => void;
}

export function ServiceSelection({ userId, onNext }: ServiceSelectionProps) {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const fetchedServices = await getAllServices();
        setServices(fetchedServices.filter(service => service.active));
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-colors ${
              selectedService === service.id
                ? "border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.description}
                  </p>
                </div>
                {selectedService === service.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span>{service.duration} mins</span>
                <span className="font-medium">${service.price}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        className="w-full md:w-auto"
        disabled={!selectedService}
        onClick={onNext}
      >
        Continue
      </Button>
    </div>
  );
}
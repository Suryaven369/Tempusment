"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Service } from "@/types";

interface ServiceSelectionProps {
  services: Service[];
  onServiceSelected: (serviceId: string) => void;
}

export function ServiceSelection({ services, onServiceSelected }: ServiceSelectionProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    onServiceSelected(serviceId);
  };

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

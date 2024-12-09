"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign } from "lucide-react";
import { ServiceBookingDialog } from "@/components/booking/service-booking-dialog";
import { getBusinessServices } from "@/lib/collections/services";
import type { Service } from "@/types";

interface ServicesSectionProps {
  userId: string;
  onServiceSelect: (service: Service) => void;
}

export function ServicesSection({ userId, onServiceSelect }: ServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      if (!userId) return;
      
      try {
        const fetchedServices = await getBusinessServices(userId);
        setServices(fetchedServices.filter(service => service.active));
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No services available.</p>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {service.duration} mins
                  </div>
                  <div className="flex items-center font-bold text-lg">
                    <DollarSign className="mr-1 h-4 w-4" />
                    ${service.price}
                  </div>
                </div>
                <ServiceBookingDialog 
                  service={service}
                  userId={userId}
                  trigger={
                    <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
                      Book Now
                    </button>
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
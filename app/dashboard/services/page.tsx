"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceDialog } from "@/components/dashboard/services/service-dialog";
import { ServiceList } from "@/components/dashboard/services/service-list";
import { ServiceSearch } from "@/components/dashboard/services/service-search";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getAllServices } from "@/lib/firebase-collections";
import type { Service } from "@/types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchServices() {
      if (!user) return;
      
      try {
        const fetchedServices = await getAllServices();
        setServices(fetchedServices);
      } catch (error: any) {
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
  }, [user, toast]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceAdded = (newService: Service) => {
    setServices((prev) => [...prev, newService]);
  };

  const handleServiceUpdated = (updatedService: Service) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services</h1>
        <ServiceDialog onServiceAdded={handleServiceAdded} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <ServiceSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <ServiceList 
        services={filteredServices}
        loading={loading}
        onServiceUpdated={handleServiceUpdated}
      />
    </div>
  );
}
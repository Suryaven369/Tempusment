"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/business/landing/hero-section";
import { FeaturesSection } from "@/components/business/landing/features-section";
import { ServicesSection } from "@/components/business/landing/services-section";
import { ContactSection } from "@/components/business/landing/contact-section";
import { BusinessNav } from "@/components/booking/business-nav";
import { BusinessFooter } from "@/components/booking/business-footer";
import { useAuth } from "@/hooks/use-auth";
import { getBusinessServices } from "@/lib/collections/services";
import { getBusinessInfo } from "@/lib/collections/business";
import type { Service, BusinessInfo } from "@/types";

interface BookingPageProps {
  params: {
    userId: string;
  };
}

export default function BookingPage({ params }: BookingPageProps) {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!params.userId) return;

      try {
        const [fetchedServices, fetchedInfo] = await Promise.all([
          getBusinessServices(params.userId),
          getBusinessInfo(params.userId)
        ]);
        
        setServices(fetchedServices);
        setBusinessInfo(fetchedInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!businessInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Business Not Found</h1>
          <p className="text-muted-foreground">The business you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BusinessNav 
        businessName={businessInfo.name} 
        userId={params.userId}
        logo={businessInfo.logo}
      />
      <main className="flex-1">
        <HeroSection business={businessInfo} />
        
        <ServicesSection services={services} userId={params.userId} />
        <ContactSection business={businessInfo} />
      </main>
      <BusinessFooter 
        business={businessInfo} 
        userId={params.userId}
      />
    </div>
  );
}
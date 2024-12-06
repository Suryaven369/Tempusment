"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { BookingPageClient } from "./booking-page-client";
import { BookingProvider } from "@/lib/contexts/booking-context";
import { useToast } from "@/components/ui/use-toast";
import { getBusinessInfo } from "@/lib/collections/business";
import { HeroSection } from "@/components/business/landing/hero-section";
import { FeaturesSection } from "@/components/business/landing/features-section";
import { ServicesSection } from "@/components/business/landing/services-section";
import { ContactSection } from "@/components/business/landing/contact-section";
import { MainNav } from "@/components/main-nav";
import type { BusinessInfo } from "@/lib/collections/business";

export default function BookingPage({ params }: { params: { userId: string } }) {
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBusinessInfo() {
      if (!params.userId) return;

      try {
        const businessInfo = await getBusinessInfo(params.userId);
        setBusiness(businessInfo);
      } catch (err) {
        console.error("Error fetching business info:", err);
        toast({
          title: "Error",
          description: "Failed to load business information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchBusinessInfo();
  }, [params.userId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Business Not Found</h1>
          <p className="text-muted-foreground">The business you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <BookingProvider>
      <div className="min-h-screen bg-background">
        <MainNav />
        {!showBooking ? (
          <>
            <HeroSection 
              business={business} 
              onBookNow={() => setShowBooking(true)} 
            />
            <FeaturesSection />
            <ServicesSection 
              userId={params.userId} 
              onServiceSelect={() => setShowBooking(true)} 
            />
            <ContactSection business={business} />
          </>
        ) : (
          <BookingPageClient userId={params.userId} />
        )}
      </div>
    </BookingProvider>
  );
}
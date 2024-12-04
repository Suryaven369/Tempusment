"use client";

import { Suspense } from "react";
import { BookingPageClient } from "./booking-page-client";
import { Loader2 } from "lucide-react";
import { BookingProvider } from "@/lib/contexts/booking-context";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getBusinessInfo } from "@/lib/collections/business";
import { HeroSection } from "@/components/business/landing/hero-section";
import { AboutSection } from "@/components/business/landing/features-section";
import { ServicesSection } from "@/components/business/landing/services-section";
import { ContactSection } from "@/components/business/landing/contact-section";
import type { BusinessInfo } from "@/lib/collections/business";

export default function BookingPage({ params }: { params: { userId: string } }) {
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBusinessInfo() {
      try {
        const businessInfo = await getBusinessInfo(params.userId);
        setBusiness(businessInfo);
      } catch (err: any) {
        console.error("Error fetching business info:", err);
        setError(err.message || "Failed to load business information");
      } finally {
        setLoading(false);
      }
    }

    fetchBusinessInfo();
  }, [params.userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <BookingProvider>
      <div className="min-h-screen bg-background">
        {!showBooking ? (
          <>
            <HeroSection 
              business={business} 
              onBookNow={() => setShowBooking(true)} 
            />
            <AboutSection business={business} />
            <ServicesSection 
              userId={params.userId} 
              onServiceSelect={() => setShowBooking(true)} 
            />
            <ContactSection business={business} />
          </>
        ) : (
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <BookingPageClient userId={params.userId} />
          </Suspense>
        )}
      </div>
    </BookingProvider>
  );
}
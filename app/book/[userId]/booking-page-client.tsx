"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, UserPlus } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { ServiceSelection } from "@/components/booking/service-selection";
import { StaffSelection } from "@/components/booking/staff-selection";
import { CustomerForm } from "@/components/booking/customer-form";
import { BusinessHero } from "@/components/booking/business-hero";
import { BusinessInfo } from "@/components/booking/business-info";
import { BusinessGallery } from "@/components/booking/business-gallery";
import Link from "next/link";

interface BusinessProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  images?: string[];
  bookingSettings?: {
    enabled: boolean;
    requireApproval: boolean;
    allowCancellations: boolean;
    cancellationWindow: string;
    maxAdvanceBooking: string;
    minAdvanceBooking: string;
  };
}

export function BookingPageClient() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState("services");

  useEffect(() => {
    async function fetchBusinessProfile() {
      try {
        const userDoc = await getDoc(doc(db, "users", userId as string));
        if (!userDoc.exists()) {
          setError("Business not found");
          return;
        }

        const data = userDoc.data() as BusinessProfile;
        if (!data.bookingSettings?.enabled) {
          setError("Online booking is currently disabled");
          return;
        }

        setBusiness(data);
      } catch (error) {
        setError("Failed to load business profile");
      } finally {
        setLoading(false);
      }
    }

    fetchBusinessProfile();
  }, [userId]);

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
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error || "Something went wrong"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <BusinessHero business={business} />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Business Info */}
        <BusinessInfo business={business} />

        {/* Gallery */}
        <BusinessGallery images={business.images} />

        {/* Create Profile Button */}
        <div className="flex justify-center">
          <Button asChild>
            <Link href={`/book/${userId}/register`}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Client Profile
            </Link>
          </Button>
        </div>

        {/* Booking Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Book an Appointment</CardTitle>
            <CardDescription>
              Follow the steps below to schedule your appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentStep} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="datetime">Date & Time</TabsTrigger>
                <TabsTrigger value="details">Your Details</TabsTrigger>
              </TabsList>

              <TabsContent value="services">
                <ServiceSelection
                  userId={userId as string}
                  onNext={() => setCurrentStep("staff")}
                />
              </TabsContent>

              <TabsContent value="staff">
                <StaffSelection
                  userId={userId as string}
                  onBack={() => setCurrentStep("services")}
                  onNext={() => setCurrentStep("datetime")}
                />
              </TabsContent>

              <TabsContent value="datetime">
                <BookingCalendar
                  userId={userId as string}
                  onBack={() => setCurrentStep("staff")}
                  onNext={() => setCurrentStep("details")}
                />
              </TabsContent>

              <TabsContent value="details">
                <CustomerForm
                  userId={userId as string}
                  onBack={() => setCurrentStep("datetime")}
                  bookingSettings={business.bookingSettings}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
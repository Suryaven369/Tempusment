"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceSelection } from "@/components/booking/service-selection";
import { StaffSelection } from "@/components/booking/staff-selection";
import { TimeSelection } from "@/components/booking/time-selection";
import { CustomerForm } from "@/components/booking/customer-form";

type BookingStep = "services" | "staff" | "time" | "details";

interface BookingPageClientProps {
  userId: string;
}

export function BookingPageClient({ userId }: BookingPageClientProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("services");

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
        <p className="text-muted-foreground mt-2">
          Select your preferred service and time
        </p>
      </div>

      <Tabs value={currentStep} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services" disabled={currentStep !== "services"}>
            Services
          </TabsTrigger>
          <TabsTrigger 
            value="staff" 
            disabled={currentStep !== "staff" && currentStep !== "services"}
          >
            Staff
          </TabsTrigger>
          <TabsTrigger 
            value="time" 
            disabled={currentStep !== "time" && currentStep !== "staff"}
          >
            Time
          </TabsTrigger>
          <TabsTrigger 
            value="details" 
            disabled={currentStep !== "details" && currentStep !== "time"}
          >
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <ServiceSelection
            userId={userId}
            onNext={() => setCurrentStep("staff")}
          />
        </TabsContent>

        <TabsContent value="staff">
          <StaffSelection
            userId={userId}
            onBack={() => setCurrentStep("services")}
            onNext={() => setCurrentStep("time")}
          />
        </TabsContent>

        <TabsContent value="time">
          <TimeSelection
            userId={userId}
            onBack={() => setCurrentStep("staff")}
            onNext={() => setCurrentStep("details")}
          />
        </TabsContent>

        <TabsContent value="details">
          <CustomerForm
            userId={userId}
            onBack={() => setCurrentStep("time")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

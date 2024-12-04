"use client";

import { useBooking } from "@/lib/contexts/booking-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceSelection } from "@/components/booking/service-selection";
import { StaffSelection } from "@/components/booking/staff-selection";
import { TimeSelection } from "@/components/booking/time-selection";
import { CustomerForm } from "@/components/booking/customer-form";

interface BookingPageClientProps {
  userId: string;
}

export function BookingPageClient({ userId }: BookingPageClientProps) {
  const { state } = useBooking();

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
        <p className="text-muted-foreground mt-2">
          Select your preferred service and time
        </p>
      </div>

      <Tabs value={state.step} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services" disabled={state.step !== "services"}>
            Services
          </TabsTrigger>
          <TabsTrigger 
            value="staff" 
            disabled={!state.selectedService || state.step === "services"}
          >
            Staff
          </TabsTrigger>
          <TabsTrigger 
            value="time" 
            disabled={!state.selectedStaff || state.step === "services" || state.step === "staff"}
          >
            Time
          </TabsTrigger>
          <TabsTrigger 
            value="details" 
            disabled={!state.selectedTime || state.step !== "details"}
          >
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <ServiceSelection userId={userId} />
        </TabsContent>

        <TabsContent value="staff">
          <StaffSelection userId={userId} />
        </TabsContent>

        <TabsContent value="time">
          <TimeSelection userId={userId} />
        </TabsContent>

        <TabsContent value="details">
          <CustomerForm userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
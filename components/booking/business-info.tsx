"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Calendar, Ban } from "lucide-react";

interface BusinessInfoProps {
  business: {
    address: string;
    phone: string;
    email: string;
    bookingSettings?: {
      maxAdvanceBooking: string;
      minAdvanceBooking: string;
      cancellationWindow: string;
      requireApproval: boolean;
    };
  };
}

export function BusinessInfo({ business }: BusinessInfoProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p>{business.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <p>{business.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <p>{business.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary shrink-0" />
              <p>Book up to {business.bookingSettings?.maxAdvanceBooking} days in advance</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <p>Minimum {business.bookingSettings?.minAdvanceBooking} hours notice required</p>
            </div>
            <div className="flex items-center gap-3">
              <Ban className="h-5 w-5 text-primary shrink-0" />
              <p>Free cancellation up to {business.bookingSettings?.cancellationWindow} hours before</p>
            </div>
            {business.bookingSettings?.requireApproval && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <p>Bookings require approval</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
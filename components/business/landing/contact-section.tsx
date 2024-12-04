"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactSectionProps {
  business: {
    address?: string;
    phone?: string;
    email?: string;
    businessHours?: Record<string, string>;
  };
}

export function ContactSection({ business }: ContactSectionProps) {
  if (!business) return null;

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="text-muted-foreground mt-2">
            Get in touch with us through any of these channels
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {business.address && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <MapPin className="mx-auto h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-muted-foreground">{business.address}</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {business.phone && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Phone className="mx-auto h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">{business.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {business.email && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Mail className="mx-auto h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">{business.email}</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {business.businessHours && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="mx-auto h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <div className="text-muted-foreground text-sm space-y-1">
                    {Object.entries(business.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize">{day}:</span>
                        <span>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
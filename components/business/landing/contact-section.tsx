"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { BusinessInfo } from "@/lib/collections/business";

interface ContactSectionProps {
  business: BusinessInfo;
}

export function ContactSection({ business }: ContactSectionProps) {
  const settings = business.settings?.business;
  
  if (!settings) return null;
  
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {settings.address && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <MapPin className="mx-auto h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-muted-foreground">{settings.address}</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {settings.phone && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Phone className="mx-auto h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">{settings.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {settings.email && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Mail className="mx-auto h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">{settings.email}</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {settings.businessHours && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="mx-auto h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <div className="text-muted-foreground">
                    {Object.entries(settings.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
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
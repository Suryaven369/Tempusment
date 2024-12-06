"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import type { BusinessInfo } from "@/lib/collections/business";

interface HeroSectionProps {
  business: BusinessInfo;
  onBookNow: () => void;
}

export function HeroSection({ business, onBookNow }: HeroSectionProps) {
  const settings = business.settings?.business;
  
  return (
    <div className="relative min-h-[500px] bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="absolute inset-0">
        {settings?.coverImage && (
          <img
            src={settings.coverImage}
            alt={settings?.name || "Business cover"}
            className="h-full w-full object-cover opacity-20"
          />
        )}
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {settings?.name || business.name}
          </h1>
          
          {settings?.tagline && (
            <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              {settings.tagline}
            </p>
          )}
          
          <div className="mx-auto mt-10 max-w-md sm:flex sm:justify-center md:mt-12">
            <Button size="lg" onClick={onBookNow} className="w-full sm:w-auto">
              <Calendar className="mr-2 h-5 w-5" />
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
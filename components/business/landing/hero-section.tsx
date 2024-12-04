"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

interface HeroSectionProps {
  business: {
    name: string;
    tagline?: string;
    coverImage?: string;
  };
}

export function HeroSection({ business }: HeroSectionProps) {
  const { user } = useAuth();
  
  return (
    <div className="relative min-h-[600px] bg-gradient-to-r from-primary/10 to-primary/5">
      {business.coverImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${business.coverImage})`,
            opacity: 0.2 
          }}
        />
      )}
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {business.name}
          </h1>
          
          {business.tagline && (
            <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              {business.tagline}
            </p>
          )}
          
          <div className="mx-auto mt-10 max-w-md sm:flex sm:justify-center md:mt-12">
            <Button size="lg" asChild>
              <Link href={`/book/${user?.uid}`}>
                <Calendar className="mr-2 h-5 w-5" />
                Book Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
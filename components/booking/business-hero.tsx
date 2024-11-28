"use client";

import { Card } from "@/components/ui/card";

interface BusinessHeroProps {
  business: {
    name: string;
    description?: string;
  };
}

export function BusinessHero({ business }: BusinessHeroProps) {
  return (
    <div className="relative h-[400px] bg-gradient-to-r from-primary to-primary/50">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80')`,
          opacity: 0.3,
        }}
      />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl font-bold mb-4">{business.name}</h1>
          {business.description && (
            <p className="text-lg opacity-90">{business.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
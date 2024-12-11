"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserSettings } from "@/lib/firebase-settings";
import { useState, useEffect } from "react";
import type { UserSettings } from "./firebase-settings";

interface BusinessNavProps {
  userId: string;
}

export function BusinessNav({ userId }: BusinessNavProps) {
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const userSettings = await getUserSettings();
        setSettings(userSettings);
      } catch (error) {
        console.error('Failed to fetch user settings', error);
      }
    }

    fetchSettings();
  }, []);

  // Fallback values
  const businessName = settings?.business?.name || "My Business";
  const logo = settings?.business?.logo;

  if (!settings) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span className="font-bold">Loading...</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link 
          href={`/book/${userId}`} 
          className="flex items-center space-x-2"
        >
          {logo ? (
            <img 
              src={logo} 
              alt={businessName}
              className="h-8 w-8 object-contain"
              onError={(e) => {
                console.error('Logo failed to load', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          
          <span className={cn("font-bold", logo ? "sr-only" : "")}>
            {businessName}
          </span>
        </Link>
      </div>
    </header>
  );
}
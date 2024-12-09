"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";

interface BusinessNavProps {
  businessName: string;
  userId: string;
}

export function BusinessNav({ businessName, userId }: BusinessNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href={`/book/${userId}`} className="flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <span className="font-bold">{businessName}</span>
        </Link>
      </div>
    </header>
  );
}
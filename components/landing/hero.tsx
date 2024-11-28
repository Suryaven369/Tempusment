"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export function LandingHero() {
  return (
    <div className="relative isolate pt-14">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Smart Booking & CRM for Modern Businesses
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Streamline your appointments, manage clients, and grow your business with our all-in-one platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="text-base">
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-base">
                <Link href="/demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-lg grid-cols-1 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-2 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <Calendar className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold">Smart Scheduling</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Intelligent booking system with real-time availability
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold">Client Management</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete CRM with client profiles and history
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <BarChart3 className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold">Business Analytics</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Detailed insights and performance metrics
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}
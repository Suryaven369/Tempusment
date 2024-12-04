"use client";

import { Calendar, Clock, CreditCard, Bell } from "lucide-react";

const features = [
  {
    name: "Easy Online Booking",
    description: "Book appointments 24/7 with our simple online scheduling system",
    icon: Calendar,
  },
  {
    name: "Real-time Availability",
    description: "See available time slots instantly and choose what works for you",
    icon: Clock,
  },
  {
    name: "Secure Payments",
    description: "Pay securely online or in person with multiple payment options",
    icon: CreditCard,
  },
  {
    name: "Instant Confirmations",
    description: "Receive immediate confirmation and reminders for your appointments",
    icon: Bell,
  },
];

export function FeaturesSection() {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Book With Confidence
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to schedule your appointment
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col items-center text-center">
                <div className="mb-6 rounded-lg bg-primary/10 p-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <dt className="text-lg font-semibold leading-7">
                  {feature.name}
                </dt>
                <dd className="mt-1 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
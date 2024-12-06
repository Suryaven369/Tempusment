"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpCenter() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions and learn how to make the most of TempusBook
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="booking">
          <AccordionTrigger>How do I make a booking?</AccordionTrigger>
          <AccordionContent>
            Making a booking is simple. Select your desired service, choose an available time slot,
            and fill in your details. You'll receive an instant confirmation email once your
            booking is complete.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cancel">
          <AccordionTrigger>How do I cancel or reschedule?</AccordionTrigger>
          <AccordionContent>
            You can cancel or reschedule your appointment through the confirmation email you received,
            or by logging into your account. Please note our cancellation policy requires at least
            24 hours notice.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payment">
          <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
          <AccordionContent>
            We accept all major credit cards, debit cards, and digital wallets. Payment is
            processed securely at the time of booking or during your appointment, depending on
            the business's preferences.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="account">
          <AccordionTrigger>How do I create an account?</AccordionTrigger>
          <AccordionContent>
            Click the "Sign Up" button in the top right corner. You can create an account using
            your email address or sign in with Google. Having an account allows you to manage
            your bookings and save your preferences.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
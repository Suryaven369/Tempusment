"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useBooking } from "@/lib/contexts/booking-context";
import { createAppointment } from "@/lib/firebase-collections";
import { useRouter } from "next/navigation";

interface CustomerFormProps {
  userId: string;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  notes: z.string().optional(),
});

export function CustomerForm({ userId }: CustomerFormProps) {
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useBooking();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!state.selectedService || !state.selectedStaff || !state.selectedDate || !state.selectedTime) {
      toast({
        title: "Error",
        description: "Please complete all booking steps before proceeding",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const appointment = await createAppointment({
        clientName: values.name,
        clientEmail: values.email,
        clientPhone: values.phone,
        serviceId: state.selectedService.id!,
        serviceName: state.selectedService.name,
        staffId: state.selectedStaff.id!,
        staffName: state.selectedStaff.name,
        date: state.selectedDate,
        time: state.selectedTime,
        duration: state.selectedService.duration,
        price: state.selectedService.price,
        status: "scheduled",
        paymentStatus: "pending",
        notes: values.notes,
      });

      toast({
        title: "Success",
        description: "Your appointment has been scheduled successfully.",
      });

      // Reset booking state
      dispatch({ type: "RESET" });
      
      // Redirect to confirmation page
      router.push(`/book/${userId}/confirmation/${appointment.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requests or information"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => dispatch({ type: "PREVIOUS_STEP" })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Complete Booking"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
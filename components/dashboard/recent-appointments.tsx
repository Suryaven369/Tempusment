"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MoreVertical, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PaymentStatusDialog } from "./appointments/payment-status-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateAppointment } from "@/lib/firebase-collections";
import { getRecentAppointments } from "@/lib/firebase-collections";
import type { Appointment } from "@/types";

const statusStyles = {
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "no-show": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "arrived-late": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

const paymentStatusStyles = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  refunded: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const statusLabels = {
  scheduled: "Scheduled",
  completed: "Completed",
  "no-show": "No Show",
  "arrived-late": "Late Arrival",
  cancelled: "Cancelled",
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
};

export function RecentAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    async function fetchAppointments() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const appointmentData = await getRecentAppointments();
        if (mounted) {
          setAppointments(appointmentData);
        }
      } catch (error: any) {
        console.error('Error fetching appointments:', error);
        if (mounted) {
          toast({
            title: "Error",
            description: "Failed to load appointments. Please try refreshing the page.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (user) {
      fetchAppointments();
    }

    return () => {
      mounted = false;
    };
  }, [user, toast]);

  const handleStatusUpdate = async (appointment: Appointment, newStatus: string) => {
    try {
      const updatedAppointment = {
        ...appointment,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      await updateAppointment(appointment.id!, updatedAppointment);
      
      setAppointments(prev => 
        prev.map(app => 
          app.id === appointment.id ? updatedAppointment : app
        )
      );

      toast({
        title: "Success",
        description: `Appointment status updated to ${statusLabels[newStatus as keyof typeof statusLabels]}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update appointment status.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Please sign in to view appointments
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No upcoming appointments. Create your first appointment to get started.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium truncate">
                  {appointment.clientName}
                </p>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={statusStyles[appointment.status as keyof typeof statusStyles]}
                  >
                    {statusLabels[appointment.status as keyof typeof statusLabels]}
                  </Badge>
                  {appointment.paymentStatus && (
                    <Badge 
                      variant="secondary" 
                      className={paymentStatusStyles[appointment.paymentStatus]}
                    >
                      {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {appointment.serviceName}
                  </p>
                  {appointment.clientPhone && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <a 
                        href={`tel:${appointment.clientPhone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {appointment.clientPhone}
                      </a>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {format(new Date(`${appointment.date}T${appointment.time}`), "MMM d, h:mm a")}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {formatPrice(appointment.price)}
                  </p>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate(appointment, "completed")}
                  className="text-green-600"
                >
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate(appointment, "no-show")}
                  className="text-red-600"
                >
                  Mark as No-Show
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate(appointment, "arrived-late")}
                  className="text-yellow-600"
                >
                  Mark as Late Arrival
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate(appointment, "cancelled")}
                  className="text-gray-600"
                >
                  Mark as Cancelled
                </DropdownMenuItem>
                {appointment.status !== "scheduled" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusUpdate(appointment, "scheduled")}
                    className="text-blue-600"
                  >
                    Reset to Scheduled
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {appointment.paymentStatus !== 'paid' && (
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setShowPaymentDialog(true);
                    }}
                    className="text-primary"
                  >
                    Record Payment
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {selectedAppointment && (
        <PaymentStatusDialog
          appointment={selectedAppointment}
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          onAppointmentUpdated={(updated) => {
            setAppointments(prev =>
              prev.map(app => app.id === updated.id ? updated : app)
            );
            setSelectedAppointment(null);
          }}
        />
      )}
    </ScrollArea>
  );
}
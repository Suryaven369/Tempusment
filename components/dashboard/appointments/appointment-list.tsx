"use client";

import { useAppointments } from "@/hooks/use-appointments";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppointmentStatusDialog } from "./appointment-status-dialog";
import { EditAppointmentDialog } from "./edit-appointment-dialog";
import { PaymentStatusDialog } from "./payment-status-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export function AppointmentList() {
  const { appointments, loading, updateAppointment } = useAppointments();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No appointments found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card
            key={appointment.id}
            className="p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{appointment.clientName}</h3>
                <p className="text-sm text-muted-foreground">
                  {appointment.serviceName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={statusStyles[appointment.status]}
                >
                  {appointment.status}
                </Badge>
                {appointment.paymentStatus && (
                  <Badge
                    variant="secondary"
                    className={paymentStatusStyles[appointment.paymentStatus]}
                  >
                    {appointment.paymentStatus}
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <EditAppointmentDialog
                      appointment={appointment}
                      onAppointmentUpdated={updateAppointment}
                    />
                    <AppointmentStatusDialog
                      appointment={appointment}
                      onAppointmentUpdated={updateAppointment}
                    />
                    {appointment.paymentStatus !== "paid" && (
                      <PaymentStatusDialog
                        appointment={appointment}
                        onAppointmentUpdated={updateAppointment}
                      />
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {format(new Date(`${appointment.date}T${appointment.time}`), "PPp")}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
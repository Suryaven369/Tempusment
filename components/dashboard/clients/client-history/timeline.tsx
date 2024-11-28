"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, DollarSign, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientHistoryStats } from "./history-stats";
import { ClientPaymentHistory } from "./payment-history";
import type { Appointment, Payment } from "@/types";

interface TimelineProps {
  appointments: Appointment[];
  payments: Payment[];
  clientName: string;
}

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "no-show": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

export function ClientTimeline({ appointments, payments, clientName }: TimelineProps) {
  const [filter, setFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.status === filter;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`).getTime();
    const dateB = new Date(`${b.date}T${b.time}`).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const handleExport = () => {
    const data = sortedAppointments.map(appointment => ({
      Date: format(new Date(`${appointment.date}T${appointment.time}`), "PPpp"),
      Service: appointment.serviceName,
      Staff: appointment.staffName,
      Status: appointment.status,
      Price: `$${appointment.price}`,
      Notes: appointment.notes || ""
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${clientName.replace(/\s+/g, "_")}_history.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExport} className="w-full md:w-auto">
          Export History
        </Button>
      </div>

      <ClientHistoryStats appointments={appointments} payments={payments} />
      
      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
        
        <div className="space-y-8 pl-10">
          {sortedAppointments.map((appointment) => (
            <div key={appointment.id} className="relative">
              <div className="absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full bg-background border">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              
              <div className="flex flex-col gap-2 rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{appointment.serviceName}</h4>
                    <p className="text-sm text-muted-foreground">with {appointment.staffName}</p>
                  </div>
                  <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                    {appointment.status}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(`${appointment.date}T${appointment.time}`), "PPpp")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>${appointment.price}</span>
                  </div>
                  {appointment.notes && (
                    <p className="w-full text-muted-foreground">
                      Note: {appointment.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ClientPaymentHistory payments={payments} />
    </div>
  );
}
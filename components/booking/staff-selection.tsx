"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBooking } from "@/lib/contexts/booking-context";
import { getAllStaff } from "@/lib/firebase-collections";
import { cn } from "@/lib/utils";
import type { Staff } from "@/types";

interface StaffSelectionProps {
  userId: string;
}

export function StaffSelection({ userId }: StaffSelectionProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useBooking();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStaff() {
      try {
        const fetchedStaff = await getAllStaff();
        setStaff(fetchedStaff.filter(member => member.active));
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast({
          title: "Error",
          description: "Failed to load staff members. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStaff();
  }, [toast]);

  const handleStaffSelect = (selectedStaff: Staff) => {
    dispatch({ type: "SELECT_STAFF", staff: selectedStaff });
    dispatch({ type: "NEXT_STEP" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No staff members available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => dispatch({ type: "PREVIOUS_STEP" })}
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Select Staff Member</h2>
          <p className="text-muted-foreground">
            Choose your preferred staff member
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card
            key={member.id}
            className={cn(
              "cursor-pointer transition-colors",
              state.selectedStaff?.id === member.id
                ? "border-primary"
                : "hover:border-primary/50"
            )}
            onClick={() => handleStaffSelect(member)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {member.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </p>
                    </div>
                    {state.selectedStaff?.id === member.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  {member.specialties && member.specialties.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {member.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
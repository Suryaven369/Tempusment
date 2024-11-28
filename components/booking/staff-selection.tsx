"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, ArrowLeft } from "lucide-react";
import { getAllStaff } from "@/lib/firebase-collections";
import type { Staff } from "@/types";

interface StaffSelectionProps {
  userId: string;
  onBack: () => void;
  onNext: () => void;
}

export function StaffSelection({ userId, onBack, onNext }: StaffSelectionProps) {
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const fetchedStaff = await getAllStaff();
        setStaff(fetchedStaff.filter(member => member.active));
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStaff();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card
            key={member.id}
            className={`cursor-pointer transition-colors ${
              selectedStaff === member.id
                ? "border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedStaff(member.id)}
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
                    <h3 className="font-medium">{member.name}</h3>
                    {selectedStaff === member.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {member.specialties?.join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          className="w-full md:w-auto"
          disabled={!selectedStaff}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaffDialog } from "@/components/dashboard/staff/staff-dialog";
import { StaffList } from "@/components/dashboard/staff/staff-list";
import { StaffSearch } from "@/components/dashboard/staff/staff-search";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getAllStaff } from "@/lib/firebase-collections";
import type { Staff } from "@/types";

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStaff() {
      if (!user) return;
      
      try {
        const fetchedStaff = await getAllStaff();
        setStaff(fetchedStaff);
      } catch (error: any) {
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
  }, [user, toast]);

  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStaffAdded = (newStaff: Staff) => {
    setStaff((prev) => [...prev, newStaff]);
  };

  const handleStaffUpdated = (updatedStaff: Staff) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === updatedStaff.id ? updatedStaff : member
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Staff</h1>
        <StaffDialog onStaffAdded={handleStaffAdded} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <StaffSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <StaffList 
        staff={filteredStaff}
        loading={loading}
        onStaffUpdated={handleStaffUpdated}
      />
    </div>
  );
}
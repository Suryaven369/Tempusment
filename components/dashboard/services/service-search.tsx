"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ServiceSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ServiceSearch({ value, onChange }: ServiceSearchProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search services..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
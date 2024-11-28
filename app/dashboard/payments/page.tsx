"use client";

import { useState } from "react";
import { PaymentList } from "@/components/dashboard/payments/payment-list";
import { PaymentSearch } from "@/components/dashboard/payments/payment-search";
import { PaymentStats } from "@/components/dashboard/payments/payment-stats";
import { PaymentDialog } from "@/components/dashboard/payments/payment-dialog";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
        <PaymentDialog />
      </div>

      <PaymentStats />

      <div className="flex items-center justify-between gap-4">
        <PaymentSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <PaymentList searchQuery={searchQuery} />
    </div>
  );
}
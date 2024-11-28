"use client";

import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Payment } from "@/types";

interface PaymentHistoryProps {
  payments: Payment[];
}

const methodLabels = {
  credit_card: "Credit Card",
  debit_card: "Debit Card",
  cash: "Cash",
  bank_transfer: "Bank Transfer",
};

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  refunded: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

export function ClientPaymentHistory({ payments }: PaymentHistoryProps) {
  if (!payments || payments.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No payment history available</p>
      </Card>
    );
  }

  const sortedPayments = [...payments].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Payment History</h3>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {payment.createdAt ? format(new Date(payment.createdAt), "PPp") : "N/A"}
                </TableCell>
                <TableCell className="font-medium">
                  ${Number(payment.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  {methodLabels[payment.method as keyof typeof methodLabels]}
                </TableCell>
                <TableCell>{payment.description || "N/A"}</TableCell>
                <TableCell>
                  <Badge className={statusColors[payment.status as keyof typeof statusColors]}>
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
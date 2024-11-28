"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { getAllPayments } from "@/lib/firebase-collections";
import { useToast } from "@/components/ui/use-toast";
import type { Payment } from "@/types";

interface PaymentListProps {
  searchQuery: string;
}

const methodLabels = {
  credit_card: "Credit Card",
  debit_card: "Debit Card",
  cash: "Cash",
  bank_transfer: "Bank Transfer",
};

const statusStyles = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  refunded: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

export function PaymentList({ searchQuery }: PaymentListProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPayments() {
      try {
        const fetchedPayments = await getAllPayments();
        setPayments(fetchedPayments);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load payments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [toast]);

  const filteredPayments = payments.filter((payment) =>
    payment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No payments found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                {format(new Date(payment.createdAt!), "MMM d, yyyy h:mm a")}
              </TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>
                {methodLabels[payment.method as keyof typeof methodLabels]}
              </TableCell>
              <TableCell className="font-medium">
                ${Number(payment.amount).toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary"
                  className={statusStyles[payment.status as keyof typeof statusStyles]}
                >
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
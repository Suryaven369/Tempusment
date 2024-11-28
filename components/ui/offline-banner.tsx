"use client";

import { useNetworkStatus } from "@/hooks/use-network-status";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function OfflineBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <Alert variant="destructive" className="rounded-none">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>You're offline</AlertTitle>
      <AlertDescription>
        Some features may be limited. We'll sync your changes when you're back online.
      </AlertDescription>
    </Alert>
  );
}
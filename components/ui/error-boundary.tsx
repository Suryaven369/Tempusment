"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] items-center justify-center p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="mt-2">
          {error.message || 'An unexpected error occurred.'}
          {error.message?.includes('offline') && (
            <p className="mt-2 text-sm">
              It seems you&apos;re offline. The app will continue to work with locally cached data.
            </p>
          )}
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-4"
          onClick={reset}
        >
          Try again
        </Button>
      </Alert>
    </div>
  );
}
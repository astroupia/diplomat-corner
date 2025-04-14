"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-red-600 mb-2">Unexpected Error</h1>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>

      {onRetry && (
        <Button variant="default" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorScreen;

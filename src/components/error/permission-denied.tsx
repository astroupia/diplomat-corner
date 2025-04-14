"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PermissionDeniedScreenProps {
  message?: string;
  showRequestAccess?: boolean;
  onRequestAccess?: () => void;
}

const PermissionDeniedScreen: React.FC<PermissionDeniedScreenProps> = ({
  message = "You do not have permission to access this page.",
  showRequestAccess = false,
  onRequestAccess,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <ShieldAlert className="h-16 w-16 text-yellow-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2 text-yellow-600">Access Denied</h1>
      <p className="text-muted-foreground max-w-md mb-6">{message}</p>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>

        {showRequestAccess && onRequestAccess && (
          <Button onClick={onRequestAccess} variant="default">
            Request Access
          </Button>
        )}
      </div>
    </div>
  );
};

export default PermissionDeniedScreen;

"use client";

import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface NotFoundScreenProps {
  message?: string;
  showBackButton?: boolean;
}

const NotFoundScreen: React.FC<NotFoundScreenProps> = ({
  message = "The page you're looking for doesn't exist.",
  showBackButton = true,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <Ghost className="h-16 w-16 text-gray-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-700 mb-2">Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>

      {showBackButton && (
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      )}
    </div>
  );
};

export default NotFoundScreen;

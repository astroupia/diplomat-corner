"use client";

import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground text-sm">Loading, please wait...</p>
    </div>
  );
};

export default LoadingScreen;

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ManageCar from "@/components/manage-car";
import { useUser } from "@clerk/nextjs";
import { ICar } from "@/lib/models/car.model";
import LoadingScreen from "@/components/error/loading-screen";
import ErrorScreen from "@/components/error/error-screen";
import NotFoundScreen from "@/components/error/not-found-screen";
import PermissionDeniedScreen from "@/components/error/permission-denied";

export default function EditCarPage() {
  const { id } = useParams();
  const { user, isLoaded } = useUser();
  const [car, setCar] = useState<ICar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        // Early return if no ID or user not loaded
        if (!id || !isLoaded) {
          setLoading(false);
          return;
        }

        // If user is not authenticated, set permission denied
        if (!user) {
          setPermissionDenied(true);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/cars/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch car");
        }

        // Check if car exists
        if (!data) {
          setLoading(false);
          return;
        }

        // Check if the current user owns the car
        if (data.userId !== user.id) {
          setPermissionDenied(true);
          setLoading(false);
          return;
        }

        setCar(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, user, isLoaded]);

  // Show loading screen while data is being fetched
  if (!isLoaded || loading) {
    return <LoadingScreen />;
  }

  // Show permission denied screen if user is not authenticated or doesn't own the car
  if (!user || permissionDenied) {
    return <PermissionDeniedScreen />;
  }

  // Show error screen if there's an error
  if (error) {
    return <ErrorScreen message={error} />;
  }

  // Show not found screen if car doesn't exist
  if (!car) {
    return <NotFoundScreen message="Car not found." />;
  }

  // Render the edit form if all checks pass
  return <ManageCar initialData={car} isEditMode={true} />;
}

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
        const response = await fetch(`/api/cars/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch car");
        }

        // Check if the current user owns this car
        if (data.userId !== user?.id) {
          setPermissionDenied(true);
          return;
        }

        setCar(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch car");
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchCar();
    }
  }, [id, user]);

  if (loading) return <LoadingScreen />;
  if (permissionDenied)
    return <PermissionDeniedScreen message="You do not have permission to edit this car." />;
  if (error) return <ErrorScreen message={error} />;
  if (!car) return <NotFoundScreen />;

  return <ManageCar initialData={car} isEditMode={true} />;
}

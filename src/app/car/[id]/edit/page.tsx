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
        if (!id || !user) {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/cars/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch car");
        }

        // Check if the car exists and if the current user owns it
        if (!data || data.userId !== user.id) {
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

    if (isLoaded) {
      fetchCar();
    }
  }, [id, user, isLoaded]);

  if (!isLoaded || loading) return <LoadingScreen />;
  if (!user) return <PermissionDeniedScreen />;
  if (permissionDenied) return <PermissionDeniedScreen />;
  if (error) return <ErrorScreen message={error} />;
  if (!car) return <NotFoundScreen message="Car not found." />;

  return <ManageCar initialData={car} isEditMode={true} />;
}

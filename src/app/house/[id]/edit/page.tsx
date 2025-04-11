"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ManageHouse from "@/components/manage-house";
import { useUser } from "@clerk/nextjs";
import { IHouse } from "@/lib/models/house.model";

export default function EditHousePage() {
  const { id } = useParams();
  const { user } = useUser();
  const [house, setHouse] = useState<IHouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await fetch(`/api/house/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch house');
        }

        // Check if the current user owns this house
        if (data.userId !== user?.id) {
          setError('You do not have permission to edit this house');
          return;
        }

        setHouse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch house');
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchHouse();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-center">
          <p className="text-xl font-semibold">House not found</p>
        </div>
      </div>
    );
  }

  return <ManageHouse initialData={house} isEditMode={true} />;
} 
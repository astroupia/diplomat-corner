"use client";

import { useSearchParams } from "next/navigation";
import ManageProduct from "@/components/manage-product";
import { useEffect, useState } from "react";
import { IHouse } from "@/lib/models/house.model";
import { ICar } from "@/lib/models/car.model";

export default function ManageProductPage() {
  const searchParams = useSearchParams();
  const [initialData, setInitialData] = useState<IHouse | ICar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'house' | 'car'>('house');

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get("id");
      const type = searchParams.get("type");

      if (id && type) {
        try {
          let data;
          if (type === "house") {
            const response = await fetch(`/api/house/${id}`);
            data = await response.json();
            setActiveTab('house');
          } else if (type === "car") {
            const response = await fetch(`/api/cars/${id}`);
            data = await response.json();
            setActiveTab('car');
          }
          setInitialData(data || null);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ManageProduct 
        initialData={initialData || undefined}
        isEditMode={!!searchParams.get("id")}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

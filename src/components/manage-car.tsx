"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ICar } from "@/lib/models/car.model";

interface ICarExtended extends ICar {
  servicePrice?: number;
}

interface ManageCarProps {
  initialData?: ICarExtended;
  isEditMode?: boolean;
}

const ManageCar: React.FC<ManageCarProps> = ({
  initialData,
  isEditMode = false,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Car" : "Add New Car"}
        </h1>
        <p className="text-gray-600 mb-4">
          This component is a placeholder until the full implementation is
          loaded.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ManageCar;

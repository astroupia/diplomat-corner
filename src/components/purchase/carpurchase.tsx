"use client";
import { useState, useEffect } from "react";
import { createPurchase } from "@/lib/actions/carpurchase.action";
import Image from "next/image";
import { Truck, Fuel, CarIcon } from "lucide-react";
import { ICar } from "@/lib/models/car.model";

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<ICar | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Mock user and seller IDs (in a real app, these would come from authentication)
  const userId = "buyer123";
  const sellerId = "admin";

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${params.id}`);
        const data = await response.json();
        if (data && data._id) {
          setCar(data);
        } else {
          setCar(null);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [params.id]);

  const handlePurchase = async () => {
    if (!car) return;
    try {
      const result = await createPurchase(userId, sellerId, {
        make: car.Name.split(" ")[0], // Extract make (e.g., "Ford" from "F-150 2024")
        model: car.Name.split(" ").slice(1).join(" "), // Extract model (e.g., "F-150 2024")
        year: 2021, // Hard-coded; fetch dynamically if available
        price: car.Price,
        mileage: car.Mileage,
        mpg: car.MilesPerGallon,
        topSpeed: car.Speed,
      });
      setSubmitResult({
        success: true,
        message: `Purchase successful! Purchase ID: ${result.purchaseId}`,
      });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: `Failed to purchase: ${(error as Error).message}`,
      });
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!car) return <p className="text-center">Car not found</p>;

  return (
    <div className="p-6 bg-white min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Car Image */}
          <div className="md:w-1/2">
            <Image
              src="/ford-f150.jpg" // Placeholder: replace with dynamic image or actual path
              alt={car.Name}
              width={500}
              height={300}
              className="rounded-lg object-cover w-full"
            />
          </div>

          {/* Car Details */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900">
              2021 {car.Name} {/* Hard-coded year for consistency */}
            </h1>
            <p className="text-2xl font-semibold text-gray-700 mt-2">
              ${car.Price.toLocaleString()}
            </p>
            <p className="text-gray-600 mt-2">{car.Description}</p>

            {/* Details Section */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-800">Details</h2>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Truck size={20} className="text-gray-600" />
                  <span>{car.Mileage.toLocaleString()} Km</span>
                  <span className="text-gray-500">Mileage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel size={20} className="text-gray-600" />
                  <span>{car.MilesPerGallon} MPG</span>
                </div>
                <div className="flex items-center gap-2">
                  <CarIcon size={20} className="text-gray-600" />
                  <span>{car.Speed} Mph</span>
                  <span className="text-gray-500">Top Speed</span>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700"
            >
              Purchase
            </button>

            {/* Submit Result */}
            {submitResult && (
              <div className="mt-2">
                <p className={`text-sm ${submitResult.success ? "text-green-600" : "text-red-600"}`}>
                  {submitResult.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Description</h2>
          <p className="text-gray-600 mt-2">{car.Description}</p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li>500 V8 HP: Tows up to 12,700 lbs (Adaptive suspension for smooth & rugged rides)</li>
            <li>12” touchscreen w/ Apple CarPlay & Android Auto + B&O sound system</li>
            <li>Safety: 360° camera, lane-keeping assist, adaptive cruise control, trailer sway control</li>
            <li>Off-road: tires, bed liner w/ tonneau cover, remote start, and keyless entry</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { createPurchase } from "@/lib/actions/carpurchase.action";
import Image from "next/image";
import { Truck, Fuel, Car as CarIcon } from "lucide-react";
import { ICar } from "@/lib/models/car.model";

interface CarPurchaseProps {
  params: { id: string };
}

const CarPurchase = ({ params }: CarPurchaseProps) => {
  const [car, setCar] = useState<ICar | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = "buyer123"; // Mock; replace with auth
  const sellerId = "admin"; // Mock; replace with auth

  useEffect(() => {
    const fetchCar = async () => {
      try {
        console.log(`Fetching car with ID: ${params.id}`);
        const response = await fetch(`/api/carpurchase/${params.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch car: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Raw API response:", data);
        if (data && data._id) {
          setCar(data);
          setError(null);
        } else {
          setCar(null);
          setError(`No valid car data found for ID: ${params.id}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("Fetch error:", errorMessage);
        setError(errorMessage);
        setCar(null);
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
        make: car.Name.split(" ")[0],
        model: car.Name.split(" ").slice(1).join(" "),
        year: 2021, // Hard-coded; replace with car.year if available
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
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setSubmitResult({
        success: false,
        message: `Failed to purchase: ${errorMessage}`,
      });
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading car details...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (!car) return <p className="text-center text-gray-600">Car not found for ID: {params.id}</p>;

  return (
    <div className="p-6 bg-white min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <Image
              src="/ford-f150.jpg"
              alt={car.Name}
              width={500}
              height={300}
              className="rounded-lg object-cover w-full"
            />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900">
              2021 {car.Name}
            </h1>
            <p className="text-2xl font-semibold text-gray-700 mt-2">
              ${car.Price.toLocaleString()}
            </p>
            <p className="text-gray-600 mt-2">{car.Description || "No description available"}</p>
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-800">Details</h2>
              <div className="flex gap-4 mt-2 flex-wrap">
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
                </div>
              </div>
            </div>
            <button
              onClick={handlePurchase}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
              disabled={submitResult?.success}
            >
              {submitResult?.success ? "Purchased" : "Purchase"}
            </button>
            {submitResult && (
              <div className="mt-2">
                <p className={`text-sm ${submitResult.success ? "text-green-600" : "text-red-600"}`}>
                  {submitResult.message}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Description</h2>
          <p className="text-gray-600 mt-2">{car.Description || "No additional details"}</p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li>500 V8 HP: Tows up to 12,700 lbs</li>
            <li>12” touchscreen w/ Apple CarPlay & Android Auto</li>
            <li>Safety: 360° camera, lane-keeping assist</li>
            <li>Off-road: tires, bed liner, remote start</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CarPurchase;
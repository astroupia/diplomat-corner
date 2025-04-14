"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { CarFront, GaugeCircle, Fuel, Settings, ArrowLeft } from "lucide-react";
import { ICar } from "@/lib/models/car.model";
import ContactSellerDialog from "@/components/dialogs/contact-seller-dialog";
import { Button } from "@/components/ui/button";

export default function CarDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id as string;
  const [car, setCar] = useState<ICar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCar(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCar();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-700">
          Loading Car Details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-gray-600 text-lg">Car not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-700 hover:text-green-600 mb-8 text-sm font-medium transition-colors duration-200"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Cars
      </button>

      <div className="lg:flex lg:space-x-12">
        <div className="lg:w-2/3">
          <Image
            src={car.imageUrl || "/car.jpg"}
            alt={car.name}
            width={800}
            height={400}
            className="w-full h-auto object-cover rounded-md mb-8"
            priority
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">{car.description}</p>
          </div>
        </div>

        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
          <p className="text-2xl text-green-600 font-semibold mb-6">
            {car.currency} {car.price.toLocaleString()}
          </p>

          <div className="grid grid-cols-2 gap-4 text-gray-700 mb-8">
            <div className="flex items-center gap-2">
              <GaugeCircle size={18} className="text-gray-500" />
              <span className="text-sm">{car.speed} Mph</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel size={18} className="text-gray-500" />
              <span className="text-sm">{car.milesPerGallon} MPG</span>
            </div>
            <div className="flex items-center gap-2">
              <CarFront size={18} className="text-gray-500" />
              <span className="text-sm">{car.mileage.toLocaleString()} Km</span>
            </div>
            {car.year > 0 && (
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-gray-500" />
                <span className="text-sm">Year {car.year}</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Specifications
            </h2>
            <div className="space-y-3 text-gray-700">
              {car.engine && (
                <p>
                  <strong className="font-medium">Engine:</strong> {car.engine}
                </p>
              )}
              {car.transmission && (
                <p>
                  <strong className="font-medium">Transmission:</strong>{" "}
                  {car.transmission}
                </p>
              )}
              {car.fuel && (
                <p>
                  <strong className="font-medium">Fuel Type:</strong> {car.fuel}
                </p>
              )}
              {car.bodyType && (
                <p>
                  <strong className="font-medium">Body Type:</strong>{" "}
                  {car.bodyType}
                </p>
              )}
              {car.condition && (
                <p>
                  <strong className="font-medium">Condition:</strong>{" "}
                  {car.condition}
                </p>
              )}
              {car.maintenance && (
                <p>
                  <strong className="font-medium">Maintenance:</strong>{" "}
                  {car.maintenance}
                </p>
              )}
            </div>
          </div>
          
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-green-500 transition-colors duration-200"
          >
            Inquire Now
          </Button>
          {/* Contact Seller Dialog */}
          <ContactSellerDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            productType="car"
            sellerName="the seller"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Bed, Bath, Ruler, Car, ArrowLeft } from "lucide-react";

interface House {
  _id: string;
  name: string;
  advertisementType: string;
  currency: string;
  price: number;
  imageUrl?: string;
  bedroom: number;
  bathroom: number;
  size: number;
  parkingSpace: number;
  description: string;
  paymentMethod: string;
  houseType: string;
  condition: string;
  maintenance: string;
  essentials: string[];
}

export default function HouseDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await fetch(`/api/house/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHouse(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchHouse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-700">
          Loading House Details...
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

  if (!house) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-gray-600 text-lg">Property not found</p>
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
        Back to Houses
      </button>

      <div className="lg:flex lg:space-x-12">
        <div className="lg:w-2/3">
          <Image
            src={house.imageUrl || "/c.jpg"}
            alt={house.name}
            width={800}
            height={400}
            className="w-full h-auto object-cover rounded-md mb-8"
            priority
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">{house.description}</p>
          </div>
        </div>

        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {house.name}
            </h1>
            <span className="bg-green-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {house.advertisementType}
            </span>
          </div>
          <p className="text-2xl text-green-600 font-semibold mb-6">
            {house.currency} {house.price.toLocaleString()}
          </p>

          <div className="grid grid-cols-2 gap-4 text-gray-700 mb-8">
            <div className="flex items-center gap-2">
              <Bed size={18} className="text-gray-500" />
              <span className="text-sm">{house.bedroom} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath size={18} className="text-gray-500" />
              <span className="text-sm">{house.bathroom} Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler size={18} className="text-gray-500" />
              <span className="text-sm">{house.size.toLocaleString()} ft²</span>
            </div>
            <div className="flex items-center gap-2">
              <Car size={18} className="text-gray-500" />
              <span className="text-sm">{house.parkingSpace} Parking</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Details
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong className="font-medium">Payment Method:</strong>{" "}
                {house.paymentMethod}
              </p>
              <p>
                <strong className="font-medium">House Type:</strong>{" "}
                {house.houseType}
              </p>
              <p>
                <strong className="font-medium">Condition:</strong>{" "}
                {house.condition}
              </p>
              <p>
                <strong className="font-medium">Maintenance:</strong>{" "}
                {house.maintenance}
              </p>
              <p>
                <strong className="font-medium">Essentials:</strong>{" "}
                {house.essentials?.join(", ") || "None"}
              </p>
            </div>
          </div>

          <button className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-green-500 transition-colors duration-200">
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  );
}

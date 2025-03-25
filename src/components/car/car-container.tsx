"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/car/car-card";
import { ICar } from "@/lib/models/car.model";
const CarContainer: React.FC = () => {
  const [cars, setCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars");
        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers.get("content-type"));

        if (!response.ok) {
          const text = await response.text();
          console.error("Response Text:", text);
          throw new Error(`Failed to fetch cars: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setCars(data);
        } else {
          throw new Error("Invalid data format: Expected an array");
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div>
      {/* Cover Section */}
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url("/ci.jpg")' }} // Placeholder: replace with actual image
      >
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold">Cars</h1>
          <p className="text-lg mt-2">Service / Cars for Sale</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Cars</h2>
            <select className="border border-gray-300 rounded px-3 py-1 text-gray-600">
              <option>Default Order</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
            </select>
          </div>

          {loading ? (
            <p className="text-center">Loading cars...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.length > 0 ? (
                cars.map((car) => (
                  <Card key={car._id} {...car} _id={car._id} />
                ))
              ) : (
                <p className="text-center">No cars available.</p>
              )}
            </div>
          )}
          <p className="text-right text-sm text-gray-500 mt-4">All Properties for Sale</p>
        </div>
      </div>
    </div>
  );
};

export default CarContainer;
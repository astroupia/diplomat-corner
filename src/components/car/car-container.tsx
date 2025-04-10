"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/car/car-card";

const CarContainer: React.FC = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCars = async () => {
      try {
        const response = await fetch("/api/cars");
        const carData = await response.json();
        setCars(carData);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    getCars();
  }, []);

  return (
    <div>
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
<<<<<<< HEAD
        style={{ backgroundImage: 'url("car_preview.jpg")' }}
=======
        style={{ backgroundImage: 'url("/assets/images/car_preview.jpg")' }}
>>>>>>> d5eb80e51b9bfa8f4266a0ba8e9a677d918f59f5
      >
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold">Cars</h1>
          <p className="text-lg mt-2">Service / Cars for Sale</p>
        </div>
      </div>
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
                  <Card
                    key={car._id}
                    _id={car._id}
                    name={car.name}
                    price={car.price}
                    mileage={car.mileage}
                    milesPerGallon={car.milesPerGallon}
                    speed={car.speed}
                  />
                ))
              ) : (
                <p className="text-center">No cars available.</p>
              )}
            </div>
          )}
          <p className="text-right text-sm text-gray-500 mt-4">
            All Properties for Sale
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarContainer;

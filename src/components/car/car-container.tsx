"use client";

import React, { useEffect, useState } from "react";
import Card from "./car-card";

const CarContainer: React.FC = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars");
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
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
        style={{ backgroundImage: 'url("/car_preview.jpg")' }}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car: any, index: number) => (
                <Card key={index} {...car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarContainer;

"use client";

import CardHouse from "@/components/house/card-house";
import type { IHouse } from "@/lib/models/house.model";
import React, { useEffect, useState } from "react";

const CardContainer: React.FC = () => {
  const [houses, setHouses] = useState<IHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("Default");

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await fetch("/api/house", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setHouses(data);
        } else {
          throw new Error("Invalid data format: Expected an array");
        }
      } catch (error) {
        console.error("Error fetching houses:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order = e.target.value;
    setSortOrder(order);
    let sortedHouses = [...houses];
    if (order === "Price Low to High") {
      sortedHouses.sort((a, b) => a.price - b.price);
    } else if (order === "Price High to Low") {
      sortedHouses.sort((a, b) => b.price - a.price);
    }
    setHouses(sortedHouses);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url("/house_preview.jpg")' }}
      >
        <div className="text-center text-white bg-black bg-opacity-50 p-4 rounded-lg">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Properties</h1>
          <p className="text-base sm:text-lg mt-2">Find Your Perfect Home</p>
        </div>
      </div>
      <div className="bg-gray-100 py-6 sm:py-8 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">All Properties</h2>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-600 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
            >
              <option value="Default">Default Order</option>
              <option value="Price Low to High">Price Low to High</option>
              <option value="Price High to Low">Price High to Low</option>
            </select>
          </div>
          {loading ? (
            <div className="text-center text-gray-600 animate-pulse">Loading properties...</div>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {houses.length > 0 ? (
                houses.map((house) => <CardHouse key={house._id} {...house} />)
              ) : (
                <p className="text-center text-gray-600 col-span-full">
                  No properties available.
                </p>
              )}
            </div>
          )}
          <p className="text-right text-sm text-gray-500 mt-6">Explore All Properties for Rent</p>
        </div>
      </div>
    </div>
  );
};

export default CardContainer;

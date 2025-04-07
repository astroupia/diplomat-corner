"use client";

import CardHouse from "@/components/house/card-house";
import type { IHouse } from "@/lib/models/house.model";
import React, { useEffect, useState } from "react";
import { getAllHouse } from "@/lib/actions/house.actions";

const CardContainer: React.FC = () => {
  const [houses, setHouses] = useState<IHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        console.log("Fetching houses using getAllHouse server action");
        const data = await getAllHouse();
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
          setHouses(data);
        } else {
          throw new Error("Invalid data format: Expected an array");
        }
      } catch (error) {
        console.error("Error fetching houses:", error);
        setError((error as Error).message);
        setHouses([
          {
            _id: "1",
            name: "92 Allium Place, Orlando FL 32827",
            userId: "1",
            description: "Beautiful house in Orlando",
            advertisementType: "Rent",
            price: 590693,
            paymentMethod: "Monthly",
            bedroom: 4,
            parkingSpace: 2,
            bathroom: 4,
            size: 2096,
            houseType: "House",
            condition: "New",
            maintenance: "Included",
            essentials: ["WiFi", "Electricity", "Water"],
            currency: "USD",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url("/c.jpg")' }}
      >
        <div className="text-center text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Properties
          </h1>
          <p className="text-base sm:text-lg mt-2">Service / House for Rent</p>
        </div>
      </div>
      <div className="bg-gray-50 py-6 sm:py-8 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">All Properties</h2>
            <select className="border border-gray-300 rounded px-3 py-1 text-gray-600 text-sm sm:text-base w-full sm:w-auto">
              <option>Default Order</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
            </select>
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading properties...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {houses.length > 0 ? (
                houses.map((house) => <CardHouse key={house._id} {...house} />)
              ) : (
                <p className="text-center text-gray-600 col-span-full">
                  No properties available.
                </p>
              )}
            </div>
          )}
          <p className="text-right text-sm text-gray-500 mt-4 sm:mt-6">
            All Properties for Rent
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardContainer;

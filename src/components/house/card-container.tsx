"use client";

import React, { useEffect, useState } from "react";
import CardHouse from "@/components/house/card-house";
import { House } from "@/lib/actions/house.Actions";

const CardContainer: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouses = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      try {
        const response = await fetch(`${apiUrl}/api/houses`);
        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers.get("content-type"));

        if (!response.ok) {
          const text = await response.text();
          console.error("Response Text:", text);
          throw new Error(`Failed to fetch houses: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setHouses(data);
        } else {
          throw new Error("Invalid data format: Expected an array");
        }
      } catch (error) {
        console.error("Error fetching houses:", error);
        setError((error as Error).message);
        // Fallback data in case of error
        setHouses([
          {
            id: "1",
            name: "92 Allium Place, Orlando FL 32827",
            userId: "user1",
            description: "Beautiful house in Orlando",
            advertisementType: "Rent",
            price: 590693,
            paymentMethod: "Monthly",
            bedroom: 4,
            parkingSpace: 2,
            bathroom: 4,
            size: 2096,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  return (
    <div>
      {/* Cover Section */}
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url("/c.jpg")' }}
      >
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold">Properties</h1>
          <p className="text-lg mt-2">Service / House for Rent</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Properties</h2>
            <select className="border border-gray-300 rounded px-3 py-1 text-gray-600">
              <option>Default Order</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
            </select>
          </div>

          {loading ? (
            <p className="text-center">Loading properties...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {houses.length > 0 ? (
                houses.map((house) => (
                  <CardHouse
                    key={house.id}
                    address={house.name}
                    price={house.price}
                    bedrooms={house.bedroom}
                    bathrooms={house.bathroom}
                    size={house.size}
                  />
                ))
              ) : (
                <p className="text-center">No properties available.</p>
              )}
            </div>
          )}
          <p className="text-right text-sm text-gray-500 mt-4">All Properties for Rent</p>
        </div>
      </div>
    </div>
  );
};

export default CardContainer;
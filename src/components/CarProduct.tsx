"use client";


import React, { useState } from "react";
import { ShoppingCart, Edit, Home, Car, UploadCloud } from "lucide-react";

const ManageProductsAndAds = () => {
  const [selectedTransmission, setSelectedTransmission] = useState<string | null>("WiFi");
  const [selectedFuel, setSelectedFuel] = useState<string | null>("Gasoline");
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>("Truck");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="bg-green-100 w-64 p-4">
        <h2 className="text-lg font-bold mb-4">Manage Products and Ads</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-600" /> Products
            </h3>
            <ul className="space-y-2 ml-6">
              <li className="text-green-600 hover:underline flex items-center gap-2">
                <Edit className="w-4 h-4" /> Add Products
              </li>
              <li className="text-gray-600 hover:underline flex items-center gap-2">
                <Edit className="w-4 h-4" /> Edit Products
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Home className="w-5 h-5 text-green-600" /> Adverts
            </h3>
            <ul className="space-y-2 ml-6">
              <li className="text-green-600 hover:underline flex items-center gap-2">
                <Edit className="w-4 h-4" /> Add Adverts
              </li>
              <li className="text-gray-600 hover:underline flex items-center gap-2">
                <Edit className="w-4 h-4" /> Edit Adverts
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="p-6 bg-green-50 flex-grow">
        <h2 className="text-xl font-bold mb-6">Manage Ads</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Left Form Section */}
          <div>
            <label className="block text-sm font-medium mb-2">Brand Name</label>
            <input type="text" placeholder="Ford" className="w-full border border-gray-300 rounded p-2 mb-4" />

            <label className="block text-sm font-medium mb-2">Model</label>
            <input type="text" placeholder="F150" className="w-full border border-gray-300 rounded p-2 mb-4" />

            <label className="block text-sm font-medium mb-2">Year of Manufacture</label>
            <input type="number" placeholder="2022" className="w-full border border-gray-300 rounded p-2 mb-4" />

            <label className="block text-sm font-medium mb-2">Mileage</label>
            <input type="number" placeholder="132" className="w-full border border-gray-300 rounded p-2 mb-4" />

            {/* Transmission Selection */}
            <label className="block text-sm font-medium mb-2">Transmission</label>
            <div className="flex gap-4 mb-4">
              {["WiFi", "Manual"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedTransmission(type)}
                  className={`px-4 py-2 border rounded ${
                    selectedTransmission === type ? "bg-green-500 text-white" : "bg-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Fuel Selection */}
            <label className="block text-sm font-medium mb-2">Fuel</label>
            <div className="flex gap-4 mb-4">
              {["Gasoline", "Diesel", "Electric"].map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => setSelectedFuel(fuel)}
                  className={`px-4 py-2 border rounded ${
                    selectedFuel === fuel ? "bg-green-500 text-white" : "bg-white"
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>

            {/* Body Type Selection */}
            <label className="block text-sm font-medium mb-2">Body Type</label>
            <div className="grid grid-cols-3 gap-4">
              {["Truck", "SUV", "Sedan", "Hatchback", "Minivan"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedBodyType(type)}
                  className={`px-4 py-2 border rounded ${
                    selectedBodyType === type ? "bg-green-500 text-white" : "bg-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Right Media Section */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-green-600" /> Image, Other Media
            </label>
            <div className="border border-dashed border-gray-300 p-4 rounded mb-4">
              <p>Upload media for the campaign</p>
            </div>

            <label className="block text-sm font-medium mb-2">Condition</label>
            <input type="text" placeholder="Excellent" className="w-full border border-gray-300 rounded p-2 mb-4" />

            <label className="block text-sm font-medium mb-2">Engine</label>
            <input type="text" placeholder="3.8L (V6 engine)" className="w-full border border-gray-300 rounded p-2 mb-4" />

            <label className="block text-sm font-medium mb-2">Price</label>
            <input type="text" placeholder="Write the product price" className="w-full border border-gray-300 rounded p-2 mb-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProductsAndAds;

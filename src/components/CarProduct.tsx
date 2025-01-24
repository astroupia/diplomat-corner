"use client"; // Ensures client-side execution
import React, { useState } from "react";
import {
  Upload,
  Wifi,
  Home,
  Car,
  CheckCircle,
  Circle,
  ShoppingCart,
  Plus,
  Pen,
  Tv,
} from "lucide-react";
import MaxWidthWrapper from "./MaxWidthWrapper";

const ManageProductsAndAds = () => {
  const [selectedTransmission, setSelectedTransmission] = useState("WiFi");
  const [selectedFuel, setSelectedFuel] = useState("Gasoline");
  const [selectedBodyType, setSelectedBodyType] = useState("Truck");
  const [currency, setCurrency] = useState("ETB");

  return (
    <section className="flex flex-col min-h-screen">
      <MaxWidthWrapper>
        <h1 className="text-xl md:text-2xl font-semibold text-primary m-6">
          Manage Products and Ads
        </h1>

        <div className="flex flex-col lg:flex-row bg-secondary h-auto lg:h-screen bg-primary-light p-4 lg:p-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/5 bg-secondary rounded-3xl shadow-md p-4 border-2 border-primary lg:mb-0 pr-7 mr-4">
            <ul className="space-y-4 text-green-800 font-semibold text-sm md:text-base">
              <li className="flex flex-row">
                <ShoppingCart size={20} /> Products
              </li>
              <li className="pl-4 flex flex-row text-primary">
                <Plus /> Add Products
              </li>
              <li className="pl-4 text-primary flex flex-row">
                <Pen /> Edit Products
              </li>
              <li className="flex flex-row">
                <Tv size={20} /> Adverts
              </li>
              <li className="pl-4 flex flex-row text-primary">
                <Plus /> Add Adverts
              </li>
              <li className="pl-4 flex flex-row text-primary">
                <Pen /> Edit Adverts
              </li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white border-2 border-primary rounded-3xl shadow-md p-4 lg:p-6">
            {/* Buttons for Product Type */}
            <div className="flex flex-col pl-7 sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <button className="flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg shadow-md w-full sm:w-auto">
                <Car size={20} />
                <span className="font-semibold">Car For Sale</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-white text-green-800 px-6 py-3 rounded-lg shadow-md border border-green-800 w-full sm:w-auto">
                <Home size={20} />
                <span className="font-semibold">House For Rent</span>
              </button>
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl border-primary p-4 lg:p-6">
              {/* Left Section */}
              <div className="col-span-12 lg:col-span-8 space-y-6 bg-secondary p-4 lg:p-6 rounded-3xl shadow-md border-3 border-primary">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-green-800">Brand Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border-b-2 border-green-800 focus:outline-none focus:border-primary bg-secondary"
                      placeholder="Ford"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-800">Model</label>
                    <input
                      type="text"
                      className="w-full p-2 border-b-2 border-green-800 focus:outline-none focus:border-primary bg-secondary"
                      placeholder="F150"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-green-800">Year of Manufacture</label>
                    <input
                      type="number"
                      className="w-full p-2 border-b-2 border-green-800 focus:outline-none focus:border-primary bg-secondary"
                      placeholder="2022"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-800">Mileage</label>
                    <input
                      type="number"
                      className="w-full p-2 border-b-2 border-green-800 focus:outline-none focus:border-primary bg-secondary"
                      placeholder="132"
                    />
                  </div>
                </div>

                {/* Radio Buttons for Transmission, Fuel, and Body Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-green-800">Transmission</label>
                    <div className="flex space-x-4">
                      {["WiFi", "Manual"].map((option) => (
                        <button
                          key={option}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                            selectedTransmission === option
                              ? "bg-primary text-white border border-primary"
                              : "bg-secondary text-black border border-black"
                          }`}
                          onClick={() => setSelectedTransmission(option)}
                        >
                          {selectedTransmission === option ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Circle size={16} />
                          )}
                          <span>{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-green-800">Fuel</label>
                    <div className="flex space-x-4">
                      {["Gasoline", "Diesel", "Electric"].map((option) => (
                        <button
                          key={option}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                            selectedFuel === option
                              ? "bg-primary text-white border border-primary"
                              : "bg-secondary text-black border border-black"
                          }`}
                          onClick={() => setSelectedFuel(option)}
                        >
                          {selectedFuel === option ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Circle size={16} />
                          )}
                          <span>{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-green-800">Body Type</label>
                  <div className="flex space-x-4">
                    {["Truck", "SUV", "Sedan", "Hatchback", "Minivan"].map((option) => (
                      <button
                        key={option}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          selectedBodyType === option
                            ? "bg-primary text-white border border-primary"
                            : "bg-secondary text-black border border-black"
                        }`}
                        onClick={() => setSelectedBodyType(option)}
                      >
                        {selectedBodyType === option ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Circle size={16} />
                        )}
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="col-span-12 lg:col-span-4 space-y-6 border-2 border-primary p-4 lg:p-6 rounded-3xl shadow-md">
                <div className="h-40 flex flex-col items-center justify-center border-dashed border-2 border-primary rounded-lg">
                  <Upload size={40} className="text-primary" />
                  <p className="mt-4 text-sm text-green-800">Upload media for the campaign</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-green-800">Condition</label>
                    <input
                      type="text"
                      className="w-full p-2 border-b-2 border-green-800 focus:outline-none focus:border-primary bg-secondary"
                      placeholder="Excellent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-800">Engine</label>
                    <input
                      type="text"
                      className="w-full p-2 border-b-2 border-green-800 focus:outline-none focus:border-primary bg-secondary"
                      placeholder="3.8L V6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-800">Maintenance</label>
                    <input
                      type="text"
                      className="w-full p-2 border-b-2 border-green-800 focus:outline-none focus:border-primary bg-secondary"
                      placeholder="Frequent"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 items-center">
                  <label className="block text-sm font-semibold text-green-800">Price</label>
                  <input
                    type="number"
                    className="w-full p-2 border-b-2 border-green-800 focus:outline-none focus:border-primary bg-secondary"
                    placeholder="Price"
                  />
                  <div className="flex space-x-4">
                    {["ETB", "USD"].map((option) => (
                      <button
                        key={option}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          currency === option
                            ? "bg-primary text-white border border-primary"
                            : "bg-secondary text-black border border-black"
                        }`}
                        onClick={() => setCurrency(option)}
                      >
                        {currency === option ? <CheckCircle size={16} /> : <Circle size={16} />}
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-green-800">Tags</label>
                  <input
                    type="text"
                    className="w-full p-2 border-b-2 border-green-800 focus:outline-none focus:border-primary bg-secondary"
                    placeholder="#carrental"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-green-800">Brief Description</label>
                  <textarea
                    className="w-full p-2 border-b-2 border-green-800 focus:outline-none focus:border-primary bg-secondary"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>
              </div>
            </div>
          </main>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ManageProductsAndAds;

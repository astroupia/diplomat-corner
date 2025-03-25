"use client";

import {
  Car,
  CheckCircle,
  Circle,
  Home,
  Pen,
  PlayCircle,
  Plus,
  ShoppingCart,
  Tv,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import { createHouse } from "@/lib/actions/house.Actions";
const ManageHouse: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [paymentTerm, setPaymentTerm] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");

  const essentials = [
    "WiFi",
    "Furnished",
    "Play Ground",
    "Living Area",
    "GYM",
    "Outdoor",
    "Dining Area",
    "Jacuzzi",
    "Steam",
  ];

  const toggleSelection = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (formData: FormData) => {
    formData.append("id", crypto.randomUUID());
    formData.append("name", (formData.get("address") as string) || "New House Listing");
    formData.append("userId", "user-id-here"); // Replace with actual user ID
    formData.append("description", "House listing");
    formData.append("advertisementType", "Rent");
    formData.append("parkingSpace", "0");

    await createHouse(formData);
  };

  return (
    <section className="flex flex-col min-h-screen">
      <MaxWidthWrapper>
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary m-4 sm:m-6">
          Manage Products and Ads
        </h1>

        <div className="flex flex-col lg:flex-row bg-secondary min-h-[calc(100vh-120px)] p-2 sm:p-4 lg:p-6 space-y-4 lg:space-y-0 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/5 bg-secondary rounded-3xl shadow-md p-3 sm:p-4 border-2 border-primary lg:mr-4">
            <ul className="space-y-3 sm:space-y-4 text-primary font-semibold text-xs sm:text-sm md:text-base">
              <li className="flex items-center gap-2">
                <ShoppingCart size={16} className="sm:size-5" />
                Products
              </li>
              <li className="pl-2 sm:pl-4 flex items-center gap-2">
                <Plus size={16} className="sm:size-5" />
                Add Products
              </li>
              <li className="pl-2 sm:pl-4 flex items-center gap-2">
                <Pen size={16} className="sm:size-5" />
                Edit Products
              </li>
              <li className="flex items-center gap-2">
                <Tv size={16} className="sm:size-5" />
                Adverts
              </li>
              <Link href="/advertisment">
                <li className="pl-2 sm:pl-4 flex items-center gap-2">
                  <Plus size={16} className="sm:size-5" />
                  Add Adverts
                </li>
              </Link>
              <Link href="/Ad">
                <li className="pl-2 sm:pl-4 flex items-center gap-2">
                  <Pen size={16} className="sm:size-5" />
                  Edit Adverts
                </li>
              </Link>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white border-2 border-primary rounded-3xl shadow-md p-2 sm:p-4 lg:p-6 overflow-y-auto">
            <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6 pl-0 sm:pl-4 lg:pl-7">
              <Link href="/manage-product/car">
                <button className="flex items-center justify-center gap-2 bg-white text-primary px-3 py-2 sm:px-4 sm:py-2 border border-primary rounded-lg shadow-md w-full sm:w-auto hover:bg-secondary text-xs sm:text-sm md:text-base">
                  <Car size={16} className="sm:size-5" />
                  <span className="font-semibold">Car For Sale</span>
                </button>
              </Link>
              <Link href="#">
                <button className="flex items-center justify-center gap-2 bg-secondary text-primary px-3 py-2 sm:px-4 sm:py-2 border border-primary rounded-lg shadow-md w-full sm:w-auto text-xs sm:text-sm md:text-base">
                  <Home size={16} className="sm:size-5" />
                  <span className="font-semibold">House For Rent</span>
                </button>
              </Link>
            </div>

            {/* Form */}
            <form action={handleSubmit} className="h-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
                {/* Left Section */}
                <div className="lg:col-span-8 space-y-4 sm:space-y-6 bg-secondary p-4 sm:p-6 rounded-3xl shadow-md border-2 border-primary overflow-y-auto max-h-[70vh]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary">Bedroom</label>
                      <input
                        type="number"
                        name="bedroom"
                        className="w-full p-2 border-b-2 border-primary bg-secondary text-xs sm:text-sm md:text-base focus:outline-none"
                        placeholder="5"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button type="button" className="flex flex-col items-center gap-1 bg-white text-primary px-3 py-2 rounded-lg shadow-md w-full sm:w-auto">
                        <Home size={20} className="sm:size-6 lg:size-9" />
                        <span className="text-xs sm:text-sm font-semibold">House</span>
                      </button>
                      <button type="button" className="flex flex-col items-center gap-1 bg-secondary text-primary px-3 py-2 rounded-lg shadow-md border border-primary w-full sm:w-auto">
                        <Home size={20} className="sm:size-6 lg:size-9" />
                        <span className="text-xs sm:text-sm font-semibold">Apartment</span>
                      </button>
                      <button type="button" className="flex flex-col items-center gap-1 bg-secondary text-primary px-3 py-2 rounded-lg shadow-md border border-primary w-full sm:w-auto">
                        <PlayCircle size={20} className="sm:size-6 lg:size-9" />
                        <span className="text-xs sm:text-sm font-semibold">Guest House</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary">Size</label>
                      <input
                        type="text"
                        name="size"
                        className="w-full p-2 border-b-2 border-primary bg-secondary text-xs sm:text-sm md:text-base focus:outline-none"
                        placeholder="225 sq m"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary">Bathroom</label>
                      <input
                        type="number"
                        name="bathroom"
                        className="w-full p-2 border-b-2 border-primary bg-secondary text-xs sm:text-sm md:text-base focus:outline-none"
                        placeholder="3"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-primary mb-3">Essentials</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {essentials.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleSelection(item)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-md text-xs sm:text-sm font-semibold ${
                            selected.includes(item)
                              ? "bg-primary text-white border border-primary"
                              : "bg-secondary text-black border border-black"
                          }`}
                        >
                          {selected.includes(item) ? (
                            <CheckCircle size={12} className="sm:size-4" />
                          ) : (
                            <Circle size={12} className="sm:size-4" />
                          )}
                          <span>{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-6 border-2 border-primary p-4 sm:p-6 rounded-3xl shadow-md overflow-y-auto max-h-[70vh]">
                  <div className="h-24 sm:h-32 lg:h-40 flex flex-col items-center justify-center border-dashed border-2 border-primary rounded-lg flex-shrink-0">
                    <Upload size={24} className="text-primary sm:size-8 lg:size-10" />
                    <p className="mt-2 text-xs sm:text-sm text-primary">Upload media for the campaign</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary">Condition</label>
                      <input
                        type="text"
                        name="condition"
                        className="w-full p-2 border-b-2 border-primary text-xs sm:text-sm md:text-base focus:outline-none"
                        placeholder="Excellent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary">Maintenance</label>
                      <input
                        type="text"
                        name="maintenance"
                        className="w-full p-2 border-b-2 border-primary text-xs sm:text-sm md:text-base focus:outline-none"
                        placeholder="Frequent"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-primary mb-3">Currency</p>
                    <div className="flex flex-wrap gap-3">
                      {["ETB", "USD"].map((currencyOption) => (
                        <label
                          key={currencyOption}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs sm:text-sm font-semibold ${
                            currency === currencyOption
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-black border-black"
                          }`}
                        >
                          <input
                            type="radio"
                            name="currency"
                            value={currencyOption}
                            checked={currency === currencyOption}
                            onChange={() => setCurrency(currencyOption)}
                            className="hidden"
                          />
                          {currency === currencyOption ? (
                            <CheckCircle size={12} className="sm:size-4" />
                          ) : (
                            <Circle size={12} className="sm:size-4" />
                          )}
                          <span>{currencyOption}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-primary mb-3">Payment Terms</p>
                    <div className="flex flex-wrap gap-3">
                      {["Monthly", "Quarter", "Annual"].map((term) => (
                        <label
                          key={term}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs sm:text-sm font-semibold ${
                            paymentTerm === term
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-black border-black"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={term}
                            checked={paymentTerm === term}
                            onChange={() => setPaymentTerm(term)}
                            className="hidden"
                          />
                          {paymentTerm === term ? (
                            <CheckCircle size={12} className="sm:size-4" />
                          ) : (
                            <Circle size={12} className="sm:size-4" />
                          )}
                          <span>{term}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg shadow-md text-xs sm:text-sm md:text-base hover:bg-primary/90"
                  >
                    Save House
                  </button>
                </div>
              </div>
            </form>
          </main>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ManageHouse;
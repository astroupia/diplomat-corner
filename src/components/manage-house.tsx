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
import { useUser } from "@clerk/nextjs";
import { createHouse } from "@/lib/actions/house.actions"; // Import from house.actions.ts

interface HouseFormData {
  name: string;
  bedroom: number;
  size: number;
  bathroom: number;
  condition: string;
  maintenance: string;
  price: number;
  description: string;
  advertisementType: "Rent" | "Sale";
  paymentMethod: "Monthly" | "Quarterly" | "Annual";
  houseType: "House" | "Apartment" | "Guest House";
  essentials: string[];
  currency: string;
}

const ManageHouse: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState<HouseFormData>({
    name: "",
    bedroom: 0,
    size: 0,
    bathroom: 0,
    condition: "",
    maintenance: "",
    price: 0,
    description: "",
    advertisementType: "Rent",
    paymentMethod: "Monthly",
    houseType: "House",
    essentials: [],
    currency: "ETB",
  });
  const [isSending, setIsSending] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "bedroom" || name === "size" || name === "bathroom" || name === "price" ? Number(value) : value,
    }));
  };

  const handleOptionChange = (field: keyof HouseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSelection = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      essentials: prev.essentials.includes(item)
        ? prev.essentials.filter((i) => i !== item)
        : [...prev.essentials, item],
    }));
  };

  const handleSend = async () => {
    setIsSending(true);
    setSubmitResult(null);
    console.log("Form data being sent:", formData);

    if (
      !formData.name ||
      !formData.bedroom ||
      !formData.size ||
      !formData.bathroom ||
      !formData.price ||
      !formData.description
    ) {
      setSubmitResult({ success: false, message: "Please fill all required fields" });
      console.log("Validation failed: Missing required fields");
      setIsSending(false);
      return;
    }

    try {
      const result = await createHouse(formData);
      console.log("Server action result:", result);
      if (result.success) {
        setSubmitResult({ success: true, message: "House saved successfully!" });
        setFormData({
          name: "",
          bedroom: 0,
          size: 0,
          bathroom: 0,
          condition: "",
          maintenance: "",
          price: 0,
          description: "",
          advertisementType: "Rent",
          paymentMethod: "Monthly",
          houseType: "House",
          essentials: [],
          currency: "ETB",
        });
      } else {
        setSubmitResult({ success: false, message: result.error || "Failed to save house" });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setSubmitResult({
        success: false,
        message: `Failed to save house: ${errorMessage}`,
      });
      console.error("Error in handleSend:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <section className="flex flex-col min-h-screen">
      <MaxWidthWrapper>
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary m-4 sm:m-6">
          Manage Products and Ads
        </h1>
        <div className="flex flex-col lg:flex-row bg-secondary min-h-[calc(100vh-120px)] p-2 sm:p-4 lg:p-6 space-y-4 lg:space-y-0 lg:space-x-4">
          <aside className="w-full lg:w-1/5 bg-secondary rounded-3xl shadow-md p-3 sm:p-4 border-2 border-primary">
            <ul className="space-y-3 sm:space-y-4 text-primary font-semibold text-xs sm:text-sm md:text-base">
              <li className="flex flex-row items-center gap-2">
                <ShoppingCart size={16} className="sm:w-5 sm:h-5" />Products
              </li>
              <li className="pl-2 sm:pl-4 flex flex-row items-center gap-2">
                <Plus size={16} className="sm:w-5 sm:h-5" />Add Products
              </li>
              <li className="pl-2 sm:pl-4 flex flex-row items-center gap-2">
                <Pen size={16} className="sm:w-5 sm:h-5" />Edit Products
              </li>
              <li className="flex flex-row items-center gap-2">
                <Tv size={16} className="sm:w-5 sm:h-5" />Adverts
              </li>
              <Link href="/advertisment">
                <li className="pl-2 sm:pl-4 flex flex-row items-center gap-2">
                  <Plus size={16} className="sm:w-5 sm:h-5" />Add Adverts
                </li>
              </Link>
              <Link href="/Ad">
                <li className="pl-2 sm:pl-4 flex flex-row items-center gap-2">
                  <Pen size={16} className="sm:w-5 sm:h-5" />Edit Adverts
                </li>
              </Link>
            </ul>
          </aside>
          <main className="flex-1 bg-white border-2 border-primary rounded-3xl shadow-md p-2 sm:p-4 lg:p-6 flex flex-col">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6 pl-0 sm:pl-4 lg:pl-7">
              <Link href="/manage-product/car">
                <button className="flex items-center justify-center space-x-2 bg-white text-primary px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 border border-primary rounded-lg shadow-md w-full sm:w-auto hover:bg-secondary text-xs sm:text-sm md:text-base">
                  <Car size={16} className="sm:w-5 sm:h-5" />
                  <span className="font-semibold">Car For Sale</span>
                </button>
              </Link>
              <Link href="#">
                <button className="flex items-center justify-center space-x-2 bg-secondary text-primary px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg shadow-md border border-primary w-full sm:w-auto text-xs sm:text-sm md:text-base">
                  <Home size={16} className="sm:w-5 sm:h-5" />
                  <span className="font-semibold">House For Rent</span>
                </button>
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 rounded-3xl border-primary p-2 sm:p-4 lg:p-6 h-full">
              <div className="col-span-1 md:col-span-1 lg:col-span-8 space-y-3 sm:space-y-4 lg:space-y-6 bg-secondary p-2 sm:p-4 lg:p-6 rounded-3xl shadow-md border-2 border-primary overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-150px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm md:text-base"
                      placeholder="New House Listing"
                      required
                    />
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 sm:gap-3 lg:gap-4">
                    {["House", "Apartment", "Guest House"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleOptionChange("houseType", type)}
                        className={`flex flex-col items-center space-y-1 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-lg shadow-md w-full md:w-auto ${
                          formData.houseType === type ? "bg-primary text-white" : "bg-secondary text-primary border border-primary"
                        }`}
                      >
                        {type === "House" && <Home size={20} className="sm:w-6 sm:h-6 lg:w-9 lg:h-9" />}
                        {type === "Apartment" && <Home size={20} className="sm:w-6 sm:h-6 lg:w-9 lg:h-9" />}
                        {type === "Guest House" && <PlayCircle size={20} className="sm:w-6 sm:h-6 lg:w-9 lg:h-9" />}
                        <span className="text-xs sm:text-sm font-semibold">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary">Bedroom *</label>
                    <input
                      type="number"
                      name="bedroom"
                      value={formData.bedroom || ""}
                      onChange={handleInputChange}
                      className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm md:text-base"
                      placeholder="5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary">Size *</label>
                    <input
                      type="number"
                      name="size"
                      value={formData.size || ""}
                      onChange={handleInputChange}
                      className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm md:text-base"
                      placeholder="225"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary">Bathroom *</label>
                    <input
                      type="number"
                      name="bathroom"
                      value={formData.bathroom || ""}
                      onChange={handleInputChange}
                      className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm md:text-base"
                      placeholder="3"
                      required
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3 lg:mb-4">Essentials</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                    {essentials.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleSelection(item)}
                        className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full shadow-md text-xs sm:text-sm font-semibold ${
                          formData.essentials.includes(item)
                            ? "bg-primary text-white border border-primary"
                            : "bg-secondary text-black border border-black"
                        }`}
                      >
                        {formData.essentials.includes(item) ? (
                          <CheckCircle size={12} className="sm:w-4 sm:h-4" />
                        ) : (
                          <Circle size={12} className="sm:w-4 sm:h-4" />
                        )}
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-1 md:col-span-1 lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6 border-2 border-primary p-2 sm:p-4 lg:p-6 rounded-3xl shadow-md overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-150px)]">
                <div className="h-24 sm:h-32 lg:h-40 flex flex-col items-center justify-center border-dashed border-2 border-primary rounded-lg">
                  <Upload size={24} className="text-primary sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                  <p className="mt-1 sm:mt-2 lg:mt-4 text-xs sm:text-sm text-primary">Upload media for the campaign</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary">Condition</label>
                    <input
                      type="text"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base"
                      placeholder="Excellent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary">Maintenance</label>
                    <input
                      type="text"
                      name="maintenance"
                      value={formData.maintenance}
                      onChange={handleInputChange}
                      className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base"
                      placeholder="Frequent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleInputChange}
                    className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base"
                    placeholder="1000"
                    required
                  />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3 lg:mb-4">Currency</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
                    {["ETB", "USD"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full border text-xs sm:text-sm font-semibold ${
                          formData.currency === option
                            ? "bg-primary text-white border border-primary"
                            : "bg-white text-black border border-black"
                        }`}
                        onClick={() => handleOptionChange("currency", option)}
                      >
                        {formData.currency === option ? (
                          <CheckCircle size={12} className="sm:w-4 sm:h-4" />
                        ) : (
                          <Circle size={12} className="sm:w-4 sm:h-4" />
                        )}
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 lg:mt-4">
                  <p className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3">Payment Terms</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
                    {["Monthly", "Quarterly", "Annual"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full border text-xs sm:text-sm font-semibold ${
                          formData.paymentMethod === option
                            ? "bg-primary text-white border border-primary"
                            : "bg-white text-black border border-black"
                        }`}
                        onClick={() => handleOptionChange("paymentMethod", option)}
                      >
                        {formData.paymentMethod === option ? (
                          <CheckCircle size={12} className="sm:w-4 sm:h-4" />
                        ) : (
                          <Circle size={12} className="sm:w-4 sm:h-4" />
                        )}
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base"
                    placeholder="House description"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending}
                  className={`w-full py-3 rounded-lg font-semibold text-white ${
                    isSending ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
                  }`}
                >
                  {isSending ? "Creating..." : "Created"}
                </button>
                {submitResult && (
                  <p
                    className={`text-sm mt-2 ${submitResult.success ? "text-green-600" : "text-red-600"}`}
                  >
                    {submitResult.message}
                  </p>
                )}
              </div>
            </div>
          </main>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ManageHouse;
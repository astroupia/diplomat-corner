"use client";

import {
  Car,
  CheckCircle,
  Circle,
  Home,
  Pen,
  PlayCircle,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import { useUser } from "@clerk/nextjs";
import { createHouse, HouseData } from "@/lib/actions/house.actions";
import { createCar } from "@/lib/actions/car.action";
import { ICar } from "@/lib/models/car.model";

const ManageProduct: React.FC = () => {
  const { user, isLoaded } = useUser();
  const userId = user?.id || "guest";
  const [productType, setProductType] = useState<"Car" | "House">("Car");
  const [houseData, setHouseData] = useState<HouseData>({
    name: "",
    userId: userId || "guest",
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
  const [carData, setCarData] = useState<Partial<ICar>>({
    name: "",
    userId,
    description: "",
    advertisementType: "Sale",
    price: 0,
    paymentMethod: 1,
    mileage: 0,
    speed: 0,
    milesPerGallon: 0,
    timestamp: new Date().toISOString(),
    year: 0,
    transmission: "Automatic",
    fuel: "Gasoline",
    bodyType: "Truck",
    condition: "",
    engine: "",
    maintenance: "",
    currency: "ETB",
    tags: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isLoaded) {
      setCarData((prev) => ({ ...prev, userId }));
    }
  }, [userId, isLoaded]);

  // House handlers
  const handleHouseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHouseData((prev) => ({
      ...prev,
      [name]: ["bedroom", "size", "bathroom", "price"].includes(name) ? Number(value) : value,
    }));
  };

  const handleHouseOptionChange = (field: keyof HouseData, value: string) => {
    setHouseData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleHouseEssential = (item: string) => {
    setHouseData((prev) => ({
      ...prev,
      essentials: prev.essentials.includes(item)
        ? prev.essentials.filter((i) => i !== item)
        : [...prev.essentials, item],
    }));
  };

  // Car handlers
  const handleCarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]: ["year", "mileage", "price"].includes(name) ? Number(value) : value,
    }));
  };

  const handleCarOptionChange = (field: string, value: string) => {
    setCarData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "currency" && { paymentMethod: value === "ETB" ? 1 : 2 }),
    }));
  };

  const handleSend = async () => {
    setIsSending(true);
    setSubmitResult(null);

    if (productType === "House") {
      if (
        !houseData.name ||
        !houseData.bedroom ||
        !houseData.size ||
        !houseData.bathroom ||
        !houseData.price ||
        !houseData.description
      ) {
        setSubmitResult({ success: false, message: "Please fill all required fields" });
        setIsSending(false);
        return;
      }

      const result = await createHouse({ ...houseData, userId });
      if (result.success) {
        setSubmitResult({ success: true, message: "House saved successfully!" });
        setHouseData({
          name: "",
          userId: "",
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
    } else {
      if (!carData.name || !carData.price || !carData.mileage) {
        setSubmitResult({ success: false, message: "Please fill all required fields (Name, Price, Mileage)" });
        setIsSending(false);
        return;
      }

      const result = await createCar(carData);
      if (result.success) {
        setSubmitResult({ success: true, message: "Car saved successfully!" });
        setCarData({
          name: "",
          userId,
          description: "",
          advertisementType: "Sale",
          price: 0,
          paymentMethod: 1,
          mileage: 0,
          speed: 0,
          milesPerGallon: 0,
          timestamp: new Date().toISOString(),
          year: 0,
          transmission: "Automatic",
          fuel: "Gasoline",
          bodyType: "Truck",
          condition: "",
          engine: "",
          maintenance: "",
          currency: "ETB",
          tags: "",
        });
      } else {
        setSubmitResult({ success: false, message: "Failed to save car" });
      }
    }
    setIsSending(false);
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

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

  return (
    <section className="flex flex-col min-h-screen">
      <MaxWidthWrapper>
        <div className="min-h-[calc(100vh-60px)] p-2 sm:p-4 lg:p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary self-center pl-7">
              Manage Products and Ads
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4 pr-8">
              <button
                onClick={() => setProductType("Car")}
                className={`flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 border border-primary rounded-lg shadow-md hover:bg-secondary text-xs sm:text-sm md:text-base ${
                  productType === "Car" ? "bg-secondary text-primary" : "bg-white text-primary"
                }`}
              >
                <Car size={16} className="sm:w-5 sm:h-5" />
                <span className="font-semibold">Car For Sale</span>
              </button>
              <button
                onClick={() => setProductType("House")}
                className={`flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 border border-primary rounded-lg shadow-md hover:bg-secondary text-xs sm:text-sm md:text-base ${
                  productType === "House" ? "bg-secondary text-primary" : "bg-white text-primary"
                }`}
              >
                <Home size={16} className="sm:w-5 sm:h-5" />
                <span className="font-semibold">House For Rent</span>
              </button>
              <Link
                href="/edit-product"
                className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 border border-primary rounded-lg shadow-md hover:bg-secondary text-xs sm:text-sm md:text-base bg-white text-primary"
              >
                <Pen size={16} className="sm:w-5 sm:h-5 " />
                <span className="font-semibold">Edit Product</span>
              </Link>
            </div>
          </div>

          <main>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 rounded-3xl border-primary p-2 sm:p-4 lg:p-6">
              {productType === "House" ? (
                <>
                  {/* House Middle Section */}
                  <div className="md:col-span-1 space-y-2 sm:space-y-3 lg:space-y-4 bg-secondary p-2 sm:p-4 lg:p-6 rounded-3xl shadow-md border-2 border-primary">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={houseData.name}
                          onChange={handleHouseInputChange}
                          className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm md:text-base"
                          placeholder="New House Listing"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        {["House", "Apartment", "Guest House"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleHouseOptionChange("houseType", type)}
                            className={`flex flex-col items-center justify-center space-y-1 px-4 py-2 rounded-lg shadow-md w-1/3 ${
                              houseData.houseType === type ? "bg-primary text-white" : "bg-secondary text-primary border border-primary"
                            }`}
                          >
                            {type === "House" && <Home size={20} className="sm:w-6 sm:h-6" />}
                            {type === "Apartment" && <Home size={20} className="sm:w-6 sm:h-6" />}
                            {type === "Guest House" && <PlayCircle size={20} className="sm:w-6 sm:h-6" />}
                            <span className="text-xs sm:text-sm font-semibold">{type}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Bedroom *</label>
                        <input
                          type="number"
                          name="bedroom"
                          value={houseData.bedroom || ""}
                          onChange={handleHouseInputChange}
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
                          value={houseData.size || ""}
                          onChange={handleHouseInputChange}
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
                          value={houseData.bathroom || ""}
                          onChange={handleHouseInputChange}
                          className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm md:text-base"
                          placeholder="3"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-primary mb-1 sm:mb-2 lg:mb-3">Essentials</p>
                      <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-3">
                        {essentials.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleHouseEssential(item)}
                            className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full shadow-md text-xs sm:text-sm font-semibold ${
                              houseData.essentials.includes(item)
                                ? "bg-primary text-white border border-primary"
                                : "bg-secondary text-black border border-black"
                            }`}
                          >
                            {houseData.essentials.includes(item) ? (
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
                  {/* House Right Section */}
                  <div className="md:col-span-1 space-y-3 sm:space-y-4 lg:space-y-6 border-2 border-primary p-2 sm:p-4 lg:p-6 rounded-3xl shadow-md">
                    <div className="h-24 sm:h-32 lg:h-40 flex flex-col items-center justify-center border-dashed border-2 border-primary rounded-lg">
                      <Upload size={24} className="text-primary sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                      <p className="mt-1 sm:mt-2 lg:mt-4 text-xs sm:text-sm text-primary">Upload media for the campaign</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Condition</label>
                        <input
                          type="text"
                          name="condition"
                          value={houseData.condition}
                          onChange={handleHouseInputChange}
                          className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base"
                          placeholder="Excellent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Maintenance</label>
                        <input
                          type="text"
                          name="maintenance"
                          value={houseData.maintenance}
                          onChange={handleHouseInputChange}
                          className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base"
                          placeholder="Frequent"
                        />
                      </div>
                    </div>
                    <div className="flex items-end gap-3 sm:gap-4">
                      <div className="flex-1">
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Price *</label>
                        <input
                          type="number"
                          name="price"
                          value={houseData.price || ""}
                          onChange={handleHouseInputChange}
                          className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base"
                          placeholder="1000"
                          required
                        />
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        {["ETB", "USD"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full border text-xs sm:text-sm font-semibold ${
                              houseData.currency === option
                                ? "bg-primary text-white border border-primary"
                                : "bg-white text-black border border-black"
                            }`}
                            onClick={() => handleHouseOptionChange("currency", option)}
                          >
                            {houseData.currency === option ? (
                              <CheckCircle size={12} className="sm:w-4 sm:h-4" />
                            ) : (
                              <Circle size={12} className="sm:w-4 sm:h-4" />
                            )}
                            <span>{item}</span>
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
                              houseData.paymentMethod === option
                                ? "bg-primary text-white border border-primary"
                                : "bg-white text-black border border-black"
                            }`}
                            onClick={() => handleHouseOptionChange("paymentMethod", option)}
                          >
                            {houseData.paymentMethod === option ? (
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
                        value={houseData.description}
                        onChange={handleHouseInputChange}
                        className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base leading-tight"
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
                      <p className={`text-sm mt-2 ${submitResult.success ? "text-green-600" : "text-red-600"}`}>
                        {submitResult.message}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Car Middle Section */}
                  <div className="md:col-span-1 space-y-2 sm:space-y-3 lg:space-y-4 bg-secondary p-2 sm:p-4 lg:p-6 rounded-3xl shadow-md border-2 border-primary">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={carData.name}
                          onChange={handleCarInputChange}
                          className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm"
                          placeholder="Ford F150"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Year</label>
                        <input
                          type="number"
                          name="year"
                          value={carData.year || ""}
                          onChange={handleCarInputChange}
                          className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm"
                          placeholder="2022"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Mileage *</label>
                        <input
                          type="number"
                          name="mileage"
                          value={carData.mileage || ""}
                          onChange={handleCarInputChange}
                          className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm"
                          placeholder="132"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Transmission</label>
                        <div className="flex flex-wrap space-x-2">
                          {["Automatic", "Manual"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              className={`flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                                carData.transmission === option
                                  ? "bg-primary text-white border border-primary"
                                  : "bg-secondary text-black border border-black"
                              }`}
                              onClick={() => handleCarOptionChange("transmission", option)}
                            >
                              {carData.transmission === option ? <CheckCircle size={12} /> : <Circle size={12} />}
                              <span>{option}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary">Fuel</label>
                      <div className="flex flex-wrap space-x-2">
                        {["Gasoline", "Diesel", "Electric"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                              carData.fuel === option
                                ? "bg-primary text-white border border-primary"
                                : "bg-secondary text-black border border-black"
                            }`}
                            onClick={() => handleCarOptionChange("fuel", option)}
                          >
                            {carData.fuel === option ? <CheckCircle size={12} /> : <Circle size={12} />}
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary">Body Type</label>
                      <div className="flex flex-wrap space-x-2">
                        {["Truck", "SUV", "Sedan", "Hatchback", "Minivan"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                              carData.bodyType === option
                                ? "bg-primary text-white border border-primary"
                                : "bg-secondary text-black border border-black"
                            }`}
                            onClick={() => handleCarOptionChange("bodyType", option)}
                          >
                            {carData.bodyType === option ? <CheckCircle size={12} /> : <Circle size={12} />}
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Car Right Section */}
                  <div className="md:col-span-1 space-y-3 sm:space-y-4 lg:space-y-6 border-2 border-primary p-2 sm:p-4 lg:p-6 rounded-3xl shadow-md">
                    <div className="h-24 sm:h-32 lg:h-40 flex flex-col items-center justify-center border-dashed border-2 border-primary rounded-lg">
                      <Upload size={24} className="text-primary sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                      <p className="mt-1 sm:mt-2 lg:mt-4 text-xs sm:text-sm text-primary">Upload media for the campaign</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Condition</label>
                        <input
                          type="text"
                          name="condition"
                          value={carData.condition || ""}
                          onChange={handleCarInputChange}
                          className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white text-xs sm:text-sm"
                          placeholder="Excellent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Engine</label>
                        <input
                          type="text"
                          name="engine"
                          value={carData.engine || ""}
                          onChange={handleCarInputChange}
                          className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white text-xs sm:text-sm"
                          placeholder="3.8L V6"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Maintenance</label>
                        <input
                          type="text"
                          name="maintenance"
                          value={carData.maintenance || ""}
                          onChange={handleCarInputChange}
                          className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white text-xs sm:text-sm"
                          placeholder="Frequent"
                        />
                      </div>
                    </div>
                    <div className="flex items-end gap-3 sm:gap-4">
                      <div className="flex-1">
                        <label className="block text-xs sm:text-sm font-semibold text-primary">Price *</label>
                        <input
                          type="number"
                          name="price"
                          value={carData.price || ""}
                          onChange={handleCarInputChange}
                          className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white text-xs sm:text-sm"
                          placeholder="Price"
                          required
                        />
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        {(["ETB", "USD"] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                              carData.currency === option
                                ? "bg-primary text-white border border-primary"
                                : "bg-white text-black border border-black"
                            }`}
                            onClick={() => handleCarOptionChange("currency", option)}
                          >
                            {carData.currency === option ? <CheckCircle size={12} /> : <Circle size={12} />}
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary">Tags</label>
                      <input
                        type="text"
                        name="tags"
                        value={carData.tags || ""}
                        onChange={handleCarInputChange}
                        className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white text-xs sm:text-sm"
                        placeholder="#Ford #F150 #2022"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary">Brief Description</label>
                      <textarea
                        name="description"
                        value={carData.description || ""}
                        onChange={handleCarInputChange}
                        className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm leading-tight"
                        placeholder="Write your message here..."
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
                      {isSending ? "Sending..." : "Send"}
                    </button>
                    {submitResult && (
                      <p className={`text-sm mt-2 ${submitResult.success ? "text-green-600" : "text-red-600"}`}>
                        {submitResult.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ManageProduct;
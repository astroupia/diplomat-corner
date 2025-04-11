"use client";

import {
  Car,
  CheckCircle,
  Circle,
  Home,
  Pen,
  Plus,
  ShoppingCart,
  Tv,
  Upload,
} from "lucide-react";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { useState, useEffect } from "react";
import { createCar } from "@/lib/actions/car.action";
import { useUser } from "@clerk/nextjs";
import { ICar } from "@/lib/models/car.model";

const ManageCar = () => {
  const { user, isLoaded } = useUser();
  const userId = user?.id || "guest";

  const [carData, setCarData] = useState<Partial<ICar>>({
    name: "",
    userId: userId,
    description: "",
    advertisementType: "Sale" as const,
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
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isLoaded) {
      setCarData((prev) => ({ ...prev, userId }));
    }
  }, [userId, isLoaded]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "mileage" || name === "price"
          ? Number(value)
          : value,
    }));
  };

  const handleOptionChange = (field: string, value: string) => {
    setCarData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "currency" && { paymentMethod: value === "ETB" ? 1 : 2 }),
    }));
  };

  const handleSend = async () => {
    setIsSending(true);
    setSubmitResult(null);

    if (!carData.name || !carData.price || !carData.mileage) {
      setSubmitResult({
        success: false,
        message: "Please fill all required fields (Name, Price, Mileage)",
      });
      setIsSending(false);
      return;
    }

    try {
      const result = await createCar(carData);
      if (result.success) {
        setSubmitResult({ success: true, message: "Car saved successfully!" });
        setCarData({
          name: "",
          userId: userId, // Reset with current userId
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
    } catch (error) {
      setSubmitResult({
        success: false,
        message: `Failed to save car: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsSending(false);
    }
  };

  // If Clerk is still loading the user, show a loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col min-h-screen text-Lato">
      <MaxWidthWrapper>
        <h1 className="text-xl md:text-2xl font-semibold text-primary m-6">
          Manage Products and Ads
        </h1>
        <div className="flex flex-col lg:flex-row bg-secondary h-auto lg:h-screen bg-primary-light p-4 lg:p-6 space-y-4 lg:space-y-0 lg:space-x-4">
          <aside className="w-full lg:w-1/5 bg-secondary rounded-3xl shadow-md p-4 border-2 border-primary">
            <ul className="space-y-4 text-primary font-semibold text-sm md:text-base">
              <Link href="/advertisement">
                <li className="flex items-center">
                  <ShoppingCart size={20} className="mr-2" />
                  Products
                </li>
              </Link>
              <li className="pl-4 flex items-center">
                <Plus size={16} className="mr-2" />
                Add Products
              </li>
              <li className="pl-4 flex items-center">
                <Pen size={16} className="mr-2" />
                Edit Products
              </li>
              <li className="flex items-center">
                <Tv size={20} className="mr-2" />
                Adverts
              </li>
              <Link href="/advertisement">
                <li className="pl-4 flex items-center">
                  <Plus size={16} className="mr-2" />
                  Add Adverts
                </li>
              </Link>
              <li className="pl-4 flex items-center">
                <Pen size={16} className="mr-2" />
                Edit Adverts
              </li>
            </ul>
          </aside>
          <main className="flex-1 bg-white border-2 border-primary rounded-3xl shadow-md p-4 lg:p-6 flex flex-col">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <Link href="/CarProduct">
                <button className="flex items-center justify-center space-x-2 bg-secondary text-primary border border-primary px-6 py-3 rounded-lg shadow-md w-full sm:w-auto">
                  <Car size={20} />
                  <span className="font-semibold">Car For Sale</span>
                </button>
              </Link>
              <Link href="/manage-product/house">
                <button className="flex items-center justify-center space-x-2 bg-white text-primary px-6 py-3 rounded-lg shadow-md border border-primary w-full sm:w-auto">
                  <Home size={20} />
                  <span className="font-semibold">House For Rent</span>
                </button>
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl p-4 lg:p-6">
              <div className="col-span-12 lg:col-span-8 space-y-6 bg-secondary p-4 lg:p-6 rounded-3xl shadow-md border-3 border-primary">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={carData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary"
                      placeholder="Ford F150"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={carData.year || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary"
                      placeholder="2022"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary">
                      Mileage *
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      value={carData.mileage || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary"
                      placeholder="132"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary">
                      Transmission
                    </label>
                    <div className="flex flex-wrap space-x-2">
                      {["Automatic", "Manual"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                            carData.transmission === option
                              ? "bg-primary text-white border border-primary"
                              : "bg-secondary text-black border border-black"
                          }`}
                          onClick={() =>
                            handleOptionChange("transmission", option)
                          }
                        >
                          {carData.transmission === option ? (
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
                  <label className="block text-sm font-semibold text-primary">
                    Fuel
                  </label>
                  <div className="flex flex-wrap space-x-2">
                    {["Gasoline", "Diesel", "Electric"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          carData.fuel === option
                            ? "bg-primary text-white border border-primary"
                            : "bg-secondary text-black border border-black"
                        }`}
                        onClick={() => handleOptionChange("fuel", option)}
                      >
                        {carData.fuel === option ? (
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
                  <label className="block text-sm font-semibold text-primary">
                    Body Type
                  </label>
                  <div className="flex flex-wrap space-x-2">
                    {["Truck", "SUV", "Sedan", "Hatchback", "Minivan"].map(
                      (option) => (
                        <button
                          key={option}
                          type="button"
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                            carData.bodyType === option
                              ? "bg-primary text-white border border-primary"
                              : "bg-secondary text-black border border-black"
                          }`}
                          onClick={() => handleOptionChange("bodyType", option)}
                        >
                          {carData.bodyType === option ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Circle size={16} />
                          )}
                          <span>{option}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 space-y-6 border-2 border-primary p-4 lg:p-6 rounded-3xl shadow-md overflow-y-auto max-h-[calc(100vh-200px)]">
                <div className="h-40 flex flex-col items-center justify-center border-dashed border-2 border-primary rounded-lg">
                  <Upload size={40} className="text-primary" />
                  <p className="mt-4 text-sm text-primary">
                    Upload media for the campaign
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary">
                      Condition
                    </label>
                    <input
                      type="text"
                      name="condition"
                      value={carData.condition || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white"
                      placeholder="Excellent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary">
                      Engine
                    </label>
                    <input
                      type="text"
                      name="engine"
                      value={carData.engine || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white"
                      placeholder="3.8L V6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary">
                      Maintenance
                    </label>
                    <input
                      type="text"
                      name="maintenance"
                      value={carData.maintenance || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white"
                      placeholder="Frequent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-semibold text-primary">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={carData.price || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white"
                      placeholder="Price"
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    {(["ETB", "USD"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          carData.currency === option
                            ? "bg-primary text-white border border-primary"
                            : "bg-white text-black border border-black"
                        }`}
                        onClick={() => handleOptionChange("currency", option)}
                      >
                        {carData.currency === option ? (
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
                  <label className="block text-sm font-semibold text-primary">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={carData.tags || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white"
                    placeholder="#Ford #F150 #2022"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary">
                    Brief Description
                  </label>
                  <textarea
                    name="description"
                    value={carData.description || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white"
                    placeholder="Write your message here..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending}
                  className={`w-full py-3 rounded-lg font-semibold text-white ${
                    isSending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-dark"
                  }`}
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
                {submitResult && (
                  <p
                    className={`text-sm mt-2 ${
                      submitResult.success ? "text-green-600" : "text-red-600"
                    }`}
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

export default ManageCar;

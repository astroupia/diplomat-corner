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
import { useRef, useState } from "react";
import MaxWidthWrapper from "./max-width-wrapper";

const ManageHouse: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [paymentTerm, setPaymentTerm] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [houseType, setHouseType] = useState<"House" | "Apartment" | "Guest House">("House");
  const [buttonText, setButtonText] = useState<string>("Create");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [houseData, setHouseData] = useState({
    bedroom: 0,
    size: 0,
    bathroom: 0,
    condition: "",
    maintenance: "",
    price: 0,
    description: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setHouseData((prev) => ({
      ...prev,
      [name]: ["bedroom", "size", "bathroom", "price"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setButtonText("Creating...");
    console.log("House submitted");

    // Validation
    if (
      !houseData.bedroom ||
      !houseData.size ||
      !houseData.bathroom ||
      !houseData.price ||
      !houseData.description
    ) {
      setButtonText("Create");
      setIsSubmitting(false);
      console.log("Validation failed: Missing required fields");
      return;
    }

    const submitData: {
      name: string;
      bedroom: number;
      size: number;
      bathroom: number;
      condition: string;
      maintenance: string;
      price: number;
      description: string;
      advertisementType: string;
      paymentMethod: string;
      houseType: "House" | "Apartment" | "Guest House";
      essentials: string[];
      currency: string;
      userId?: string;
    } = {
      name: `New ${houseType} Listing`,
      bedroom: houseData.bedroom,
      size: houseData.size,
      bathroom: houseData.bathroom,
      condition: houseData.condition,
      maintenance: houseData.maintenance,
      price: houseData.price,
      description: houseData.description,
      advertisementType: "Rent",
      paymentMethod: paymentTerm || "Monthly",
      houseType,
      essentials: selected,
      currency: currency || "ETB",
    };

    const user = await auth();
    if (!user) return null;

    try {
      if (user.userId) {
        submitData["userId"] = user.userId;
      } else {
        throw new Error("User ID is null or undefined");
      }

      const response = await fetch("/api/house", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      console.log("createHouse result:", response);
      if (response.ok) {
        setButtonText("Created");
        setTimeout(() => {
          setButtonText("Create");
          setSelected([]);
          setPaymentTerm("");
          setCurrency("");
          setHouseType("House");
          setHouseData({
            bedroom: 0,
            size: 0,
            bathroom: 0,
            condition: "",
            maintenance: "",
            price: 0,
            description: "",
          });
          if (formRef.current) {
            formRef.current.reset();
          }
        }, 2000);
      } else {
        setButtonText("Not created");
        const contentType = response.headers.get("Content-Type");
        const errorText = contentType?.includes("application/json")
          ? (await response.json()).error
          : await response.text();
        throw new Error(errorText || "Unknown error");
      }
    } catch (error) {
      setButtonText("Not Sent");
      console.error("Submission error:", error);
      setTimeout(() => setButtonText("Create"), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col min-h-screen">
      <MaxWidthWrapper>
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary m-4 sm:m-6">
          Manage Products and Ads
        </h1>
        <div className="flex flex-col lg:flex-row bg-secondary min-h-[calc(100vh-120px)] p-2 sm:p-4 lg:p-6 space-y-4 lg:space-y-0 lg:space-x-4">
          <aside className="w-full lg:w-1/5 bg-secondary rounded-3xl shadow-md p-3 sm:p-4 border-2 border-primary">
            <ul className="space-y-3 sm:space-y-4 text-primary font-semibold text-xs sm:text-sm md:text-base">
              <li className="flex flex-row items-center gap-2"><ShoppingCart size={16} className="sm:w-5 sm:h-5" />Products</li>
              <li className="pl-2 sm:pl-4 flex flex-row items-center gap-2"><Plus size={16} className="sm:w-5 sm:h-5" />Add Products</li>
              <li className="pl-2 sm:pl-4 flex flex-row items-center gap-2"><Pen size={16} className="sm:w-5 sm:h-5" />Edit Products</li>
              <li className="flex flex-row items-center gap-2"><Tv size={16} className="sm:w-5 sm:h-5" />Adverts</li>
              <Link href="/advertisment"><li className="pl-2 sm:pl-4 flex flex-row items-center gap-2"><Plus size={16} className="sm:w-5 sm:h-5" />Add Adverts</li></Link>
              <Link href="/Ad"><li className="pl-2 sm:pl-4 flex flex-row items-center gap-2"><Pen size={16} className="sm:w-5 sm:h-5" />Edit Adverts</li></Link>
            </ul>
          </aside>
          <main className="flex-1 bg-white border-2 border-primary rounded-3xl shadow-md p-2 sm:p-4 lg:p-6 flex flex-col">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6 pl-0 sm:pl-4 lg:pl-7">
              <Link href="/manage-product/car"><button className="flex items-center justify-center space-x-2 bg-white text-primary px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 border border-primary rounded-lg shadow-md w-full sm:w-auto hover:bg-secondary text-xs sm:text-sm md:text-base"><Car size={16} className="sm:w-5 sm:h-5" /><span className="font-semibold">Car For Sale</span></button></Link>
              <Link href="#"><button className="flex items-center justify-center space-x-2 bg-secondary text-primary px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg shadow-md border border-primary w-full sm:w-auto text-xs sm:text-sm md:text-base"><Home size={16} className="sm:w-5 sm:h-5" /><span className="font-semibold">House For Rent</span></button></Link>
            </div>
            <form ref={formRef} onSubmit={handleSubmit} className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 rounded-3xl border-primary p-2 sm:p-4 lg:p-6 h-full">
                <div className="col-span-1 md:col-span-1 lg:col-span-8 space-y-3 sm:space-y-4 lg:space-y-6 bg-secondary p-2 sm:p-4 lg:p-6 rounded-3xl shadow-md border-2 border-primary overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-150px)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div><label className="block text-xs sm:text-sm font-semibold text-primary">Bedroom</label><input type="number" name="bedroom" className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm md:text-base" placeholder="5" required /></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 sm:gap-3 lg:gap-4">
                      {["House", "Apartment", "Guest House"].map((type) => (
                        <button key={type} type="button" onClick={() => setHouseType(type as "House" | "Apartment" | "Guest House")} className={`flex flex-col items-center space-y-1 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-lg shadow-md w-full md:w-auto ${houseType === type ? "bg-primary text-white" : "bg-secondary text-primary border border-primary"}`}>
                          {type === "House" && <Home size={20} className="sm:w-6 sm:h-6 lg:w-9 lg:h-9" />}
                          {type === "Apartment" && <Home size={20} className="sm:w-6 sm:h-6 lg:w-9 lg:h-9" />}
                          {type === "Guest House" && <PlayCircle size={20} className="sm:w-6 sm:h-6 lg:w-9 lg:h-9" />}
                          <span className="text-xs sm:text-sm font-semibold">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div><label className="block text-xs sm:text-sm font-semibold text-primary">Size</label><input type="number" name="size" className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm md:text-base" placeholder="225" required /></div>
                    <div><label className="block text-xs sm:text-sm font-semibold text-primary">Bathroom</label><input type="number" name="bathroom" className="w-full p-1 sm:p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary text-xs sm:text-sm md:text-base" placeholder="3" required /></div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3 lg:mb-4">Essentials</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                      {essentials.map((item) => (
                        <button key={item} type="button" onClick={() => toggleSelection(item)} className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full shadow-md text-xs sm:text-sm font-semibold ${selected.includes(item) ? "bg-primary text-white border border-primary" : "bg-secondary text-black border border-black"}`}>
                          {selected.includes(item) ? <CheckCircle size={12} className="sm:w-4 sm:h-4" /> : <Circle size={12} className="sm:w-4 sm:h-4" />}
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
                    <div><label className="block text-xs sm:text-sm font-semibold text-primary">Condition</label><input type="text" name="condition" className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base" placeholder="Excellent" /></div>
                    <div><label className="block text-xs sm:text-sm font-semibold text-primary">Maintenance</label><input type="text" name="maintenance" className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base" placeholder="Frequent" /></div>
                  </div>
                  <div><label className="block text-xs sm:text-sm font-semibold text-primary">Price</label><input type="number" name="price" className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base" placeholder="1000" required /></div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3 lg:mb-4">Currency</p>
                    <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
                      {["ETB", "USD"].map((currencyOption) => (
                        <label key={currencyOption} className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full border text-xs sm:text-sm font-semibold ${currency === currencyOption ? "bg-primary text-white border border-primary" : "bg-white text-black border border-black"}`}>
                          <input type="radio" name="currency" value={currencyOption} checked={currency === currencyOption} onChange={() => setCurrency(currencyOption)} className="hidden" />
                          {currency === currencyOption ? <CheckCircle size={12} className="sm:w-4 sm:h-4" /> : <Circle size={12} className="sm:w-4 sm:h-4" />}
                          <span>{currencyOption}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 lg:mt-4">
                    <p className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3">Payment Terms</p>
                    <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
                      {["Monthly", "Quarterly", "Annual"].map((term) => (
                        <label key={term} className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full border text-xs sm:text-sm font-semibold ${paymentTerm === term ? "bg-primary text-white border border-primary" : "bg-white text-black border border-black"}`}>
                          <input type="radio" name="paymentMethod" value={term} checked={paymentTerm === term} onChange={() => setPaymentTerm(term)} className="hidden" />
                          {paymentTerm === term ? <CheckCircle size={12} className="sm:w-4 sm:h-4" /> : <Circle size={12} className="sm:w-4 sm:h-4" />}
                          <span>{term}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div><label className="block text-xs sm:text-sm font-semibold text-primary">Description</label><textarea name="description" className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1 sm:p-2 text-xs sm:text-sm md:text-base" placeholder="House description" required /></div>
                  <button type="submit" disabled={isSubmitting} className={`w-full bg-primary text-white px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg shadow-md text-xs sm:text-sm md:text-base ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {buttonText}
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
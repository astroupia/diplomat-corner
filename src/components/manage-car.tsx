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
import { useState, useEffect, useRef } from "react";
import { createCar } from "@/lib/actions/car.action";
import { useUser } from "@clerk/nextjs";
import { ICar } from "@/lib/models/car.model";

interface CarFormData {
  name: string;
  year: number;
  mileage: number;
  speed: number;
  milesPerGallon: number;
  transmission: string;
  fuel: string;
  bodyType: string;
  condition: string;
  engine: string;
  maintenance: string;
  price: number;
  servicePrice: number;
  description: string;
  advertisementType: "Rent" | "Sale";
  paymentMethod: number;
  currency: string;
  tags: string;
}

interface ManageCarProps {
  initialData?: ICar;
  isEditMode?: boolean;
}

const ManageCar: React.FC<ManageCarProps> = ({
  initialData,
  isEditMode = false,
}) => {
  const { user, isLoaded } = useUser();
  const userId = user?.id || "guest";

  const [formData, setFormData] = useState<CarFormData>({
    name: initialData?.name || "",
    year: initialData?.year || 0,
    mileage: initialData?.mileage || 0,
    speed: initialData?.speed || 0,
    milesPerGallon: initialData?.milesPerGallon || 0,
    transmission: initialData?.transmission || "Automatic",
    fuel: initialData?.fuel || "Gasoline",
    bodyType: initialData?.bodyType || "Truck",
    condition: initialData?.condition || "",
    engine: initialData?.engine || "",
    maintenance: initialData?.maintenance || "",
    price: initialData?.price || 0,
    servicePrice: 0,
    description: initialData?.description || "",
    advertisementType:
      (initialData?.advertisementType as "Rent" | "Sale") || "Sale",
    paymentMethod: initialData?.paymentMethod || 1,
    currency: initialData?.currency || "ETB",
    tags: initialData?.tags || "",
  });
  const [isSending, setIsSending] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded) {
      setFormData((prev) => ({ ...prev, userId }));
    }
  }, [userId, isLoaded]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" ||
        name === "mileage" ||
        name === "price" ||
        name === "servicePrice"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedReceipt(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionChange = (field: keyof CarFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSend = async () => {
    setIsSending(true);
    setSubmitResult(null);

    if (!formData.name || !formData.price || !formData.mileage) {
      setSubmitResult({
        success: false,
        message: "Please fill all required fields",
      });
      setIsSending(false);
      return;
    }

    try {
      const apiFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        apiFormData.append(key, value.toString());
      });

      if (selectedFile) {
        apiFormData.append("file", selectedFile);
      }

      if (selectedReceipt) {
        apiFormData.append("receipt", selectedReceipt);
      }

      const endpoint = isEditMode
        ? `/api/cars/${initialData?._id}`
        : "/api/cars";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: apiFormData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitResult({
          success: true,
          message: isEditMode
            ? "Car updated successfully!"
            : "Car saved successfully!",
        });

        if (!isEditMode) {
          setFormData({
            name: "",
            year: 0,
            mileage: 0,
            speed: 0,
            milesPerGallon: 0,
            transmission: "Automatic",
            fuel: "Gasoline",
            bodyType: "Truck",
            condition: "",
            engine: "",
            maintenance: "",
            price: 0,
            servicePrice: 0,
            description: "",
            advertisementType: "Sale",
            paymentMethod: 1,
            currency: "ETB",
            tags: "",
          });
          setSelectedFile(null);
          setSelectedReceipt(null);
          setImagePreview(null);
          setReceiptPreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          if (receiptInputRef.current) {
            receiptInputRef.current.value = "";
          }
        }
      } else {
        setSubmitResult({
          success: false,
          message: result.error || "Failed to save car",
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: `Failed to save car: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
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
                      value={formData.name}
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
                      value={formData.year || ""}
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
                      value={formData.mileage || ""}
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
                            formData.transmission === option
                              ? "bg-primary text-white border border-primary"
                              : "bg-secondary text-black border border-black"
                          }`}
                          onClick={() =>
                            handleOptionChange("transmission", option)
                          }
                        >
                          {formData.transmission === option ? (
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
                          formData.fuel === option
                            ? "bg-primary text-white border border-primary"
                            : "bg-secondary text-black border border-black"
                        }`}
                        onClick={() => handleOptionChange("fuel", option)}
                      >
                        {formData.fuel === option ? (
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
                            formData.bodyType === option
                              ? "bg-primary text-white border border-primary"
                              : "bg-secondary text-black border border-black"
                          }`}
                          onClick={() => handleOptionChange("bodyType", option)}
                        >
                          {formData.bodyType === option ? (
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
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-primary">
                    Car Image
                  </label>
                  <div className="h-40 flex flex-col items-center justify-center border-dashed border-2 border-primary rounded-lg relative">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Car preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Upload size={40} className="text-white" />
                          <p className="mt-4 text-sm text-white">
                            Click to change image
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload size={40} className="text-primary" />
                        <p className="mt-4 text-sm text-primary">
                          Upload car image
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-primary">
                    Payment Receipt
                  </label>
                  <div className="h-40 flex flex-col items-center justify-center border-dashed border-2 border-primary rounded-lg relative">
                    {receiptPreview ? (
                      <>
                        <img
                          src={receiptPreview}
                          alt="Receipt preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Upload size={40} className="text-white" />
                          <p className="mt-4 text-sm text-white">
                            Click to change receipt
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload size={40} className="text-primary" />
                        <p className="mt-4 text-sm text-primary">
                          Upload payment receipt
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    name="receipt"
                    accept="image/*,.pdf"
                    onChange={handleReceiptChange}
                    ref={receiptInputRef}
                    className="w-full text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary">
                      Condition
                    </label>
                    <input
                      type="text"
                      name="condition"
                      value={formData.condition || ""}
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
                      value={formData.engine || ""}
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
                      value={formData.maintenance || ""}
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
                      value={formData.price || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white"
                      placeholder="Price"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary">
                      Service Price *
                    </label>
                    <input
                      type="number"
                      name="servicePrice"
                      value={formData.servicePrice || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white"
                      placeholder="Service Price"
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    {(["ETB", "USD"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          formData.currency === option
                            ? "bg-primary text-white border border-primary"
                            : "bg-white text-black border border-black"
                        }`}
                        onClick={() => handleOptionChange("currency", option)}
                      >
                        {formData.currency === option ? (
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
                    value={formData.tags || ""}
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
                    value={formData.description || ""}
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

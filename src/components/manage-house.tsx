"use client";

import { IHouse } from "@/lib/models/house.model";
import Image from "next/image";
import {
  ArrowLeft,
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
import { useState, useRef, useEffect } from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import { useUser } from "@clerk/nextjs";
import LoadingComponent from "./ui/loading-component";
import router from "next/router";
import ErrorDialog from "./dialogs/error-dialog";
import ValidationDialog from "./dialogs/validation-dialog";
import SuccessDialog from "./dialogs/success-dialog";

interface HouseFormData {
  name: string;
  bedroom: number;
  size: number;
  bathroom: number;
  parkingSpace: number;
  condition: string;
  maintenance: string;
  price: number;
  servicePrice: number;
  description: string;
  advertisementType: "Rent" | "Sale";
  paymentMethod: "Monthly" | "Quarterly" | "Annual";
  houseType: "House" | "Apartment" | "Guest House";
  essentials: string[];
  currency: string;
  imageUrl?: string;
}

interface ManageHouseProps {
  initialData?: IHouse;
  isEditMode?: boolean;
}

const ManageHouse: React.FC<ManageHouseProps> = ({
  initialData,
  isEditMode = false,
}) => {
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState<HouseFormData>({
    name: initialData?.name || "",
    bedroom: initialData?.bedroom || 0,
    size: initialData?.size || 0,
    bathroom: initialData?.bathroom || 0,
    parkingSpace: initialData?.parkingSpace || 0,
    condition: initialData?.condition || "",
    maintenance: initialData?.maintenance || "",
    price: initialData?.price || 0,
    servicePrice: 0,
    description: initialData?.description || "",
    advertisementType:
      (initialData?.advertisementType as "Rent" | "Sale") || "Rent",
    paymentMethod:
      (initialData?.paymentMethod as "Monthly" | "Quarterly" | "Annual") ||
      "Monthly",
    houseType:
      (initialData?.houseType as "House" | "Apartment" | "Guest House") ||
      "House",
    essentials: initialData?.essentials || [],
    currency: initialData?.currency || "ETB",
  });
  const [isSending, setIsSending] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [missingFields, setMissingFields] = useState<
    { name: string; label: string; valid: boolean }[]
  >([]);
  const [createdHouseId, setCreatedHouseId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const essentials = [
    "WiFi",
    "Furnished",
    "Play Ground",
    "Living Area",
    "Gym",
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
      [name]:
        name === "bedroom" ||
        name === "size" ||
        name === "bathroom" ||
        name === "parkingSpace" ||
        name === "price"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Create preview URL
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
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionChange = (field: keyof IHouse, value: string) => {
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

  const validateForm = () => {
    const requiredFields = [
      { name: "name", label: "House Name" },
      { name: "bedroom", label: "Number of Bedrooms" },
      { name: "size", label: "Size" },
      { name: "bathroom", label: "Number of Bathrooms" },
      { name: "parkingSpace", label: "Parking Space" },
      { name: "price", label: "Price" },
      { name: "description", label: "Description" },
    ];

    const invalidFields = requiredFields.map((field) => ({
      ...field,
      valid: Boolean(formData[field.name as keyof HouseFormData]),
    }));

    setMissingFields(invalidFields);
    return invalidFields.every((field) => field.valid);
  };

  const handleSend = async () => {
    setIsSending(true);

    if (!validateForm()) {
      setShowValidationDialog(true);
      setIsSending(false);
      return;
    }

    try {
      const apiFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        apiFormData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value.toString()
        );
      });

      if (selectedFile) {
        apiFormData.append("file", selectedFile);
      }

      if (selectedReceipt) {
        apiFormData.append("receipt", selectedReceipt);
      }

      const endpoint = isEditMode
        ? `/api/house/${initialData?._id}`
        : "/api/house/create";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: apiFormData,
      });

      const result = await response.json();

      if (result.success) {
        setCreatedHouseId(result.houseId || "");
        setShowSuccessDialog(true);

        if (!isEditMode) {
          setFormData({
            name: "",
            bedroom: 0,
            size: 0,
            bathroom: 0,
            parkingSpace: 0,
            condition: "",
            maintenance: "",
            price: 0,
            servicePrice: 0,
            description: "",
            advertisementType: "Rent",
            paymentMethod: "Monthly",
            houseType: "House",
            essentials: [],
            currency: "ETB",
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
        throw new Error(result.error || "Failed to save house");
      }
    } catch (error) {
      setErrorMessage("Failed to save house");
      setErrorDetails(error instanceof Error ? error.message : "Unknown error");
      setShowErrorDialog(true);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (showErrorDialog || showSuccessDialog || showValidationDialog) {
      const timer = setTimeout(() => {
        setShowErrorDialog(false);
        setShowSuccessDialog(false);
        setShowValidationDialog(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorDialog, showSuccessDialog, showValidationDialog]);

  if (!isLoaded) return <LoadingComponent />;
  if (!user) return <div>Please log in</div>;

  return (
    <section className="flex flex-col min-h-screen bg-gray-50">
      <MaxWidthWrapper>
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditMode ? "Edit House" : "Manage Products"}
          </h1>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center">
              {isEditMode ? (
                <button
                  onClick={() => router.back()}
                  className="flex items-center text-gray-700 hover:text-green-600 mb-8 text-sm font-medium transition-colors duration-200"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Houses
                </button>
              ) : (
                <Link href="/manage-product/car">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors w-full sm:w-auto">
                    <Car className="w-5 h-5" />
                    <span className="font-medium">Car For Sale</span>
                  </button>
                </Link>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto">
                <Home className="w-5 h-5" />
                <span className="font-medium">Create House</span>
              </button>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="New House Listing"
                      required
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["House", "Apartment", "Guest House"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleOptionChange("houseType", type)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          formData.houseType === type
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                        }`}
                      >
                        {type === "House" && <Home className="w-5 h-5" />}
                        {type === "Apartment" && <Home className="w-5 h-5" />}
                        {type === "Guest House" && (
                          <PlayCircle className="w-5 h-5" />
                        )}
                        <span className="text-sm font-medium">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedroom *
                    </label>
                    <input
                      type="number"
                      name="bedroom"
                      value={formData.bedroom || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size *
                    </label>
                    <input
                      type="number"
                      name="size"
                      value={formData.size || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="225"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathroom *
                    </label>
                    <input
                      type="number"
                      name="bathroom"
                      value={formData.bathroom || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parking Space *
                    </label>
                    <input
                      type="number"
                      name="parkingSpace"
                      value={formData.parkingSpace || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="2"
                      required
                    />
                  </div>
                </div>

                {/* Essentials */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Essentials
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {essentials.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleSelection(item)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${
                          formData.essentials.includes(item)
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                        }`}
                      >
                        {formData.essentials.includes(item) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        <span className="text-sm">{item}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="House description"
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* File Uploads */}
                <div className="space-y-4">
                  {/* House Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      House Image
                    </label>
                    <div
                      className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors relative overflow-hidden cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <>
                          <Image
                            src={imagePreview}
                            alt="House preview"
                            className="absolute inset-0 w-full h-full object-cover"
                            width={500}
                            height={300}
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="w-8 h-8 text-white" />
                            <p className="mt-2 text-sm text-white">
                              Click to change image
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">
                            Click to upload house image
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      name="houseImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      Choose House Image
                    </button>
                    {selectedFile && (
                      <span className="ml-2 text-sm text-gray-600">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>

                  {/* Receipt Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Receipt (Optional)
                    </label>
                    <div
                      className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors relative overflow-hidden cursor-pointer"
                      onClick={() => receiptInputRef.current?.click()}
                    >
                      {receiptPreview ? (
                        <>
                          <Image
                            src={receiptPreview}
                            alt="Receipt preview"
                            className="absolute inset-0 w-full h-full object-cover"
                            width={500}
                            height={300}
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="w-8 h-8 text-white" />
                            <p className="mt-2 text-sm text-white">
                              Click to change receipt
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">
                            Click to upload payment receipt
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
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => receiptInputRef.current?.click()}
                      className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      Choose Receipt File
                    </button>
                    {selectedReceipt && (
                      <span className="ml-2 text-sm text-gray-600">
                        {selectedReceipt.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <input
                      type="text"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Excellent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maintenance
                    </label>
                    <input
                      type="text"
                      name="maintenance"
                      value={formData.maintenance}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Frequent"
                    />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="1000"
                    required
                  />
                </div>

                {/* Service Price */}
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-3 rounded-md">
                  <span className="text-sm font-medium text-gray-700">
                    Service Price:
                  </span>
                  <span className="text-lg font-semibold text-primary">
                    150 ETB
                  </span>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <div className="flex gap-2">
                    {["ETB", "USD"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleOptionChange("currency", option)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${
                          formData.currency === option
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                        }`}
                      >
                        {formData.currency === option ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        <span className="text-sm">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Terms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Monthly", "Quarterly", "Annual"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          handleOptionChange("paymentMethod", option)
                        }
                        className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${
                          formData.paymentMethod === option
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                        }`}
                      >
                        {formData.paymentMethod === option ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        <span className="text-sm">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending}
                  className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
                    isSending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isSending
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </MaxWidthWrapper>

      {/* Dialogs */}
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        onRetry={handleSend}
        title="Error Creating House"
        errorMessage={errorMessage}
        errorDetails={errorDetails}
      />

      <ValidationDialog
        isOpen={showValidationDialog}
        onClose={() => setShowValidationDialog(false)}
        missingFields={missingFields}
        onGoBack={() => setShowValidationDialog(false)}
      />

      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        productName={formData.name}
        productId={createdHouseId}
        productType="house"
      />
    </section>
  );
};

export default ManageHouse;

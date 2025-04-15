"use client";
import Image from "next/image";
import { Car, CheckCircle, Circle, Home, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";

import { ICar } from "@/lib/models/car.model";
import LoadingComponent from "./ui/loading-component";
import ErrorDialog from "./dialogs/error-dialog";
import ValidationDialog from "./dialogs/validation-dialog";
import SuccessDialog from "./dialogs/success-dialog";

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
  const router = useRouter();
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
    servicePrice: initialData?.servicePrice || 0,
    description: initialData?.description || "",
    advertisementType:
      (initialData?.advertisementType as "Rent" | "Sale") || "Sale",
    paymentMethod: initialData?.paymentMethod || 1,
    currency: initialData?.currency || "ETB",
    tags: initialData?.tags || "",
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
  const [createdCarId, setCreatedCarId] = useState<string>("");
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

  // Add handleKeyDown function to prevent form submission on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLElement) {
      // Prevent form submission when pressing Enter on input fields
      // unless it's a textarea or button
      const tagName = e.target.tagName.toLowerCase();
      if (tagName !== "textarea" && tagName !== "button") {
        e.preventDefault();
      }
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { name: "name", label: "Car Name" },
      { name: "price", label: "Price" },
      { name: "mileage", label: "Mileage" },
      { name: "description", label: "Description" },
    ];

    const invalidFields = requiredFields.map((field) => ({
      ...field,
      valid: Boolean(formData[field.name as keyof CarFormData]),
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
        : "/api/cars/create";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: apiFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        setCreatedCarId(result.carId || "");
        setShowSuccessDialog(true);

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
        throw new Error(result.error || "Failed to save car");
      }
    } catch (error) {
      setErrorMessage("Failed to save car");
      setErrorDetails(error instanceof Error ? error.message : "Unknown error");
      setShowErrorDialog(true);
    } finally {
      setIsSending(false);
    }
  };

  if (!isLoaded) {
    return <LoadingComponent />;
  }

  return (
    <section
      className="flex flex-col min-h-screen bg-gray-50"
      onKeyDown={handleKeyDown}
    >
      <MaxWidthWrapper>
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditMode ? "Edit Car" : "Manage Products"}
          </h1>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {isEditMode ? (
                
                <button
                  onClick={() => router.back()}
                  className="flex items-center text-gray-700 hover:text-green-600 mb-8 text-sm font-medium transition-colors duration-200"
                >
                <ArrowLeft size={18} className="mr-2" />
                  Back to Cars
                </button>
              ) : (
                <Link href="/manage-product/car">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors w-full sm:w-auto">
                    <Car className="w-5 h-5" />
                    <span className="font-medium">Create Cars</span>
                  </button>
                </Link>
              )}
              {!isEditMode && (
                  <Link href="/manage-product/house">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto">
                    <Home className="w-5 h-5" />
                    <span className="font-medium">Create House</span>
                  </button>
                  </Link>
                )}
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
                      placeholder="New Car Listing"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="2022"
                    />
                  </div>
                </div>

                {/* Car Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mileage *
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="50000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Speed
                    </label>
                    <input
                      type="number"
                      name="speed"
                      value={formData.speed || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="120"
                    />
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmission
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Automatic", "Manual"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          handleOptionChange("transmission", option)
                        }
                        className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${
                          formData.transmission === option
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                        }`}
                      >
                        {formData.transmission === option ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        <span className="text-sm">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Gasoline", "Diesel", "Electric", "Hybrid"].map(
                      (option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleOptionChange("fuel", option)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${
                            formData.fuel === option
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                          }`}
                        >
                          {formData.fuel === option ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                          <span className="text-sm">{option}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Truck", "SUV", "Sedan", "Hatchback", "Minivan"].map(
                      (option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleOptionChange("bodyType", option)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${
                            formData.bodyType === option
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                          }`}
                        >
                          {formData.bodyType === option ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                          <span className="text-sm">{option}</span>
                        </button>
                      )
                    )}
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
                    placeholder="Car description"
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* File Uploads */}
                <div className="space-y-4">
                  {/* Car Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Car Image
                    </label>
                    <div
                      className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors relative overflow-hidden cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label="Upload car image"
                    >
                      {imagePreview ? (
                        <>
                          <Image
                            src={imagePreview}
                            alt="Car preview"
                            width={400}
                            height={400}
                            className="absolute inset-0 w-full h-full object-cover"
                            priority
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
                            Click to upload car image
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
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      Choose Car Image
                    </button>
                    {selectedFile && (
                      <span className="ml-2 text-sm text-gray-600">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>

                  {/* Receipt Upload */}
                  {!isEditMode && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Receipt (Optional)
                      </label>
                      <div
                        className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors relative overflow-hidden cursor-pointer"
                        onClick={() => receiptInputRef.current?.click()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            receiptInputRef.current?.click();
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label="Upload payment receipt"
                      >
                        {receiptPreview ? (
                          <>
                            <Image
                              src={receiptPreview}
                              alt="Receipt preview"
                              width={400}
                              height={400}
                              className="absolute inset-0 w-full h-full object-cover"
                              priority
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
                  )}
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
                      Engine
                    </label>
                    <input
                      type="text"
                      name="engine"
                      value={formData.engine}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="3.8L V6"
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
                {!isEditMode && (
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Service Price
                      </label>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-md font-medium">
                        150 ETB
                      </span>
                    </div>
                    <input
                      type="hidden"
                      name="servicePrice"
                      value={formData.servicePrice}
                    />
                  </div>
                )}

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

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="#Ford #F150 #2022"
                  />
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
                  {isEditMode ? "Update" : "Create"}
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
        title="Error Creating Car"
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
        productId={createdCarId}
        productType="car"
      />
    </section>
  );
};

export default ManageCar;
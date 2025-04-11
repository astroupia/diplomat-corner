"use client";

import { IHouse } from "@/lib/models/house.model";
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
import { useState, useRef, useEffect } from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import { useUser } from "@clerk/nextjs";

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
}

interface ManageHouseProps {
  initialData?: IHouse;
  isEditMode?: boolean;
}

const ManageHouse: React.FC<ManageHouseProps> = ({ initialData, isEditMode = false }) => {
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
    advertisementType: initialData?.advertisementType as "Rent" | "Sale" || "Rent",
    paymentMethod: initialData?.paymentMethod as "Monthly" | "Quarterly" | "Annual" || "Monthly",
    houseType: initialData?.houseType as "House" | "Apartment" | "Guest House" || "House",
    essentials: initialData?.essentials || [],
    currency: initialData?.currency || "ETB",
  });
  const [isSending, setIsSending] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

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
      [name]: name === "bedroom" || name === "size" || name === "bathroom" ||
              name === "parkingSpace" || name === "price" ? Number(value) : value,
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

    if (
      !formData.name ||
      !formData.bedroom ||
      !formData.size ||
      !formData.bathroom ||
      !formData.parkingSpace ||
      !formData.price ||
      !formData.description
    ) {
      setSubmitResult({ success: false, message: "Please fill all required fields" });
      setIsSending(false);
      return;
    }

    try {
      const apiFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        apiFormData.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
      });
      
      if (selectedFile) {
        apiFormData.append('file', selectedFile);
      }

      if (selectedReceipt) {
        apiFormData.append('receipt', selectedReceipt);
      }

      const endpoint = isEditMode ? `/api/house/${initialData?._id}` : '/api/house/create';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        body: apiFormData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitResult({ 
          success: true, 
          message: isEditMode ? "House updated successfully!" : "House saved successfully!" 
        });
        
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
          fileInputRef.current.value = '';
          }
          if (receiptInputRef.current) {
            receiptInputRef.current.value = '';
          }
        }
      } else {
        setSubmitResult({ success: false, message: result.error || "Failed to save house" });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: `Failed to save house: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (submitResult?.success) {
      const timer = setTimeout(() => {
        setSubmitResult(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitResult]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <section className="flex flex-col min-h-screen bg-gray-50">
      <MaxWidthWrapper>
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditMode ? "Edit House" : "Manage Products and Ads"}
        </h1>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full lg:w-1/5 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Products</span>
              </li>
                <li className="pl-8 flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Products</span>
              </li>
                <li className="pl-8 flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                  <Pen className="w-4 h-4" />
                  <span className="text-sm">Edit Products</span>
              </li>
                <li className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors">
                  <Tv className="w-5 h-5" />
                  <span className="font-medium">Adverts</span>
              </li>
              <Link href="/advertisment">
                  <li className="pl-8 flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add Adverts</span>
                </li>
              </Link>
              <Link href="/Ad">
                  <li className="pl-8 flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                    <Pen className="w-4 h-4" />
                    <span className="text-sm">Edit Adverts</span>
                </li>
              </Link>
            </ul>
          </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link href="/manage-product/car">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors w-full sm:w-auto">
                    <Car className="w-5 h-5" />
                    <span className="font-medium">Car For Sale</span>
                </button>
              </Link>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">House For Rent</span>
                </button>
            </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
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
                          {type === "Guest House" && <PlayCircle className="w-5 h-5" />}
                          <span className="text-sm font-medium">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bedroom *</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bathroom *</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parking Space *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Essentials</label>
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
              </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-6">
                  {/* File Uploads */}
                  <div className="space-y-4">
                    {/* House Image Upload */}
                <div className="space-y-2">
                      <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors relative overflow-hidden">
                        {imagePreview ? (
                          <>
                            <img
                              src={imagePreview}
                              alt="House preview"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Upload className="w-8 h-8 text-white" />
                              <p className="mt-2 text-sm text-white">Click to change image</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">Upload house image</p>
                          </>
                        )}
                  </div>
                  <input
                    type="file"
                    name="houseImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                        className="w-full text-sm"
                      />
                    </div>

                    {/* Receipt Upload */}
                    <div className="space-y-2">
                      <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors relative overflow-hidden">
                        {receiptPreview ? (
                          <>
                            <img
                              src={receiptPreview}
                              alt="Receipt preview"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Upload className="w-8 h-8 text-white" />
                              <p className="mt-2 text-sm text-white">Click to change receipt</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">Upload payment receipt</p>
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
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Price *</label>
                    <input
                      type="number"
                      name="servicePrice"
                      value={formData.servicePrice || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="100"
                      required
                    />
                  </div>

                  {/* Currency */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <div className="flex gap-2">
                    {["ETB", "USD"].map((option) => (
                      <button
                        key={option}
                        type="button"
                          onClick={() => handleOptionChange("currency", option)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                    <div className="flex flex-wrap gap-2">
                    {["Monthly", "Quarterly", "Annual"].map((option) => (
                      <button
                        key={option}
                        type="button"
                          onClick={() => handleOptionChange("paymentMethod", option)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
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

                  {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
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
                    {isSending ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update" : "Create")}
                </button>

                  {/* Result Message */}
                {submitResult && (
                    <div
                      className={`p-3 rounded-lg ${
                        submitResult.success
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                  >
                    {submitResult.message}
                    </div>
                )}
              </div>
            </div>
          </main>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ManageHouse;
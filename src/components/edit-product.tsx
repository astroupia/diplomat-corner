"use client";

import { useState, useEffect } from "react";
import { Car, Home, CheckCircle, Circle, Upload } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { ICar } from "@/lib/models/editcar.model"; // Assuming this is the correct file as per your last request
import { IHouse } from "@/lib/models/house.model";
import { updateCar } from "@/lib/actions/edit.car.action";
import { updateHouse } from "@/lib/actions/edit.house.action";

type ProductType = "Car" | "House";

interface EditProductProps {
  initialData: ICar | IHouse;
  productType: ProductType;
}

const EditProduct: React.FC<EditProductProps> = ({ initialData, productType: initialProductType }) => {
  const { user } = useUser();
  const userId = user?.id;
  const [productType, setProductType] = useState<ProductType>(initialProductType);
  
  const [sharedData, setSharedData] = useState({
    name: initialData.name || "",
    price: initialData.price || 0,
    description: initialData.description || "",
    condition: initialData.condition || "",
    maintenance: initialData.maintenance || "",
    currency: initialData.currency || "ETB",
  });

  const [carData, setCarData] = useState<Partial<ICar>>(
    initialProductType === "Car" && "mileage" in initialData
      ? initialData
      : {
          userId: userId || "",
          advertisementType: "Sale",
          paymentMethod: 1,
          mileage: 0,
          speed: 0,
          milesPerGallon: 0,
          timestamp: new Date().toISOString(),
          transmission: "Automatic",
          fuel: "Gasoline",
          bodyType: "Truck",
          make: "",
        }
  );

  const [houseData, setHouseData] = useState<IHouse>(
    initialProductType === "House" && "bedroom" in initialData
      ? initialData
      : {
          _id: "", // Added required _id
          userId: userId || "",
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
          parkingSpace: 0, // Added missing property
          paymentId: "", // Added missing property
          visiblity: "Public", // Updated to match the expected type
          status: "Pending", // Updated to match the expected type
        }
  );

  const [isSending, setIsSending] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (productType === "Car" && "mileage" in initialData) {
      setCarData(initialData);
    } else if (productType === "House" && "bedroom" in initialData) {
      setHouseData(initialData);
    }
  }, [initialData, productType]);

  const handleSharedInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSharedData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleCarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]: ["year", "mileage", "speed", "milesPerGallon"].includes(name) ? Number(value) : value,
    }));
  };

  const handleCarOptionChange = (field: string, value: string) => {
    setCarData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHouseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHouseData((prev) => ({
      ...prev,
      [name]: ["bedroom", "size", "bathroom"].includes(name) ? Number(value) : value,
    }));
  };

  const handleHouseOptionChange = (field: keyof IHouse, value: string) => {
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

  const handleSave = async () => {
    if (!userId) {
      setSubmitResult({ success: false, message: "You must be logged in to save changes" });
      return;
    }

    setIsSending(true);
    setSubmitResult(null);

    if (!sharedData.name || !sharedData.price) {
      setSubmitResult({ success: false, message: "Name and Price are required" });
      setIsSending(false);
      return;
    }

    if (productType === "Car") {
      if (!carData.mileage || !carData.make) {
        setSubmitResult({ success: false, message: "Mileage and Make are required for cars" });
        setIsSending(false);
        return;
      }
      const updatedCarData: ICar = {
        ...carData,
        ...sharedData,
        userId,
        _id: initialData._id,
        name: sharedData.name,
        price: sharedData.price,
        mileage: carData.mileage || 0,
        make: carData.make,
      } as ICar;
      const result = await updateCar(updatedCarData);
      if (result.success) {
        setSubmitResult({ success: true, message: "Car updated successfully!" });
      } else {
        setSubmitResult({ success: false, message: result.error || "Failed to update car" });
      }
    } else {
      if (!houseData.bedroom || !houseData.size || !houseData.bathroom) {
        setSubmitResult({ success: false, message: "Bedroom, Size, and Bathroom are required for houses" });
        setIsSending(false);
        return;
      }
      const updatedHouseData: IHouse = {
        ...houseData,
        ...sharedData,
        userId,
        _id: initialData._id,
        name: sharedData.name,
        price: sharedData.price,
      };
      const result = await updateHouse(updatedHouseData);
      if (result.success) {
        setSubmitResult({ success: true, message: "House updated successfully!" });
      } else {
        setSubmitResult({ success: false, message: result.error || "Failed to update house" });
      }
    }
    setIsSending(false);
  };

  if (!userId || initialData.userId !== userId) {
    return <div>You are not authorized to edit this listing.</div>;
  }

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-primary">Edit Product</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setProductType("Car")}
            className={`flex items-center space-x-2 px-4 py-2 border border-primary rounded-lg ${
              productType === "Car" ? "bg-secondary text-primary" : "bg-white text-primary"
            }`}
          >
            <Car size={16} />
            <span>Car</span>
          </button>
          <button
            onClick={() => setProductType("House")}
            className={`flex items-center space-x-2 px-4 py-2 border border-primary rounded-lg ${
              productType === "House" ? "bg-secondary text-primary" : "bg-white text-primary"
            }`}
          >
            <Home size={16} />
            <span>House</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 bg-secondary p-4 rounded-3xl shadow-md border-2 border-primary">
          <div>
            <label className="block text-sm font-semibold text-primary">Name *</label>
            <input
              type="text"
              name="name"
              value={sharedData.name}
              onChange={handleSharedInputChange}
              className="w-full p-2 border-b-2 border-primary focus:outline-none bg-secondary text-sm"
              required
            />
          </div>
          {productType === "Car" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-primary">Make *</label>
                  <input
                    type="text"
                    name="make"
                    value={carData.make || ""}
                    onChange={handleCarInputChange}
                    className="w-full p-2 border-b-2 border-primary focus:outline-none bg-secondary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={carData.year || ""}
                    onChange={handleCarInputChange}
                    className="w-full p-2 border-b-2 border-primary focus:outline-none bg-secondary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary">Mileage *</label>
                  <input
                    type="number"
                    name="mileage"
                    value={carData.mileage || ""}
                    onChange={handleCarInputChange}
                    className="w-full p-2 border-b-2 border-primary focus:outline-none bg-secondary text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary">Transmission</label>
                <div className="flex space-x-2">
                  {["Automatic", "Manual"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
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
              <div>
                <label className="block text-sm font-semibold text-primary">Fuel</label>
                <div className="flex space-x-2">
                  {["Gasoline", "Diesel", "Electric"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
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
                <label className="block text-sm font-semibold text-primary">Body Type</label>
                <div className="flex flex-wrap space-x-2">
                  {["Truck", "SUV", "Sedan", "Hatchback", "Minivan"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
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
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-primary">Bedroom *</label>
                  <input
                    type="number"
                    name="bedroom"
                    value={houseData.bedroom || ""}
                    onChange={handleHouseInputChange}
                    className="w-full p-2 border-b-2 border-primary focus:outline-none bg-secondary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary">Size *</label>
                  <input
                    type="number"
                    name="size"
                    value={houseData.size || ""}
                    onChange={handleHouseInputChange}
                    className="w-full p-2 border-b-2 border-primary focus:outline-none bg-secondary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary">Bathroom *</label>
                  <input
                    type="number"
                    name="bathroom"
                    value={houseData.bathroom || ""}
                    onChange={handleHouseInputChange}
                    className="w-full p-2 border-b-2 border-primary focus:outline-none bg-secondary text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary">House Type</label>
                <div className="flex space-x-2">
                  {["House", "Apartment", "Guest House"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleHouseOptionChange("houseType", type)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                        houseData.houseType === type
                          ? "bg-primary text-white border border-primary"
                          : "bg-secondary text-black border border-black"
                      }`}
                    >
                      {houseData.houseType === type ? <CheckCircle size={12} /> : <Circle size={12} />}
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary">Essentials</label>
                <div className="grid grid-cols-3 gap-2">
                  {essentials.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleHouseEssential(item)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                        houseData.essentials.includes(item)
                          ? "bg-primary text-white border border-primary"
                          : "bg-secondary text-black border border-black"
                      }`}
                    >
                      {houseData.essentials.includes(item) ? <CheckCircle size={12} /> : <Circle size={12} />}
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4 border-2 border-primary p-4 rounded-3xl shadow-md">
          <div className="h-32 flex flex-col items-center justify-center border-dashed border-2 border-primary rounded-lg">
            <Upload size={24} className="text-primary" />
            <p className="mt-2 text-sm text-primary">Upload media for the campaign</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-primary">Condition</label>
              <input
                type="text"
                name="condition"
                value={sharedData.condition}
                onChange={handleSharedInputChange}
                className="w-full p-2 border-b-2 border-primary focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary">Maintenance</label>
              <input
                type="text"
                name="maintenance"
                value={sharedData.maintenance}
                onChange={handleSharedInputChange}
                className="w-full p-2 border-b-2 border-primary focus:outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-primary">Price *</label>
              <input
                type="number"
                name="price"
                value={sharedData.price || ""}
                onChange={handleSharedInputChange}
                className="w-full p-2 border-b-2 border-primary focus:outline-none text-sm"
                required
              />
            </div>
            <div className="flex gap-2">
              {["ETB", "USD"].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    sharedData.currency === option
                      ? "bg-primary text-white border border-primary"
                      : "bg-white text-black border border-black"
                  }`}
                  onClick={() => setSharedData((prev) => ({ ...prev, currency: option }))}
                >
                  {sharedData.currency === option ? <CheckCircle size={12} /> : <Circle size={12} />}
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </div>
          {productType === "House" && (
            <div>
              <label className="block text-sm font-semibold text-primary">Payment Terms</label>
              <div className="flex space-x-2">
                {["Monthly", "Quarterly", "Annual"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      houseData.paymentMethod === option
                        ? "bg-primary text-white border border-primary"
                        : "bg-white text-black border border-black"
                    }`}
                    onClick={() => handleHouseOptionChange("paymentMethod", option)}
                  >
                    {houseData.paymentMethod === option ? <CheckCircle size={12} /> : <Circle size={12} />}
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-primary">Description</label>
            <textarea
              name="description"
              value={sharedData.description}
              onChange={handleSharedInputChange}
              className="w-full border-b-2 border-primary focus:outline-none p-2 text-sm"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSending}
            className={`w-full py-3 rounded-lg font-semibold text-white ${
              isSending ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {isSending ? "Saving..." : "Save"}
          </button>
          {submitResult && (
            <p className={`text-sm mt-2 ${submitResult.success ? "text-green-600" : "text-red-600"}`}>
              {submitResult.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
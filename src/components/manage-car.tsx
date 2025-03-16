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
import { useState, useTransition } from "react";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { createCar } from "@/lib/actions/car.managment.actions";

// Define the interface for car form data
interface CarFormData {
  brandName: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  fuel: string;
  bodyType: string;
  condition: string;
  engine: string;
  maintenance: string;
  price: number;
  currency: string;
  tags: string;
  description: string;
}

// Define the interface for the submit result
interface SubmitResult {
  success: boolean;
  message: string;
  id?: string;
}

const ManageCar = () => {
  const [selectedTransmission, setSelectedTransmission] = useState<string>("Automatic");
  const [selectedFuel, setSelectedFuel] = useState<string>("Gasoline");
  const [selectedBodyType, setSelectedBodyType] = useState<string>("Truck");
  const [currency, setCurrency] = useState<string>("ETB");
  const [formData, setFormData] = useState<CarFormData>({
    brandName: "",
    model: "",
    year: 0,
    mileage: 0,
    transmission: "Automatic",
    fuel: "Gasoline",
    bodyType: "Truck",
    condition: "",
    engine: "",
    maintenance: "",
    price: 0,
    currency: "ETB",
    tags: "",
    description: "",
  });
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "mileage" || name === "price"
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Save Car button clicked");

    const carData: CarFormData = {
      brandName: formData.brandName,
      model: formData.model,
      year: formData.year,
      mileage: formData.mileage,
      transmission: selectedTransmission,
      fuel: selectedFuel,
      bodyType: selectedBodyType,
      condition: formData.condition,
      engine: formData.engine,
      maintenance: formData.maintenance,
      price: formData.price,
      currency: currency,
      tags: formData.tags,
      description: formData.description,
    };

    console.log("Data to send to Server Action:", carData);

    startTransition(async () => {
      try {
        // Basic validation
        if (!formData.brandName || !formData.model || !formData.year) {
          setSubmitResult({
            success: false,
            message: "Please fill in required fields: Brand Name, Model, and Year.",
          });
          console.log("Validation failed: Missing required fields");
          return;
        }

        const result = await createCar(carData);
        console.log("Server Action response:", result);

        if (result.success) {
          setSubmitResult({
            success: true,
            message: `Car saved successfully with ID: ${result.id}`,
            id: result.id,
          });
          // Reset form on success
          setFormData({
            brandName: "",
            model: "",
            year: 0,
            mileage: 0,
            transmission: "Automatic",
            fuel: "Gasoline",
            bodyType: "Truck",
            condition: "",
            engine: "",
            maintenance: "",
            price: 0,
            currency: "ETB",
            tags: "",
            description: "",
          });
          setSelectedTransmission("Automatic");
          setSelectedFuel("Gasoline");
          setSelectedBodyType("Truck");
          setCurrency("ETB");
        } else {
          setSubmitResult({
            success: false,
            message: result.message || "Unknown error from Server Action",
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setSubmitResult({
          success: false,
          message: `Unexpected error: ${errorMessage}`,
        });
        console.error("Unexpected error in handleSubmit:", error);
      }
    });
  };

  return (
    <section className="flex flex-col min-h-screen text-Lato">
      <MaxWidthWrapper>
        <h1 className="text-xl md:text-2xl font-semibold text-primary m-6">
          Manage Products and Ads
        </h1>

        <div className="flex flex-col lg:flex-row bg-secondary h-auto lg:h-screen bg-primary-light p-4 lg:p-6">
          <aside className="w-full lg:w-1/5 bg-secondary rounded-3xl shadow-md p-4 border-2 border-primary lg:mb-0 lg:pr-7 lg:mr-4 mb-6">
            <ul className="space-y-4 text-primary font-semibold text-sm md:text-base">
              <li className="flex flex-row items-center">
                <ShoppingCart size={20} className="mr-2" />
                Products
              </li>
              <li className="pl-4 flex flex-row items-center text-primary">
                <Plus size={16} className="mr-2" />
                Add Products
              </li>
              <li className="pl-4 text-primary flex flex-row items-center">
                <Pen size={16} className="mr-2" />
                Edit Products
              </li>
              <li className="flex flex-row items-center">
                <Tv size={20} className="mr-2" />
                Adverts
              </li>
              <Link href="/advertisment">
                <li className="pl-4 flex flex-row items-center text-primary">
                  <Plus size={16} className="mr-2" />
                  Add Adverts
                </li>
              </Link>
              <li className="pl-4 flex flex-row items-center text-primary">
                <Pen size={16} className="mr-2" />
                Edit Adverts
              </li>
            </ul>
          </aside>

          <main className="flex-1 bg-white border-2 border-primary rounded-3xl shadow-md p-4 lg:p-6 overflow-auto">
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

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl p-4 lg:p-6">
                <div className="col-span-12 lg:col-span-8 space-y-6 bg-secondary p-4 lg:p-6 rounded-3xl shadow-md border-3 border-primary">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        name="brandName"
                        value={formData.brandName}
                        onChange={handleInputChange}
                        className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary"
                        placeholder="Ford"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary">
                        Model
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary"
                        placeholder="F150"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary">
                        Year of Manufacture
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary"
                        placeholder="2022"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary">
                        Mileage
                      </label>
                      <input
                        type="number"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleInputChange}
                        className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary"
                        placeholder="132"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                              selectedTransmission === option
                                ? "bg-primary text-white border border-primary"
                                : "bg-secondary text-black border border-black"
                            }`}
                            onClick={() => setSelectedTransmission(option)}
                          >
                            {selectedTransmission === option ? (
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
                        Fuel
                      </label>
                      <div className="flex flex-wrap space-x-2">
                        {["Gasoline", "Diesel", "Electric"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                              selectedFuel === option
                                ? "bg-primary text-white border border-primary"
                                : "bg-secondary text-black border border-black"
                            }`}
                            onClick={() => setSelectedFuel(option)}
                          >
                            {selectedFuel === option ? (
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
                      Body Type
                    </label>
                    <div className="flex flex-wrap space-x-2">
                      {["Truck", "SUV", "Sedan", "Hatchback", "Minivan"].map(
                        (option) => (
                          <button
                            key={option}
                            type="button"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                              selectedBodyType === option
                                ? "bg-primary text-white border border-primary"
                                : "bg-secondary text-black border border-black"
                            }`}
                            onClick={() => setSelectedBodyType(option)}
                          >
                            {selectedBodyType === option ? (
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

                <div className="col-span-12 lg:col-span-4 space-y-6 border-2 border-primary p-4 lg:p-6 rounded-3xl shadow-md">
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
                        value={formData.condition}
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
                        value={formData.engine}
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
                        value={formData.maintenance}
                        onChange={handleInputChange}
                        className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white"
                        placeholder="Frequent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 sm:space-y-0 sm:space-x-4 sm:flex-row items-center">
                    <label className="block text-sm font-semibold text-primary">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white"
                      placeholder="Price"
                    />
                    <div className="flex space-x-4">
                      {["ETB", "USD"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                            currency === option
                              ? "bg-primary text-white border border-primary"
                              : "bg-white text-black border border-black"
                          }`}
                          onClick={() => setCurrency(option)}
                        >
                          {currency === option ? (
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
                      value={formData.tags}
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
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-white"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="px-4 py-2 bg-primary text-white rounded-lg shadow-md text-sm font-semibold disabled:opacity-50"
                    >
                      {isPending ? "Saving..." : "Save Car"}
                    </button>
                    {submitResult && (
                      <p
                        className={`mt-2 text-sm ${
                          submitResult.success ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {submitResult.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ManageCar;
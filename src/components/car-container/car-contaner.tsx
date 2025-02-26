import React from "react";
import Card from "./car-card";

const Page: React.FC = () => {
  const cars = [
    {
      model: "Ford F-150, 2024",
      price: 90693,
      horsepower: 560,
      mileage: 12000,
      mpg: 12,
    },
    {
      model: "Chevrolet Silverado, 2023",
      price: 85000,
      horsepower: 500,
      mileage: 8000,
      mpg: 15,
    },
    {
      model: "RAM 1500, 2024",
      price: 95000,
      horsepower: 600,
      mileage: 5000,
      mpg: 14,
    },
    {
      model: "Toyota Tundra, 2023",
      price: 78000,
      horsepower: 430,
      mileage: 15000,
      mpg: 18,
    },
  ];

  return (
    <div>
      {/* Cover Section */}
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url("/ci.jpg")' }}
      >
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold">Cars</h1>
          <p className="text-lg mt-2">Service / Cars for Sale</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Cars</h2>
            <select className="border border-gray-300 rounded px-3 py-1 text-gray-600">
              <option>Default Order</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
            </select>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <Card key={index} {...car} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

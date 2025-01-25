import React from "react";
import { Car, MapPin, Fuel } from "lucide-react";
import Image from "next/image";
import { Product_Car } from "../../../public/assets/images";

interface CardProps {
  model: string;
  price: number;
  horsepower: number;
  mileage: number;
  mpg: number;
}

const Card: React.FC<CardProps> = ({
  model,
  price,
  horsepower,
  mileage,
  mpg,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        width={100}
        height={100}
        src={Product_Car}
        alt="Car"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{model}</h2>
        <p className="text-green-600 text-xl font-bold">
          ${price.toLocaleString()}
        </p>
        <div className="flex justify-between text-gray-700 mt-2">
          <div className="flex items-center gap-1">
            <Car size={18} />
            <span>{horsepower} hp</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={18} />
            <span>{mileage.toLocaleString()} Km</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel size={18} />
            <span>{mpg} MPG</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-2">List by Admin</p>
      </div>
    </div>
  );
};

export default Card;

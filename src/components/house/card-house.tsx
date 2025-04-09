import React from "react";
import { Bed, Bath, Ruler } from "lucide-react";
import Image from "next/image";

interface CardProps {
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
}

const CardHouse: React.FC<CardProps> = ({
  address,
  price,
  bedrooms,
  bathrooms,
  size,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src="/house.jpg"
        alt="Property"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{address}</h2>
        <p className="text-green-600 text-xl font-bold">
          ${price.toLocaleString()}
        </p>
        <div className="flex justify-between text-gray-700 mt-2">
          <div className="flex items-center gap-1">
            <Bed size={18} />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={18} />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler size={18} />
            <span>{size.toLocaleString()} ft²</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-2">List by Admin</p>
      </div>
    </div>
  );
};

export default CardHouse;

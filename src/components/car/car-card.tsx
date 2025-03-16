import React from "react";
import { Car, MapPin, Fuel } from "lucide-react";
import Image from "next/image";
import { ICar } from "@/lib/models/car.model"; // Import ICar for reference
import Link from "next/link";

// Define CardProps based on ICar, excluding Document methods
interface CardProps {
  _id: string;
  Name: string;
  Price: number;
  Mileage: number;
  MilesPerGallon: number;
  Speed: number;
  listedBy?: string; // Optional prop
}

const Card: React.FC<CardProps> = ({
  _id,
  Name,
  Price,
  Mileage,
  MilesPerGallon,
  Speed,
  listedBy = "Admin", // Default value
}) => {
  return (
    <Link href={`/cars/${_id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <Image
          width={300}
          height={200}
          src="/ford-f150.jpg" // Placeholder: replace with dynamic image or actual path
          alt={Name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold">{Name}</h2>
          <p className="text-green-600 text-xl font-bold">
            ${Price.toLocaleString()}
          </p>
          <div className="flex justify-between text-gray-700 mt-2">
            <div className="flex items-center gap-1">
              <Car size={18} />
              <span>{Speed} hp</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={18} />
              <span>{Mileage.toLocaleString()} Km</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel size={18} />
              <span>{MilesPerGallon} MPG</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">List by {listedBy}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
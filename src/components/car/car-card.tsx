import React from "react";
import { Car, MapPin, Fuel } from "lucide-react";
import Image from "next/image";
<<<<<<< HEAD
import Link from "next/link";
=======
import { images } from "@public/assets/images";
>>>>>>> d5eb80e51b9bfa8f4266a0ba8e9a677d918f59f5

interface CardProps {
  _id: string;
  name: string;
  price: number;
  mileage: number;
  milesPerGallon: number;
  speed: number;
  listedBy?: string;
}

const Card: React.FC<CardProps> = ({
  _id,
  name,
  price,
  mileage,
  milesPerGallon,
  speed,
  listedBy = "Admin",
}) => {
  return (
<<<<<<< HEAD
    <Link href={`/purchase/carpurchase/${_id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <Image
          width={300}
          height={200}
          src="/car.jpg"
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-green-600 text-xl font-bold">
            ${price.toLocaleString()}
          </p>
          <div className="flex justify-between text-gray-700 mt-2">
            <div className="flex items-center gap-1">
              <Car size={18} />
              <span>{speed} hp</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={18} />
              <span>{mileage.toLocaleString()} Km</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel size={18} />
              <span>{milesPerGallon} MPG</span>
            </div>
=======
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        width={100}
        height={100}
        src={images.car_preview.src}
        alt={images.car_preview.alt}
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
>>>>>>> d5eb80e51b9bfa8f4266a0ba8e9a677d918f59f5
          </div>
          <p className="text-gray-500 text-sm mt-2">Listed by {listedBy}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
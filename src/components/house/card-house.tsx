import { IHouse } from "@/lib/models/house.model";
import { Bath, Bed, Car, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProps extends IHouse {
  listedBy?: string; // Optional, defaults to "Admin"
}

const CardHouse: React.FC<CardProps> = ({
  _id,
  name,
  price,
  bedroom,
  bathroom,
  size,
  parkingSpace,
  currency,
  imageUrl,
  advertisementType,
  listedBy = "Admin",
}) => {
  return (
    <Link href={`/house/${_id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <Image
            width={300}
            height={200}
            src={imageUrl || "/c.jpg"}
            alt={name}
            className="w-full h-48 object-cover"
          />
          <span className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
            {advertisementType}
          </span>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{name}</h2>
          <p className="text-green-600 text-xl font-bold mt-1">
            {currency} {price.toLocaleString()}
          </p>
          <div className="flex flex-wrap justify-between text-gray-600 mt-2 gap-2">
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>{bedroom} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath size={16} />
              <span>{bathroom} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler size={16} />
              <span>{size.toLocaleString()} ft²</span>
            </div>
            <div className="flex items-center gap-1">
              <Car size={16} />
              <span>{parkingSpace} Parking</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2 truncate">Listed by {listedBy}</p>
        </div>
      </div>
    </Link>
  );
};

export default CardHouse;
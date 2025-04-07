import { IHouse } from "@/lib/models/house.model";
import { Bath, Bed, Ruler } from "lucide-react";
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
  listedBy = "Admin",
}) => {
  console.log('CardHouse Props:', { _id, name, price, bedroom, bathroom, size, listedBy });
  return (
    <Link href={`/houses/${_id}`} className="block">
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        onClick={() => console.log(`Navigating to /houses/${_id}`)} // Debug navigation
      >
        <Image
          width={300}
          height={200}
          src="/c.jpg"
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
              <Bed size={18} />
              <span>{bedroom} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath size={18} />
              <span>{bathroom} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler size={18} />
              <span>{size.toLocaleString()} ft²</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Listed by {listedBy}</p>
        </div>
      </div>
    </Link>
  );
};

export default CardHouse;
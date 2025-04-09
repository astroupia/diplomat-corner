import { getAllCars } from "@/lib/actions/edit.car.action";
import { getAllHouses } from "@/lib/actions/edit.house.action";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Car as CarIcon, Home as HomeIcon } from "lucide-react";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

interface House {
  _id: string;
  name: string;
  currency: string;
  price: {
    toLocaleString: () => string;
  };
}

export default async function EditProductListPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Please log in to view your listings.</div>;
  }

  const carsResult = await getAllCars(userId);
  const housesResult = await getAllHouses(userId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {carsResult.success &&
          carsResult.data.map((car: { _id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; currency: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: { toLocaleString: () => string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; }) => (
            <Link key={car._id} href={`/edit-product/${car._id}`} className="block">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2">
                  <CarIcon size={18} />
                  <h2 className="text-lg font-semibold">{car.name}</h2>
                </div>
                <p className="text-green-600 text-xl font-bold">
                  {car.currency} {car.price.toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm mt-2">Click to edit</p>
              </div>
            </Link>
          ))}
        {housesResult.success &&
          housesResult.data.map((house: House) => (
            <Link key={house._id} href={`/edit-product/${house._id}`} className="block">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2">
            <HomeIcon size={18} />
            <h2 className="text-lg font-semibold">{house.name}</h2>
          </div>
          <p className="text-green-600 text-xl font-bold">
            {house.currency} {house.price.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm mt-2">Click to edit</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
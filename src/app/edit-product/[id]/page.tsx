import { getAllCars } from "@/lib/actions/edit.car.action";
import { getAllHouses } from "@/lib/actions/edit.house.action";
import EditProduct from "@/components/edit-product";
import { auth } from "@clerk/nextjs/server"; // For server-side auth

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { userId } = await auth(); // Get userId from Clerk on the server side

  if (!userId) {
    return <div>Please log in to edit your listings.</div>;
  }

  const carsResult = await getAllCars(userId);
  const housesResult = await getAllHouses(userId);

  const car = carsResult.success && carsResult.data.find((c: { _id: string; }) => c._id === id);
  const house = housesResult.success && housesResult.data.find((h: { _id: string; }) => h._id === id);

  if (!car && !house) {
    return <div>Listing not found or you are not authorized to edit it.</div>;
  }

  const initialData = car || house;
  const productType = car ? "Car" : "House";

  return <EditProduct initialData={initialData} productType={productType} />;
}
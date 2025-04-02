"use server";

import House, { IHouse } from "@/lib/models/house.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../db-connect";


export async function createHouse(formData: IHouse) {
  try {
    console.log("createHouse called with:", Object.fromEntries(formData)); 
    await connectToDatabase();
      const houseDetails: IHouse = {
      name: formData.name as string,
      userId: formData.userId as string,
      description: formData.description as string,
      advertisementType: formData.advertisementType as "Rent" | "Sale",
      price: Number(formData.price),
      paymentMethod: formData.paymentMethod as "Monthly" | "Quarterly" | "Annual",
      bedroom: Number(formData.bedroom),
      parkingSpace: Number(formData.parkingSpace),
      bathroom: Number(formData.bathroom),
      size: Number(formData.size),
      houseType: formData.houseType as "House" | "Apartment" | "Guest House",
    };
    console.log("House details prepared:", houseDetails); 

    const house = await new House(houseDetails).save();
    console.log("House saved to DB:", house); 
    return { success: true, house: toPlainObject(house) };
  } catch (error) {
    console.error("Error creating house:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteHouse(houseId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/houses?houseId=${houseId}`,
    {
      method: "DELETE",
    }
  );

  revalidatePath("/houses");
  return await response.json();
}

export async function updateHouseDetails(houseId: string, formData: FormData) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/houses`, {
    method: "PUT",
    body: JSON.stringify({
      id: houseId,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      advertisementType: formData.get("advertisementType") as "Rent" | "Sale",
      price: Number(formData.get("price")),
      paymentMethod: formData.get("paymentMethod") as "Monthly" | "Quarterly" | "Annual",
      bedroom: Number(formData.get("bedroom")),
      parkingSpace: Number(formData.get("parkingSpace")),
      bathroom: Number(formData.get("bathroom")),
      size: Number(formData.get("size")),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath("/houses");
  return await response.json();
}




const toPlainObject = (doc: any) => {
  return doc ? JSON.parse(JSON.stringify(doc)) : null;
};

// Server action to get all houses
export async function getAllHouse(): Promise<IHouse[]> {
  try {
    await connectToDatabase();
    const houses = await House.find({});
    console.log("Fetched houses:", houses);
    return houses;
  } catch (error) {
    console.error("Error fetching houses:", error);
    throw new Error(`Failed to fetch houses: ${(error as Error).message}`);
  }
}


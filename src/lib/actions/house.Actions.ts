"use server";

import { revalidatePath } from "next/cache";

export type House = {
  id: string;
  name: string;
  userId: string;
  description: string;
  advertisementType: "Rent" | "Sale";
  price: number;
  paymentMethod: "Monthly" | "Quarterly" | "Annual";
  bedroom: number;
  parkingSpace: number;
  bathroom: number;
  size: number;
  timestamp: string;
};

export async function createHouse(formData: FormData) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/houses`, {
    method: "POST",
    body: JSON.stringify({
      id: crypto.randomUUID(),
      name: formData.get("name") as string,
      userId: formData.get("userId") as string,
      description: formData.get("description") as string,
      advertisementType: "Rent",
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

export async function getHouseDetails(houseId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/houses?houseId=${houseId}`
  );
  return await response.json() as House;
}
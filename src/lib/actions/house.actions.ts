"use server";

import mongoose from "mongoose";
import House from "@/lib/models/house.model";

export interface HouseDetails {
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
  houseType: "House" | "Apartment" | "Guest House";
  timestamp?: string;
}

const toPlainObject = (doc: any) => {
  return doc ? JSON.parse(JSON.stringify(doc)) : null;
};

export async function createHouse(formData: FormData) {
  try {
    console.log("createHouse called with:", Object.fromEntries(formData)); // Debug
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB"); // Debug

    const houseDetails: HouseDetails = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      userId: formData.get("userId") as string,
      description: formData.get("description") as string,
      advertisementType: formData.get("advertisementType") as "Rent" | "Sale",
      price: Number(formData.get("price")),
      paymentMethod: formData.get("paymentMethod") as "Monthly" | "Quarterly" | "Annual",
      bedroom: Number(formData.get("bedroom")),
      parkingSpace: Number(formData.get("parkingSpace")),
      bathroom: Number(formData.get("bathroom")),
      size: Number(formData.get("size")),
      houseType: formData.get("houseType") as "House" | "Apartment" | "Guest House",
      timestamp: new Date().toISOString(),
    };
    console.log("House details prepared:", houseDetails); // Debug

    const house = await new House(houseDetails).save();
    console.log("House saved to DB:", house); // Debug
    return { success: true, house: toPlainObject(house) };
  } catch (error) {
    console.error("Error creating house:", error);
    return { success: false, error: (error as Error).message };
  }
}
"use server";

import { connectToDatabase } from "@/lib/db-connect"; // Adjust path to your DB connection
import House from "@/lib/models/edithouse.model"; // Adjust path to your House model

export async function getAllHouses(userId: string) {
  try {
    await connectToDatabase();
    const houses = await House.find({ userId }).lean();
    const housesJson = JSON.parse(JSON.stringify(houses));
    return { success: true, data: housesJson };
  } catch (error: any) {
    console.error("Error fetching houses:", error);
    return { success: false, error: error.message || "Failed to fetch houses" };
  }
}

export async function updateHouse(houseData: HouseData) {
  try {
    await connectToDatabase();
    const updatedHouse = await House.findByIdAndUpdate(houseData._id, houseData, { new: true });
    if (!updatedHouse) throw new Error("House not found");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Assuming this exists already for creating houses
export async function createHouse(houseData: HouseData) {
  try {
    await connectToDatabase();
    const newHouse = new House(houseData);
    await newHouse.save();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export interface HouseData {
  _id?: string;
  name: string;
  userId: string;
  bedroom: number;
  size: number;
  bathroom: number;
  condition: string;
  maintenance: string;
  price: number;
  description: string;
  advertisementType: string;
  paymentMethod: string;
  houseType: string;
  essentials: string[];
  currency: string;
}
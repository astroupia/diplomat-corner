import { NextResponse } from "next/server";
import mongoose from "mongoose";
import House from "@/lib/models/house.model";

export async function GET() {
  try {
    console.log("GET /api/houses called"); // Debug
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB"); // Debug
    const houses = await House.find({});
    console.log("Fetched houses:", houses); // Debug
    const plainHouses = houses.map((house) => ({
      id: house.id,
      name: house.name,
      userId: house.userId,
      description: house.description,
      advertisementType: house.advertisementType,
      price: house.price,
      paymentMethod: house.paymentMethod,
      bedroom: house.bedroom,
      parkingSpace: house.parkingSpace,
      bathroom: house.bathroom,
      size: house.size,
      houseType: house.houseType, // Added missing field
      timestamp: house.timestamp,
    }));
    return NextResponse.json(plainHouses, { status: 200 });
  } catch (error) {
    console.error("Error fetching houses:", error);
    return NextResponse.json(
      { error: `Failed to fetch houses: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
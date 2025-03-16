import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import Car, { ICar } from "@/lib/models/car.model";

export async function GET() {
  try {
    await connectToDatabase();
    const cars = await Car.find().sort({ Timestamp: -1 });
    const response = cars.map((car) => ({
      ...car.toObject(),
      _id: car._id.toString(), // Ensure _id is a string
    }));
    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars: " + (error as Error).message },
      { status: 500 }
    );
  }
}
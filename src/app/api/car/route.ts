import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Car from "../../../lib/models/car.model";
export async function GET() {
  try {
    await dbConnect(); // Ensure DB connection

    const cars = await Car.find({}); // Fetch all cars from MongoDB
    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    console.error(" Error fetching cars:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

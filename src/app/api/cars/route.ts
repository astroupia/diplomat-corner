import { connectToDatabase } from "@/lib/db-connect";
import Car from "@/lib/models/car.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const cars = await Car.find({});
    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function fetchCars() {
  try {
    const response = await fetch("/api/cars");
    if (!response.ok) {
      throw new Error(`Failed to fetch cars: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error; 
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newCar = new Car({
      ...body,
      timestamp: body.timestamp || new Date().toISOString(),
    });

    await newCar.save();
    return NextResponse.json(
      { message: "Car created successfully", car: newCar },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/cars:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
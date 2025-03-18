import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import Car, { ICar } from "@/lib/models/car.model";

export async function GET() {
  try {
    await connectToDatabase();
    const cars = await Car.find().sort({ Timestamp: -1 });
    const response = cars.map((car) => ({
      ...car.toObject(),
      _id: car._id.toString(),
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

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const carData = await request.json();
    const newCar = new Car({
      ...carData,
      Timestamp: new Date().toISOString(),
    });
    const savedCar = await newCar.save();
    return NextResponse.json({
      success: true,
      id: savedCar._id.toString(),
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create car: " + (error as Error).message },
      { status: 500 }
    );
  }
}
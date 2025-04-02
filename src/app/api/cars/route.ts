import { getAllCars } from "@/lib/actions/car.action";
import { connectToDatabase } from "@/lib/db-connect";
import Car from "@/lib/models/car.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cars = await getAllCars();
    console.log("Fetched cars:", cars);
    return NextResponse.json(cars, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error fetching cars:", err.message, err.stack);
    return NextResponse.json([], { status: 200 }); // Return empty array on error
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      name,
      userId,
      description,
      advertisementType,
      price,
      paymentMethod,
      mileage,
      speed,
      mpg,
      timestamp,
    } = body;

    if (!name || !userId || !description || !advertisementType || !price || !paymentMethod || !mileage || !speed || !mpg || !timestamp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["Rent", "Sale"].includes(advertisementType)) {
      return NextResponse.json(
        { error: "Invalid advertisementType. Must be 'Rent' or 'Sale'" },
        { status: 400 }
      );
    }

    const newCar = new Car({
      name,
      userId,
      description,
      advertisementType,
      price,
      paymentMethod,
      mileage,
      speed,
      mpg,
      timestamp,
    });

    await newCar.save();
    return NextResponse.json(
      { message: "Car created successfully", car: newCar },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Detailed error in POST /api/cars:", err.message, err.stack);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
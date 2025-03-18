import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import Car from "@/lib/models/car.model";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    console.log(`API: Fetching car with ID: ${params.id}`);

    const car = await Car.findById(params.id);
    if (!car) {
      console.log(`API: Car not found for ID: ${params.id}`);
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const carData = {
      _id: car._id.toString(),
      Name: car.Name,
      Price: car.Price,
      Mileage: car.Mileage,
      MilesPerGallon: car.MilesPerGallon,
      Speed: car.Speed,
      Description: car.Description,
    };
    console.log("API: Returning car data:", carData);
    return NextResponse.json(carData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown server error";
    console.error(`API Error for /api/carpurchase/${params.id}:`, errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
// app/api/houses/route.ts
import { NextResponse } from "next/server";
import { getAllHouse } from "@/lib/actions/house.actions";
import House from "@/lib/models/house.model";
import { useUser } from "@clerk/nextjs";

export async function GET() {
  try {
    console.log("GET /api/houses called");
    const houses = await getAllHouse();
    return NextResponse.json(houses, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/houses:", error);
    return NextResponse.json(
      { error: `Failed to fetch houses: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("POST /api/houses called with body:", body);
    const { name, userId, description, advertisementType, price, paymentMethod, bedroom, parkingSpace, bathroom, size, houseType } = body;

    if (!name || !userId || !description || !advertisementType || !price || !paymentMethod || !bedroom || !parkingSpace || !bathroom || !size || !houseType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newHouse = new House({
      name,
      userId,
      description,
      advertisementType,
      price,
      paymentMethod,
      bedroom,
      parkingSpace,
      bathroom,
      size,
      houseType
    });

    await newHouse.save();
    return NextResponse.json(newHouse, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/houses:", error);
    return NextResponse.json(
      { error: `Failed to create house: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
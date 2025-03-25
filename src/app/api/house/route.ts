import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect"; 
import House, { IHouse } from "@/lib/models/house.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const houseDetails = await request.json();
    
    const house = new House({
      id: houseDetails.id,
      name: houseDetails.name,
      userId: houseDetails.userId,
      description: houseDetails.description,
      advertisementType: houseDetails.advertisementType,
      price: Number(houseDetails.price),
      paymentMethod: houseDetails.paymentMethod,
      bedroom: Number(houseDetails.bedroom),
      parkingSpace: Number(houseDetails.parkingSpace),
      bathroom: Number(houseDetails.bathroom),
      size: Number(houseDetails.size),
      timestamp: new Date().toISOString(),
    });

    const savedHouse = await house.save();
    return NextResponse.json(savedHouse, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create house" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const houseId = searchParams.get("houseId");

    if (!houseId) {
      const houses = await House.find();
      return NextResponse.json(houses);
    }

    const house = await House.findOne({ id: houseId });
    if (!house) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    return NextResponse.json(house);
  } catch (error) {
    return NextResponse.json({ error: "Failed to get house" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const houseDetails = await request.json();
    const houseId = houseDetails.id;

    const updatedHouse = await House.findOneAndUpdate(
      { id: houseId },
      {
        name: houseDetails.name,
        description: houseDetails.description,
        advertisementType: houseDetails.advertisementType,
        price: Number(houseDetails.price),
        paymentMethod: houseDetails.paymentMethod,
        bedroom: Number(houseDetails.bedroom),
        parkingSpace: Number(houseDetails.parkingSpace),
        bathroom: Number(houseDetails.bathroom),
        size: Number(houseDetails.size),
      },
      { new: true }
    );

    if (!updatedHouse) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    return NextResponse.json(updatedHouse);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update house" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const houseId = searchParams.get("houseId");

    if (!houseId) {
      return NextResponse.json({ error: "House ID is required" }, { status: 400 });
    }

    const deletedHouse = await House.findOneAndDelete({ id: houseId });
    if (!deletedHouse) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "House deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete house" }, { status: 500 });
  }
}
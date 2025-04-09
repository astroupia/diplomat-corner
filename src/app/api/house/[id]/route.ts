import { NextRequest, NextResponse } from "next/server";
import { getHouseById } from "@/lib/actions/house.actions";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Extract the ID from the path

    if (!id) {
      return NextResponse.json({ error: "Missing house ID" }, { status: 400 });
    }

    const house = await getHouseById(id);

    if (!house) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    return NextResponse.json(house);
  } catch (error) {
    console.error("Error fetching house:", error);
    return NextResponse.json({ error: "Failed to fetch house" }, { status: 500 });
  }
}

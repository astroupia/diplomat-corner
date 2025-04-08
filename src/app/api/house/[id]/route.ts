import { NextResponse } from "next/server";
import { getHouseById } from "@/lib/actions/house.actions";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const house = await getHouseById(params.id);
    if (!house) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }
    return NextResponse.json(house);
  } catch (error) {
    console.error("Error fetching house:", error);
    return NextResponse.json({ error: "Failed to fetch house" }, { status: 500 });
  }
}
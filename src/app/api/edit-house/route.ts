import { NextResponse } from "next/server";
import { getAllHouses } from "@/lib/actions/edit.house.action";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 });
  }

  const result = await getAllHouses(userId);
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
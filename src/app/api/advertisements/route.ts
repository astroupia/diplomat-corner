// /app/api/advertisements/[id]/route.ts
import { connectToDatabase } from "@/lib/db-connect";
import Advertisement from "@/lib/models/advertisement.model";
import { NextRequest, NextResponse } from "next/server";

interface AdvertisementResponse {
  id: string;
  title: string;
  description: string;
  targetAudience?: string | null;
  advertisementType: string;
  startTime?: string | null;
  endTime?: string | null;
  status: "Active" | "Inactive" | "Scheduled" | "Expired";
  priority: "High" | "Medium" | "Low";
  performanceMetrics?: string | null;
  hashtags: string[];
  timestamp: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectToDatabase();

  const ad = await Advertisement.findOne({ id: params.id });
  if (!ad) return NextResponse.json({ error: "Ad not found" }, { status: 404 });

  // Convert to plain object
  const plainAd: AdvertisementResponse = {
    id: ad.id,
    title: ad.title,
    description: ad.description,
    targetAudience: ad.targetAudience || null,
    advertisementType: ad.advertisementType,
    startTime: ad.startTime || null,
    endTime: ad.endTime || null,
    status: ad.status,
    priority: ad.priority,
    performanceMetrics: ad.performanceMetrics || null,
    hashtags: ad.hashtags,
    timestamp: ad.timestamp,
  };

  return NextResponse.json(plainAd);
}
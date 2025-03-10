"use server";

import { connectToDatabase } from "@/lib/db-connect";
import Advertisement, { IAdvertisement } from "@/lib/models/advertisement.model";

export async function createAdvertisement(adDetails: Partial<IAdvertisement>) {
  await connectToDatabase();

  const advertisement = new Advertisement({
    ...adDetails,
    timestamp: new Date().toISOString(),
  });

  await advertisement.save();
  return { success: true, id: advertisement._id.toString() }; // Convert ObjectId to string
}

export async function updateAdvertisement(adId: string, updatedDetails: Partial<IAdvertisement>) {
  await connectToDatabase();

  const advertisement = await Advertisement.findById(adId);
  if (!advertisement) {
    throw new Error("Advertisement not found");
  }

  if (advertisement.status === "Inactive") {
    throw new Error("Cannot edit an inactive advertisement");
  }

  await Advertisement.findByIdAndUpdate(adId, updatedDetails);
  return { success: true };
}

export async function deleteAdvertisement(adId: string) {
  await connectToDatabase();

  await Advertisement.findByIdAndDelete(adId);
  return { success: true };
}

export async function getAdvertisementDetails(adId: string) {
  await connectToDatabase();

  const advertisement = await Advertisement.findById(adId);
  if (!advertisement) {
    throw new Error("Advertisement not found");
  }

  // Convert the entire document to a plain object and ensure _id is a string
  return {
    ...advertisement.toObject(),
    _id: advertisement._id.toString(),
  };
}

export async function listAllAdvertisements() {
  await connectToDatabase();

  const advertisements = await Advertisement.find();
  // Convert all documents to plain objects and ensure _id is a string
  return advertisements.map((ad) => ({
    ...ad.toObject(),
    _id: ad._id.toString(),
  }));
}

export async function scheduleAdvertisement(
  adDetails: Partial<IAdvertisement>,
  startTime: string,
  endTime: string
) {
  await connectToDatabase();

  const advertisement = new Advertisement({
    ...adDetails,
    startTime,
    endTime,
    status: "Scheduled",
    timestamp: new Date().toISOString(),
  });

  await advertisement.save();
  return { success: true, id: advertisement._id.toString() }; // Convert ObjectId to string
}

export async function setAdvertisementPriority(adId: string, priority: "High" | "Medium" | "Low") {
  await connectToDatabase();

  await Advertisement.findByIdAndUpdate(adId, { priority });
  return { success: true };
}

export async function activateAdvertisement(adId: string) {
  await connectToDatabase();

  await Advertisement.findByIdAndUpdate(adId, { status: "Active" });
  return { success: true };
}

export async function deactivateAdvertisement(adId: string) {
  await connectToDatabase();

  await Advertisement.findByIdAndUpdate(adId, { status: "Inactive" });
  return { success: true };
}

export async function getAdvertisementPerformance(adId: string) {
  await connectToDatabase();

  const advertisement = await Advertisement.findById(adId);
  if (!advertisement) {
    throw new Error("Advertisement not found");
  }

  return advertisement.performanceMetrics || "No metrics available";
}
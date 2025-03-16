"use server";

import { connectToDatabase } from "@/lib/db-connect";
import Purchase, { IPurchase } from "@/lib/models/carpurchase.model";

// Handle a purchase: save to MongoDB and send a notification
export async function createPurchase(
  userId: string,
  sellerId: string,
  carDetails: IPurchase["carDetails"]
) {
  await connectToDatabase();

  const purchase = new Purchase({
    userId,
    sellerId,
    carDetails,
    timestamp: new Date().toISOString(),
  });

  try {
    await purchase.save();

    // Send notification to the seller via the API route
    const notificationResponse = await fetch("http://localhost:3000/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: sellerId,
        message: `A customer has purchased your car: ${carDetails.make} ${carDetails.model} (${carDetails.year}) for $${carDetails.price.toLocaleString()}`,
        type: "Order",
      }),
    });

    const notificationResult = await notificationResponse.json();
    if (!notificationResponse.ok) {
      throw new Error(notificationResult.error || "Failed to send notification");
    }

    return { success: true, purchaseId: purchase._id.toString() };
  } catch (error) {
    throw new Error(`Failed to process purchase: ${(error as Error).message}`);
  }
}
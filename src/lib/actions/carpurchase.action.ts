"use server";
import { connectToDatabase } from "@/lib/db-connect";
import Purchase, { IPurchase } from "@/lib/models/carpurchase.model";

interface CarPurchaseData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  mpg: number;
  topSpeed: number;
}

export async function createPurchase(
  userId: string,
  sellerId: string,
  carData: CarPurchaseData
): Promise<{ purchaseId: string }> {
  try {
    await connectToDatabase();
    console.log(`Creating purchase for user: ${userId}, car: ${carData.make} ${carData.model}`);

    const purchase = new Purchase({
      userId,
      sellerId,
      carDetails: {
        make: carData.make,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        mileage: carData.mileage,
        mpg: carData.mpg,
        topSpeed: carData.topSpeed,
      },
    });

    const savedPurchase = await purchase.save();
    console.log("Purchase saved:", savedPurchase);

    return { purchaseId: savedPurchase._id.toString() };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating purchase:", errorMessage);
    throw new Error(`Failed to create purchase: ${errorMessage}`);
  }
}
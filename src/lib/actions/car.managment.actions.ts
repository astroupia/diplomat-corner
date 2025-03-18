"use server";

import { connectToDatabase } from "@/lib/db-connect";
import Car from "@/lib/models/car.model";

interface CarFormData {
  brandName: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  fuel: string;
  bodyType: string;
  condition: string;
  engine: string;
  maintenance: string;
  price: number;
  currency: string;
  tags: string;
  description: string;
}

export async function createCar(formData: CarFormData) {
  try {
    await connectToDatabase();

    const newCar = new Car({
      Name: `${formData.brandName} ${formData.model}`, // Combine brandName and model
      UserId: "admin", // Hard-coded for now; replace with actual user ID in production
      Description: formData.description || `${formData.condition} ${formData.bodyType} with ${formData.engine}`,
      AdvertisementType: "Sale", // Default value
      Price: formData.price,
      PaymentMethod: 1, // Default value (e.g., 1 for cash); adjust as needed
      Mileage: formData.mileage,
      Speed: 0, // Default; extend form if this should be user-input
      MilesPerGallon: 0, // Default; extend form if this should be user-input
      Timestamp: new Date().toISOString(), // Always set server-side
    });

    const savedCar = await newCar.save();
    return {
      success: true,
      message: "Car saved successfully",
      id: savedCar._id.toString(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in createCar:", errorMessage);
    return {
      success: false,
      message: `Failed to save car: ${errorMessage}`,
    };
  }
}
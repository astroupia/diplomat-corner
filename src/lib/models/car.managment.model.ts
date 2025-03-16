// lib/actions/car.managment.actions.ts
"use server";

import { connectToDatabase } from "@/lib/db-connect";
import Car from "@/lib/models/car.model"; // Use car.model.ts

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
      Name: `${formData.brandName} ${formData.model}`,
      UserId: "admin", // Replace with actual user ID in production
      Description: formData.description || `${formData.condition} ${formData.bodyType} with ${formData.engine}`,
      AdvertisementType: "Sale",
      Price: formData.price,
      PaymentMethod: 1, // Default; adjust as needed
      Mileage: formData.mileage,
      Speed: 0, // Placeholder; extend form if needed
      MilesPerGallon: 0, // Placeholder; extend form if needed
      Timestamp: new Date().toISOString(),
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
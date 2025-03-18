"use server";

import { connectToDatabase } from "@/lib/db-connect"; // Adjust path if needed
import carModel from "@/lib/models/car.model";

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

export async function createCar(formData: CarFormData): Promise<{
  success: boolean;
  message: string;
  id?: string;
}> {
  console.log("Server Action 'createCar' invoked with data:", formData);

  try {
    // Connect to the database
    const connection = await connectToDatabase();
    console.log("Database connection established:", connection.connection.readyState);

    // Create and save the car
    const newCar = new carModel(formData);
    const savedCar = await newCar.save();
    console.log("Car saved successfully with ID:", savedCar._id);

    return {
      success: true,
      message: "Car saved successfully",
      id: savedCar._id.toString(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in createCar:", errorMessage, error);
    return {
      success: false,
      message: `Failed to save car: ${errorMessage}`,
    };
  }
}
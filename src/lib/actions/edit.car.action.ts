"use server";

import { connectToDatabase } from "@/lib/db-connect"; // Adjust path to your DB connection
import Car from "@/lib/models/car.model"; // Adjust path to your Car model

export async function getAllCars(userId: string) {
  try {
    await connectToDatabase();
    const cars = await Car.find({ userId }).lean();
    const carsJson = JSON.parse(JSON.stringify(cars));
    return { success: true, data: carsJson };
  } catch (error: any) {
    console.error("Error fetching cars:", error);
    return { success: false, error: error.message || "Failed to fetch cars" };
  }
}

// Define or import the ICar interface
interface ICar {
  _id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  [key: string]: any; // Add additional fields as needed
}

export async function updateCar(carData: ICar) {
  try {
    await connectToDatabase();
    const updatedCar = await Car.findByIdAndUpdate(carData._id, carData, { new: true });
    if (!updatedCar) throw new Error("Car not found");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Assuming this exists already for creating cars
export async function createCar(carData: Partial<ICar>) {
  try {
    await connectToDatabase();
    const newCar = new Car(carData);
    await newCar.save();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
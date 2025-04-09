// lib/models/editcar.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICar extends Document {
  _id: string;
  name: string;
  userId: string;
  description?: string;
  advertisementType: "Sale" | "Rent";
  price: number;
  paymentMethod: number;
  mileage: number;
  speed: number;
  milesPerGallon: number;
  timestamp: string;
  year?: number;
  transmission: "Automatic" | "Manual";
  fuel: "Gasoline" | "Diesel" | "Electric";
  bodyType: "Truck" | "SUV" | "Sedan" | "Hatchback" | "Minivan";
  condition?: string;
  engine?: string;
  maintenance?: string;
  currency: "ETB" | "USD";
  tags?: string;
  make: string; 
  parkingSpace: 0, // Added missing property
  paymentId: "", // Added missing property
  visiblity: "Public", // Updated to match the expected type
  status: "Available", // Added missing property
        }
}

const carSchema: Schema<ICar> = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  description: { type: String },
  advertisementType: { type: String, default: "Sale" },
  price: { type: Number, required: true },
  paymentMethod: { type: Number, default: 1 },
  mileage: { type: Number, required: true },
  speed: { type: Number, default: 0 },
  milesPerGallon: { type: Number, default: 0 },
  timestamp: { type: String, default: () => new Date().toISOString() },
  year: { type: Number },
  transmission: { type: String, default: "Automatic" },
  fuel: { type: String, default: "Gasoline" },
  bodyType: { type: String, default: "Truck" },
  condition: { type: String },
  engine: { type: String },
  maintenance: { type: String },
  currency: { type: String, default: "ETB" },
  tags: { type: String },
  make: { type: String, required: true }, // Added to schema
});

const Car: Model<ICar> = mongoose.models.Car || mongoose.model<ICar>("Car", carSchema);
export default Car;
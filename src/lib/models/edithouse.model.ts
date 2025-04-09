// lib/models/house.model.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IHouse extends Document {
  _id: string; 
  name: string;
  userId: string;
  bedroom: number;
  size: number;
  bathroom: number;
  condition?: string; 
  maintenance?: string; 
  price: number;
  description?: string; 
  advertisementType: "Rent" | "Sale";
  paymentMethod: "Monthly" | "Quarterly" | "Annual";
  houseType: "House" | "Apartment" | "Guest House";
  essentials: string[];
  currency: "ETB" | "USD";
}

const houseSchema: Schema<IHouse> = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  bedroom: { type: Number, required: true },
  size: { type: Number, required: true },
  bathroom: { type: Number, required: true },
  condition: { type: String },
  maintenance: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
  advertisementType: { type: String, default: "Rent" },
  paymentMethod: { type: String, default: "Monthly" },
  houseType: { type: String, default: "House" },
  essentials: { type: [String], default: [] },
  currency: { type: String, default: "ETB" },
});

const House: Model<IHouse> = mongoose.models.House || mongoose.model<IHouse>("House", houseSchema);
export default House;
import mongoose, { Schema } from "mongoose";

export interface IHouse {
  _id: string;
  name: string;
  description: string; 
  advertisementType: string;
  price: number;
  paymentMethod: "Monthly" | "Quarterly" | "Annual";
  bedroom: number;
  parkingSpace: number;
  bathroom: number;
  size: number;
  houseType: "House" | "Apartment" | "Guest House";
  condition: string; 
  maintenance: string; 
  essentials: string[]; 
  currency: string;
  imageUrl?: string; // Added imageUrl field
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const houseSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  description: { type: String, required: true },
  advertisementType: { type: String, required: true, enum: ["Rent", "Sale"] },
  price: { type: Number, required: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Monthly", "Quarterly", "Annual"],
  },
  bedroom: { type: Number, required: true },
  parkingSpace: { type: Number, required: true },
  bathroom: { type: Number, required: true },
  size: { type: Number, required: true },
  houseType: { 
    type: String,
    required: true,
    enum: ["House", "Apartment", "Guest House"],
  },
  condition: { type: String }, 
  maintenance: { type: String }, 
  essentials: { type: [String] }, 
  currency: { type: String },
  imageUrl: { type: String }, // Added to store the public URL
}, { timestamps: true });

export default mongoose.models.House || mongoose.model<IHouse>("House", houseSchema);
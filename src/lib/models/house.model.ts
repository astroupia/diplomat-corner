// lib/models/house.model.ts
import mongoose, { Schema } from "mongoose";

export interface IHouse {
  price: number;
  paymentMethod: "Monthly" | "Quarterly" | "Annual";
  bedroom: number;
  parkingSpace: number;
  bathroom: number;
  size: number;
  houseType: "House" | "Apartment" | "Guest House";
}

const houseSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true},
  description: { type: String, required: true },
  advertisementType: { type: String, required: true, enum: ["Rent", "Sale"] },
  price: { type: Number, required: true },
  paymentMethod: {
    type: String,
    required: true,
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
}, { timestamps: true });


export default mongoose.models.House || mongoose.model<IHouse>("House", houseSchema);


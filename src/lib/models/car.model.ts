import mongoose, { Schema, Document } from "mongoose";

export interface ICar extends Document {
  _id: string; // Explicitly define _id as a string
  Name: string;
  UserId: string;
  Description: string;
  AdvertisementType: "Rent" | "Sale";
  Price: number;
  PaymentMethod: number;
  Mileage: number;
  Speed: number;
  MilesPerGallon: number;
  Timestamp: string;
}

const CarSchema: Schema = new Schema({
  Name: { type: String, required: true },
  UserId: { type: String, required: true },
  Description: { type: String, required: true },
  AdvertisementType: {
    type: String,
    required: true,
    enum: ["Rent", "Sale"],
  },
  Price: { type: Number, required: true },
  PaymentMethod: { type: Number, required: true },
  Mileage: { type: Number, required: true },
  Speed: { type: Number, required: true },
  MilesPerGallon: { type: Number, required: true },
  Timestamp: { type: String, required: true },
});

export default mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);
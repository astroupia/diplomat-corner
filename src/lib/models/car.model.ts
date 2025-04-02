import mongoose, { Document, Schema } from "mongoose";

export interface ICar extends Document {
  _id: string; 
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
  name: { type: String, required: true },
  userId: { type: String, required: true },
  description: { type: String, required: true },
  advertisementType: {
    type: String,
    required: true,
    enum: ["Rent", "Sale"],
  },
  price: { type: Number, required: true },
  paymentMethod: { type: Number, required: true },
  mileage: { type: Number, required: true },
  speed: { type: Number, required: true },
  milesPerGallon: { type: Number, required: true },
  timestamp: { type: String, required: true },
});

export default mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);
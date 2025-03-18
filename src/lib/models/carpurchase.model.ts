import mongoose, { Schema, Document } from "mongoose";

export interface IPurchase extends Document {
  userId: string; // Buyer ID
  sellerId: string; // Seller ID
  carDetails: {
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    mpg: number;
    topSpeed: number;
  };
  timestamp: string;
}

const PurchaseSchema: Schema = new Schema({
  userId: { type: String, required: true },
  sellerId: { type: String, required: true },
  carDetails: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    mileage: { type: Number, required: true },
    mpg: { type: Number, required: true },
    topSpeed: { type: Number, required: true },
  },
  timestamp: { type: String, required: true, default: () => new Date().toISOString() },
});

export default mongoose.models.Purchase || mongoose.model<IPurchase>("Purchase", PurchaseSchema);
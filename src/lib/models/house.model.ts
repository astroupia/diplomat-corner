import mongoose, { Schema, Document } from "mongoose";

export interface IHouse extends Document {
  id: string;
  name: string;
  userId: string;
  description: string;
  advertisementType: "Rent" | "Sale";
  price: number;
  location: string;
  timestamp: string;
}

const HouseSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userId: { type: String, required: true },
  description: { type: String, required: true },
  advertisementType: { type: String, required: true, enum: ["Rent", "Sale"] },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  timestamp: { type: String, required: true },
});

// Add text index for search functionality
HouseSchema.index({ name: "text", description: "text" });

export default mongoose.models.House || mongoose.model<IHouse>("House", HouseSchema,"House");
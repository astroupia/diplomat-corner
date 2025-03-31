// lib/models/house.model.ts
import mongoose, { Schema } from "mongoose";

const houseSchema = new Schema({
  id: { type: String, required: true, unique: true },
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
  houseType: { // New field
    type: String,
    required: true,
    enum: ["House", "Apartment", "Guest House"],
  },
  timestamp: { type: String, required: true, default: () => new Date().toISOString() },
});

const House = mongoose.models.House || mongoose.model("House", houseSchema);
export default House;
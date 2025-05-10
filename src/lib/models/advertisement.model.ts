import mongoose, { Schema, Document } from "mongoose";

export interface IAdvertisement extends Document {
  title: string;
  description: string;
  targetAudience?: string;
  advertisementType: string;
  startTime?: string;
  endTime?: string;
  status: "Active" | "Inactive" | "Scheduled" | "Expired";
  priority: "High" | "Medium" | "Low";
  performanceMetrics?: string;
  hashtags?: string[];
  timestamp: string;
}

const AdvertisementSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  targetAudience: { type: String, required: false },
  advertisementType: { type: String, required: true },
  startTime: { type: String, required: false },
  endTime: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Inactive", "Scheduled", "Expired"],
  },
  priority: { type: String, required: true, enum: ["High", "Medium", "Low"] },
  performanceMetrics: { type: String, required: false },
  hashtags: { type: [String], required: false },
  timestamp: { type: String, required: true },
});

export default mongoose.models.Advertisement ||
  mongoose.model<IAdvertisement>("Advertisement", AdvertisementSchema);
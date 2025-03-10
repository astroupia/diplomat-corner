import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  message: string;
  type: "Order" | "Promotion" | "Payment" | "Delivery" | "System";
  readStatus: boolean;
  timestamp: string;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["Order", "Promotion", "Payment", "Delivery", "System"],
  },
  readStatus: { type: Boolean, required: true, default: false },
  timestamp: { type: String, required: true },
});

// Ensure the _id is used as the unique identifier
NotificationSchema.index({ _id: 1 }, { unique: true });

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
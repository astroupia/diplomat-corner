import mongoose, { Schema, model, models, Document } from "mongoose";

export type NotificationType =
  | "message"
  | "alert"
  | "update"
  | "system"
  | "security";
export type NotificationCategory = "car" | "house" | "account" | "system";

export interface INotification extends Document {
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  category?: NotificationCategory;
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["message", "alert", "update", "system", "security"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    category: {
      type: String,
      enum: ["car", "house", "account", "system"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default models.Notification ||
  model<INotification>("Notification", NotificationSchema);

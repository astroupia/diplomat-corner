import mongoose, { Schema, model, models, Document } from "mongoose";

export type NotificationType =
  | "message"
  | "alert"
  | "update"
  | "system"
  | "security"
  | "request"
  | "approval";
export type NotificationCategory = "car" | "house" | "account" | "system";

export interface INotification extends Document {
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  productType?: "Car" | "House";
  category?: NotificationCategory;
  userId: string;
  pushSubscription?: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: [
        "message",
        "alert",
        "update",
        "system",
        "security",
        "request",
        "approval",
      ],
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
      type: String,
      ref: "User",
      required: true,
    },
    productType: {
      type: String,
      enum: ["Car", "House"],
    },
    pushSubscription: {
      endpoint: String,
      keys: {
        p256dh: String,
        auth: String,
      },
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default models.Notification ||
  model<INotification>("Notification", NotificationSchema);

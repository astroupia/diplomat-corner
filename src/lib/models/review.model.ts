import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IReview extends Document {
  userId: string;
  targetUserId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  likes: number;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    targetUserId: {
      type: String,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    productId: { type: String, required: true },
    comment: {
      type: String,
      default: "",
    },
    likes: {
      type: Number,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.Review || model<IReview>("Review", ReviewSchema);

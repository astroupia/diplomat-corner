import mongoose, { Schema, Document } from 'mongoose';

interface ICar extends Document {
  id: string;
  name: string;
  userId: string;
  description: string;
  advertisementType: 'Rent' | 'Sale';
  price: number;
  paymentMethod: number;
  mileage: number;
  speed: number;
  mpg: number;
  timestamp: string;
}

const CarSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userId: { type: String, required: true },
  description: { type: String, required: true },
  advertisementType: { type: String, required: true, enum: ['Rent', 'Sale'] },
  price: { type: Number, required: true },
  paymentMethod: { type: Number, required: true },
  mileage: { type: Number, required: true },
  speed: { type: Number, required: true },
  mpg: { type: Number, required: true },
  timestamp: { type: String, required: true },
});

export default mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);

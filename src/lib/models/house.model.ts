import mongoose, { Schema, Document } from 'mongoose';

export interface IHouse extends Document {
  id: string;
  name: string;
  userId: string;
  description: string;
  advertisementType: 'Rent' | 'Sale';
  price: number;
  paymentMethod: 'Monthly' | 'Quarterly' | 'Annual';
  bedroom: number;
  parkingSpace: number;
  bathroom: number;
  size: number;
  timestamp: string;
}

const HouseSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userId: { type: String, required: true },
  description: { type: String, required: true },
  advertisementType: { 
    type: String, 
    required: true, 
    enum: ['Rent', 'Sale'] 
  },
  price: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    required: true, 
    enum: ['Monthly', 'Quarterly', 'Annual'] 
  },
  bedroom: { type: Number, required: true },
  parkingSpace: { type: Number, required: true },
  bathroom: { type: Number, required: true },
  size: { type: Number, required: true },
  timestamp: { type: String, required: true },
}, {
  collection: 'houses'
});

export default mongoose.models.House || mongoose.model<IHouse>('House', HouseSchema);
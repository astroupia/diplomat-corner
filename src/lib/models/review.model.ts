import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {  // Changed from IContact to IReview
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: 'General Inquiry' | 'Advert has errors' | 'Want admin';
  message: string;
  createdAt: Date;
  status: 'pending' | 'processed' | 'rejected';
}

const ReviewSchema: Schema = new Schema<IReview>({  // Changed from ContactSchema
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    trim: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  phone: { type: String, required: true, trim: true, minlength: 8 },
  subject: { 
    type: String, 
    enum: ['General Inquiry', 'Advert has errors', 'Want admin'], 
    required: true 
  },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'processed', 'rejected'], 
    default: 'pending' 
  },
});

ReviewSchema.index({ email: 1 });
ReviewSchema.index({ createdAt: -1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
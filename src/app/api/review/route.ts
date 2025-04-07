import { connectToDatabase } from '@/lib/db-connect';
import Review from '@/lib/models/review.model';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema for validation
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  subject: z.enum(['General Inquiry', 'Advert has errors', 'Want admin']),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received');
    await connectToDatabase();
    console.log('Database connection established');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const validatedData = contactSchema.parse(body);
    console.log('Validated data:', validatedData);
    
    const contact = new Review(validatedData);  // Using Review as per your clarification
    const savedContact = await contact.save();
    console.log('Saved document:', savedContact);
    
    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      id: savedContact._id,
    }, { status: 201 });
  } catch (error) {
    console.error('Error details:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      }, { status: 400 });
    }
    if (error instanceof mongoose.Error) {
      return NextResponse.json({
        success: false,
        message: 'Database error occurred',
        error: error.message,
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}
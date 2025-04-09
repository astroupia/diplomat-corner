'use server';

import { connectToDatabase } from '@/lib/db-connect';
import Review from '@/lib/models/review.model';
import mongoose from 'mongoose';
import { z } from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  subject: z.enum(['General Inquiry', 'Advert has errors', 'Want admin']),
  message: z.string().min(1, 'Message is required'),
});

export async function submitContactForm(formData: FormData) {
  const data = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
  };

  try {
    await connectToDatabase();
    const validatedData = contactSchema.parse(data);
    const contact = new Review(validatedData);
    const savedContact = await contact.save();

    return {
      success: true,
      message: 'Contact form submitted successfully',
      id: savedContact._id.toString(),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      };
    }
    if (error instanceof mongoose.Error) {
      return {
        success: false,
        message: 'Database error occurred',
        error: error.message,
      };
    }
    console.error('Error in server action:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
  }
}
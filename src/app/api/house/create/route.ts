import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db-connect';
import House, { IHouse } from '@/lib/models/house.model';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid'; // For generating random filenames

const CPANEL_API_URL = 'https://diplomatcorner.net:2083';
const CPANEL_USERNAME = 'diplomvv';
const CPANEL_API_TOKEN = '2JL5W3RUMNY0KOX451GL2PPY4L8RX9RS';
const PUBLIC_DOMAIN = 'https://diplomatcorner.net';

interface HouseFormData {
  name: string;
  bedroom: number;
  size: number;
  bathroom: number;
  parkingSpace: number; // Added parkingSpace
  condition: string;
  maintenance: string;
  price: number;
  description: string;
  advertisementType: 'Rent' | 'Sale';
  paymentMethod: 'Monthly' | 'Quarterly' | 'Annual';
  houseType: 'House' | 'Apartment' | 'Guest House';
  essentials: string[];
  currency: string;
  imageUrl?: string;
  userId?: string;
  createdAt?: Date;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  houseId?: string;
}

async function uploadImage(file: File): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  // Generate a random filename with original extension
  const extension = file.name.split('.').pop();
  const randomFileName = `${uuidv4()}.${extension}`;
  
  const apiFormData = new FormData();
  apiFormData.append('dir', '/public_html/public_images/');
  apiFormData.append('file-1', file, randomFileName);

  const authHeader = `cpanel ${CPANEL_USERNAME}:${CPANEL_API_TOKEN.trim()}`;

  try {
    const response = await fetch(`${CPANEL_API_URL}/execute/Fileman/upload_files`, {
      method: 'POST',
      headers: { Authorization: authHeader },
      body: apiFormData,
    });

    const data = await response.json();
    
    if (data.status === 0) {
      return { success: false, error: data.errors?.join(', ') || 'Upload failed' };
    }

    const uploadedFile = data.data?.uploads[0];
    if (!uploadedFile || !uploadedFile.file) {
      return { success: false, error: 'No uploaded file details returned' };
    }

    const publicUrl = `${PUBLIC_DOMAIN}/public_images/${uploadedFile.file}`;
    return { success: true, publicUrl };
  } catch (error) {
    console.error('Image upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Verify user authentication
    const userId  = (await auth()).userId;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const houseData: HouseFormData = {
      name: formData.get('name') as string,
      bedroom: Number(formData.get('bedroom')),
      size: Number(formData.get('size')),
      bathroom: Number(formData.get('bathroom')),
      parkingSpace: Number(formData.get('parkingSpace')), // Added parkingSpace
      condition: formData.get('condition') as string,
      maintenance: formData.get('maintenance') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      advertisementType: formData.get('advertisementType') as 'Rent' | 'Sale',
      paymentMethod: formData.get('paymentMethod') as 'Monthly' | 'Quarterly' | 'Annual',
      houseType: formData.get('houseType') as 'House' | 'Apartment' | 'Guest House',
      essentials: JSON.parse(formData.get('essentials') as string),
      currency: formData.get('currency') as string,
      userId,
      createdAt: new Date(),
    };

    // Validate required fields
    if (!houseData.name || !houseData.bedroom || !houseData.size || 
        !houseData.bathroom || !houseData.parkingSpace || !houseData.price || 
        !houseData.description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Upload image if provided
    let imageUrl: string | undefined;
    if (file) {
      const uploadResult = await uploadImage(file);
      if (!uploadResult.success) {
        return NextResponse.json({ success: false, error: uploadResult.error }, { status: 500 });
      }
      imageUrl = uploadResult.publicUrl;
    }

    // Save house with image URL
    const houseToSave = new House({ ...houseData, imageUrl });
    const result = await houseToSave.save();

    return NextResponse.json({
      success: true,
      message: 'House created successfully',
      houseId: result._id.toString(),
    });

  } catch (error) {
    console.error('House creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create house' },
      { status: 500 }
    );
  }
}
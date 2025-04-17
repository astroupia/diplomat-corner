import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import Message from "@/models/message.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "phone", "subject", "message"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Create the message
    const message = await Message.create(body);
    
    return NextResponse.json(
      { success: true, message: "Message sent successfully", data: message },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to send message", 
        errors: error.errors ? Object.values(error.errors).map((err: any) => ({ 
          field: err.path, 
          message: err.message 
        })) : undefined 
      },
      { status: 500 }
    );
  }
} 
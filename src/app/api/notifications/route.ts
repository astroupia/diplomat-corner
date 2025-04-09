import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import Notification from "@/lib/models/notification.model";

export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });
    const response = notifications.map((notification) => ({
      ...notification.toObject(),
      _id: notification._id.toString(),
    }));
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notifications: " + (error as Error).message },
      { status: 500 }
    );
  }
}

// POST to create a new notification
export async function POST(request: Request) {
  await connectToDatabase();
  const { userId, message, type } = await request.json();

  if (!userId || !message || !type) {
    return NextResponse.json(
      { error: "userId, message, and type are required" },
      { status: 400 }
    );
  }

  if (!["Order", "Promotion", "Payment", "Delivery", "System"].includes(type)) {
    return NextResponse.json({ error: "Invalid type value" }, { status: 400 });
  }

  const notification = new Notification({
    userId,
    message,
    type,
    readStatus: false,
    timestamp: new Date().toISOString(),
  });

  // Retry logic: attempt to save the notification up to 3 times
  let attempts = 0;
  const maxAttempts = 3;
  while (attempts < maxAttempts) {
    try {
      await notification.save();
      return NextResponse.json(
        { success: true, id: notification._id.toString() },
        { status: 201 }
      );
    } catch (error) {
      attempts++;
      if (attempts === maxAttempts) {
        return NextResponse.json(
          {
            error: `Failed to create notification after ${maxAttempts} attempts: ${(error as Error).message}`,
          },
          { status: 500 }
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// PUT to mark a notification as read
export async function PUT(request: Request) {
  await connectToDatabase();
  const { notificationId } = await request.json();

  if (!notificationId) {
    return NextResponse.json({ error: "notificationId is required" }, { status: 400 });
  }

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    await Notification.findByIdAndUpdate(notificationId, { readStatus: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update notification: " + (error as Error).message },
      { status: 500 }
    );
  }
}
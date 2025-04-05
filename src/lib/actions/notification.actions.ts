"use server";

import { connectToDatabase } from "@/lib/db-connect";
import Notification from "@/lib/models/notification.model";

export async function createNotification(
  userId: string,
  message: string,
  type: "Order" | "Promotion" | "Payment" | "Delivery" | "System"
) {
  await connectToDatabase();

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
      return { success: true, id: notification._id.toString() };
    } catch (error) {
      attempts++;
      if (attempts === maxAttempts) {
        throw new Error(`Failed to create notification after ${maxAttempts} attempts: ${(error as Error).message}`);
      }
      // Wait 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// Get all notifications for a user (seller)
export async function getUserNotifications(userId: string) {
  await connectToDatabase();

  const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });
  return notifications.map((notification) => ({
    ...notification.toObject(),
    _id: notification._id.toString(),
  }));
}

// Mark a notification as read
export async function markNotificationAsRead(notificationId: string) {
  await connectToDatabase();

  await Notification.findByIdAndUpdate(notificationId, { readStatus: true });
  return { success: true };
}
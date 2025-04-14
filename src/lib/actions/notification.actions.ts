"use server";

export async function sendNotification({
  userId,
  message,
  type,
  origin,
}: {
  userId: string;
  message: string;
  type: string;
  origin: string;
}) {
  try {
    const response = await fetch(`${origin}/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, message, type }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to send notification: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(`Failed to send notification: ${data.error}`);
    }

    return data.id; // Return the notification ID
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return null;
  }
}
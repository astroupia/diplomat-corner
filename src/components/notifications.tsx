"use client";
import { useState, useEffect } from "react";
import { getUserNotifications, markNotificationAsRead } from "@/lib/actions/notification.actions";
import { Bell, CheckCircle, Circle } from "lucide-react";

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: "Order" | "Promotion" | "Payment" | "Delivery" | "System";
  readStatus: boolean;
  timestamp: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock userId for the seller (in a real app, this would come from authentication)
  const userId = "seller123";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const fetchedNotifications = await getUserNotifications(userId);
        setNotifications(fetchedNotifications);
      } catch (err) {
        setError("Failed to load notifications: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, readStatus: true }
            : notification
        )
      );
    } catch (err) {
      setError("Failed to mark notification as read: " + (err as Error).message);
    }
  };

  return (
    <div className="p-6 bg-secondary min-h-screen text-primary">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell size={24} /> Notifications
      </h1>

      {loading && <p className="text-gray-600">Loading notifications...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && notifications.length === 0 && (
        <p className="text-gray-600">No notifications available.</p>
      )}

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 rounded-lg border-2 border-primary flex justify-between items-center ${
              notification.readStatus ? "bg-white" : "bg-yellow-100"
            }`}
          >
            <div>
              <p className="font-semibold">{notification.type} Notification</p>
              <p>{notification.message}</p>
              <p className="text-sm text-gray-600">
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleMarkAsRead(notification._id)}
              disabled={notification.readStatus}
              className={`p-2 rounded-full ${
                notification.readStatus
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {notification.readStatus ? (
                <CheckCircle size={20} />
              ) : (
                <Circle size={20} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import {
  Bell,
  Car,
  Check,
  ChevronDown,
  Clock,
  Home,
  Info,
  MessageSquare,
  Settings,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-react";

// Define notification types
type NotificationType = "message" | "alert" | "update" | "system" | "security" | "Order";

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: NotificationType;
  readStatus: boolean;
  timestamp: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [expandedNotification, setExpandedNotification] = useState<
    string | null
  >(null);
  const { userId } = useAuth();

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        if (!userId) {
          console.log("User not logged in");
          setLoading(false);
          return;
        }
        const response = await fetch(`/api/notifications?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch notifications: ${response.status}`);
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.readStatus;
    return notification.type === activeFilter;
  });

  // Mark notification as read
  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === id
          ? { ...notification, readStatus: true }
          : notification
      )
    );

    // Update read status on the server
    await fetch("/api/notifications", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationId: id }),
    });
  };

  // Mark all as read
  const markAllAsRead = () => {
    filteredNotifications.forEach((notification) => {
      markAsRead(notification._id);
    });
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== id)
    );
  };

  // Toggle expanded notification
  const toggleExpanded = (id: string) => {
    if (expandedNotification === id) {
      setExpandedNotification(null);
    } else {
      setExpandedNotification(id);
      markAsRead(id);
    }
  };

  // Get unread count
  const unreadCount = notifications.filter(
    (notification) => !notification.readStatus
  ).length;

  // Get icon for notification type
  const getNotificationIcon = (type: NotificationType, category?: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5" />;
      case "alert":
        return category === "car" ? (
          <Car className="h-5 w-5" />
        ) : (
          <Home className="h-5 w-5" />
        );
      case "update":
        return <Info className="h-5 w-5" />;
      case "system":
        return <Settings className="h-5 w-5" />;
      case "security":
        return <ShieldAlert className="h-5 w-5" />;
      case "Order":
        return <Bell className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-5 pb-16">
      <div className="container mx-auto px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">
                Stay updated with the latest activity and important alerts from
                Diplomat Corner.
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:text-primary hover:border-primary/50 transition-colors shadow-sm"
              >
                <Check className="h-4 w-4" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All
              {activeFilter === "all" && notifications.length > 0 && (
                <span className="ml-2 bg-white text-primary rounded-full px-2 py-0.5 text-xs">
                  {notifications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveFilter("unread")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "unread"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    activeFilter === "unread"
                      ? "bg-white text-primary"
                      : "bg-primary text-white"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveFilter("car")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "car"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span className="flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Cars
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("house")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "house"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Properties
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("account")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "account"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Account
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("Order")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "Order"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Orders
              </span>
            </button>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {activeFilter === "all"
                  ? "You don't have any notifications at the moment."
                  : `You don't have any ${
                      activeFilter === "unread" ? "unread" : activeFilter
                    } notifications at the moment.`}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <motion.li
                      key={notification._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`relative ${
                        notification.readStatus ? "" : "bg-primary/5"
                      }`}
                    >
                      <div
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => toggleExpanded(notification._id)}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-2 rounded-full ${
                              notification.readStatus
                                ? "bg-gray-100"
                                : "bg-primary/10"
                            }`}
                          >
                            <span
                              className={
                                notification.readStatus
                                  ? "text-gray-500"
                                  : "text-primary"
                              }
                            >
                              {getNotificationIcon(
                                notification.type,
                                notification.type
                              )}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h3
                                className={`text-sm font-medium ${
                                  notification.readStatus
                                    ? "text-gray-700"
                                    : "text-gray-900"
                                }`}
                              >
                                {notification.message}
                              </h3>
                              <div className="flex items-center ml-4">
                                <span className="text-xs text-gray-500 whitespace-nowrap flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {notification.timestamp}
                                </span>
                                <ChevronDown
                                  className={`h-4 w-4 ml-2 text-gray-400 transition-transform ${
                                    expandedNotification === notification._id
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {expandedNotification === notification._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-6 pb-4 pt-0"
                          >
                            <div className="ml-12">
                              <p className="text-sm text-gray-600 mb-4">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                {/* {notification.link ? (
                                  <a
                                    href={notification.link}
                                    className="text-sm text-primary hover:text-primary/80 font-medium"
                                  >
                                    View Details
                                  </a>
                                ) : (
                                  <div></div>
                                )} */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification._id);
                                  }}
                                  className="text-sm text-gray-500 hover:text-red-500 flex items-center"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

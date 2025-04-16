"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Star, ThumbsUp, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { INotification } from "@/types/notifications";

interface Review {
  _id: string;
  userId: string;
  targetUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: string[]; // Array of user IDs who liked the review
  user?: {
    firstName: string;
    lastName: string;
  };
}

interface ReviewsSectionProps {
  productId: string;
  productType: "car" | "house";
  sellerId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  productType,
  sellerId,
}) => {
  const { userId } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newReview.rating) return;

    setIsSubmitting(true);
    try {
      // Submit review
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newReview,
          productId,
          targetUserId: sellerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const reviewData = await response.json();
      setReviews([reviewData, ...reviews]);
      setNewReview({ rating: 0, comment: "" });

      // Send notification to seller
      const sellerSubscriptionResponse = await fetch(
        `/api/notifications?userId=${sellerId}`
      );
      const sellerSubscription = await sellerSubscriptionResponse.json();

      const sellerNotificationResponse = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: sellerId,
          title: "New Review Received",
          message: `A new review has been posted for your ${productType}.\n\nRating: ${newReview.rating}/5\nMessage: ${newReview.comment}`,
          type: "update",
          category: productType,
          link: `/${productType}/${productId}`,
          pushSubscription: sellerSubscription.pushSubscription,
        }),
      });

      if (!sellerNotificationResponse.ok) {
        const errorData = await sellerNotificationResponse.json();
        console.error(
          "Failed to send notification to seller:",
          errorData.error
        );
      } else {
        // If notification was created successfully, send push notification
        const notificationData = await sellerNotificationResponse.json();
        if (sellerSubscription.pushSubscription) {
          try {
            await fetch(sellerSubscription.pushSubscription.endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `vapid ${process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY}`,
              },
              body: JSON.stringify({
                title: "New Review Received",
                body: `A new review has been posted for your ${productType}`,
                icon: "/icon.png",
                badge: "/badge.png",
                data: {
                  url: `/${productType}/${productId}`,
                  notificationId: notificationData._id,
                },
              }),
            });
          } catch (error) {
            console.error("Failed to send push notification to seller:", error);
          }
        }
      }

      // Send notification to reviewer
      const reviewerSubscriptionResponse = await fetch(
        `/api/notifications?userId=${userId}`
      );
      const reviewerSubscription = await reviewerSubscriptionResponse.json();

      const reviewerNotificationResponse = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          title: "Review Submitted Successfully",
          message: `Your review has been successfully submitted for the ${productType}.\n\nRating: ${newReview.rating}/5\nMessage: ${newReview.comment}`,
          type: "update",
          category: productType,
          link: `/${productType}/${productId}`,
          pushSubscription: reviewerSubscription.pushSubscription,
        }),
      });

      if (!reviewerNotificationResponse.ok) {
        const errorData = await reviewerNotificationResponse.json();
        console.error(
          "Failed to send notification to reviewer:",
          errorData.error
        );
      } else {
        // If notification was created successfully, send push notification
        const notificationData = await reviewerNotificationResponse.json();
        if (reviewerSubscription.pushSubscription) {
          try {
            await fetch(reviewerSubscription.pushSubscription.endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `vapid ${process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY}`,
              },
              body: JSON.stringify({
                title: "Review Submitted Successfully",
                body: `Your review has been submitted for the ${productType}`,
                icon: "/icon.png",
                badge: "/badge.png",
                data: {
                  url: `/${productType}/${productId}`,
                  notificationId: notificationData._id,
                },
              }),
            });
          } catch (error) {
            console.error(
              "Failed to send push notification to reviewer:",
              error
            );
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit review";
      setError(errorMessage);
      console.error("Review submission error:", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to like review");

      const data = await response.json();

      if (data.success) {
        setReviews(
          reviews.map((review) =>
            review._id === reviewId
              ? {
                  ...review,
                  likes: data.data.likes,
                }
              : review
          )
        );
      }
    } catch (err) {
      console.error("Error liking review:", err);
      setError(err instanceof Error ? err.message : "Failed to like review");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete review");
      }

      // Remove the deleted review from the state
      setReviews(reviews.filter((review) => review._id !== reviewId));

      // Send notification to seller about review deletion
      const sellerNotificationResponse = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: sellerId,
          title: "Review Deleted",
          message: `A review has been deleted from your ${productType}.`,
          type: "update",
          category: productType,
          link: `/${productType}/${productId}`,
        }),
      });

      if (!sellerNotificationResponse.ok) {
        const errorData = await sellerNotificationResponse.json();
        console.error(
          "Failed to send notification to seller:",
          errorData.error
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete review";
      setError(errorMessage);
      console.error("Review deletion error:", errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-5">
      {reviews.length > 0 && userId && (
        <h2 className="text-2xl font-semibold text-gray-900">Reviews</h2>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {review.user?.firstName?.[0] || "U"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.user?.firstName} {review.user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {userId === review.userId && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-4 text-gray-700">{review.comment}</p>

              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={() => handleLike(review._id)}
                  className={`flex items-center gap-1 transition-colors ${
                    review.likes.includes(userId || "")
                      ? "text-primary"
                      : "text-gray-500 hover:text-primary"
                  }`}
                >
                  <ThumbsUp
                    className={`w-4 h-4 ${
                      review.likes.includes(userId || "") ? "fill-current" : ""
                    }`}
                  />
                  <span className="text-sm">{review.likes.length || 0}</span>
                </button>
                {/* <button className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Reply</span>
                </button> */}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8">
        {userId ? (
          <h2 className="text-2xl font-semibold text-gray-900">
            Leave a Review
          </h2>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Sign In to Leave a Review
            </h2>
            <Link
              href="/sign-in"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {userId && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newReview.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Share your experience..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !newReview.rating}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </motion.form>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}
    </div>
  );
};

export default ReviewsSection;

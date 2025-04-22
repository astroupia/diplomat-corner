"use client";

import { useState } from "react";
import {
  Star,
  ThumbsUp,
  MoreHorizontal,
  Trash2,
  Flag,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface ReviewCardProps {
  review: {
    _id: string;
    userId: string;
    userName: string;
    userImage?: string;
    rating: number;
    comment: string;
    createdAt: Date;
    likes: string[];
    isOwn?: boolean;
  };
  onLike: (id: string) => void;
  onDelete?: (id: string) => void;
  currentUserId?: string;
}

export default function ReviewCard({
  review,
  onLike,
  onDelete,
  currentUserId,
}: ReviewCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(
    currentUserId ? review.likes.includes(currentUserId) : false
  );
  const likesCount =
    review.likes.length +
    (liked && !review.likes.includes(currentUserId || "") ? 1 : 0);

  const handleLike = () => {
    if (!liked && currentUserId) {
      setLiked(true);
      onLike(review._id);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center text-green-700 font-medium">
            {review.userImage ? (
              <Image
                src={review.userImage || "/placeholder.svg"}
                alt={review.userName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              review.userName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="ml-3">
            <h4 className="font-medium text-gray-900">{review.userName}</h4>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-2 flex items-center">
                <Clock size={12} className="mr-1" />
                {timeAgo}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>

          {showOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-8 bg-white shadow-lg rounded-lg py-2 w-36 z-10 border border-gray-100"
            >
              {review.isOwn && onDelete && (
                <button
                  onClick={() => {
                    onDelete(review._id);
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </button>
              )}
              <button
                onClick={() => setShowOptions(false)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Flag size={14} className="mr-2" />
                Report
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <p className="text-gray-700 my-3 text-sm leading-relaxed">
        {review.comment}
      </p>

      <div className="flex items-center justify-end">
        <button
          onClick={handleLike}
          disabled={!currentUserId || liked}
          className={`flex items-center text-sm ${
            liked ? "text-green-600" : "text-gray-500 hover:text-green-600"
          } transition-colors ${
            !currentUserId || liked ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <ThumbsUp size={14} className="mr-1" />
          <span>{likesCount}</span>
        </button>
      </div>
    </motion.div>
  );
}

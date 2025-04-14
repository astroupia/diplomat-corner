"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, LockIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PermissionDeniedScreenProps {
  message?: string;
  showRequestAccess?: boolean;
  onRequestAccess?: () => void;
  title?: string;
}

const PermissionDeniedScreen: React.FC<PermissionDeniedScreenProps> = ({
  message = "You do not have permission to access this page.",
  showRequestAccess = false,
  onRequestAccess,
  title = "Access Denied",
}) => {
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const shieldVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="relative w-full max-w-md mx-auto px-6">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"
            animate={{
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -10, 0],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* Main content */}
        <motion.div
          className="relative z-10 bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Shield icon with animation */}
          <motion.div
            className="flex justify-center mb-6"
            variants={shieldVariants}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-yellow-100 rounded-full p-4">
                <ShieldAlert className="h-16 w-16 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          {/* Lock animation */}
          <motion.div
            className="absolute top-6 right-6"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              repeatDelay: 3,
            }}
          >
            <LockIcon className="h-6 w-6 text-yellow-500/50" />
          </motion.div>

          {/* Title and message */}
          <motion.h1
            className="text-2xl font-bold text-center text-yellow-600 mb-3"
            variants={itemVariants}
          >
            {title}
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-center mb-8"
            variants={itemVariants}
          >
            {message}
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="group flex items-center gap-2 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </Button>

            {showRequestAccess && onRequestAccess && (
              <Button
                onClick={onRequestAccess}
                className="bg-yellow-600 hover:bg-yellow-700 text-white group flex items-center gap-2 transition-all duration-300"
              >
                <span>Request Access</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PermissionDeniedScreen;

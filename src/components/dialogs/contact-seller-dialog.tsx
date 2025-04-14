"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { X, Phone, MessageSquare, Send, Loader2, CheckCircle } from "lucide-react"

interface ContactSellerDialogProps {
  isOpen: boolean
  onClose: () => void
  productType?: "car" | "house" | "item" // Add more types as needed
  sellerName?: string
}

export default function ContactSellerDialog({
  isOpen,
  onClose,
  productType = "item",
  sellerName = "the seller",
}: ContactSellerDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get userId from auth
  const { userId } = useAuth()

  // Get productId from URL params
  const params = useParams()
  const productId = params.id as string

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber("")
      setDescription("")
      setIsSubmitted(false)
      setError(null)
    }
  }, [isOpen])

  // Phone number validation
  const validatePhoneNumber = (phone: string) => {
    // Basic validation - can be enhanced based on requirements
    return phone.length >= 10
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number")
      return
    }

    if (!description.trim()) {
      setError("Please enter a message")
      return
    }

    if (!userId) {
      setError("You must be logged in to contact sellers")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // This would be replaced with your actual API call
      console.log("Submitting contact request:", {
        userId,
        productId,
        phoneNumber,
        description,
        productType,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      setIsSubmitted(true)

      // Auto close after success (optional)
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (err) {
      console.error("Error submitting contact request:", err)
      setError("Failed to send your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get product type specific details
  const getProductDetails = () => {
    switch (productType) {
      case "car":
        return {
          title: "Contact About This Vehicle",
          icon: "🚗",
        }
      case "house":
        return {
          title: "Contact About This Property",
          icon: "🏠",
        }
      default:
        return {
          title: "Contact Seller",
          icon: "📦",
        }
    }
  }

  const details = getProductDetails()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            <div className="p-6">
              {isSubmitted ? (
                /* Success state */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center py-6"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    Your message has been sent to {sellerName}. They will contact you soon at the phone number you
                    provided.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                /* Form state */
                <>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-3">
                      <span className="text-2xl">{details.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{details.title}</h3>
                    <p className="text-gray-600 mt-1">Send your contact information to {sellerName}</p>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder="+1 (555) 123-4567"
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 pointer-events-none">
                            <MessageSquare className="h-5 w-5 text-gray-400" />
                          </div>
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder={`I'm interested in this ${productType}. Please contact me.`}
                            rows={4}
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    By sending this message, you agree to share your contact information with the seller.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

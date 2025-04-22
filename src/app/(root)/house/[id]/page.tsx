"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Bed,
  Bath,
  Ruler,
  Car,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  BadgeCheck,
  Home,
} from "lucide-react";
import ContactSellerDialog from "@/components/dialogs/contact-seller-dialog";
import HouseDetailLoadingSkeleton from "@/components/loading-effects/id-loading-house";
import ReviewsSection from "@/components/reviews/reviews-section";
import { motion } from "framer-motion";

interface House {
  _id: string;
  name: string;
  advertisementType: string;
  currency: string;
  price: number;
  imageUrl?: string;
  bedroom: number;
  bathroom: number;
  size: number;
  parkingSpace: number;
  description: string;
  paymentMethod: string;
  houseType: string;
  condition: string;
  maintenance: string;
  essentials: string[];
  userId: string;
}

export default function HouseDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await fetch(`/api/house/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHouse(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchHouse();
  }, [id]);

  if (loading) {
    return <HouseDetailLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-gray-600 text-lg">Property not found</p>
      </div>
    );
  }
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div className="container mx-auto px-4 py-5 max-w-6xl">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-700 hover:text-green-600 mb-8 text-sm font-medium transition-colors duration-200"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Houses
      </button>

      <div className="lg:flex lg:space-x-12">
        <div className="lg:w-2/3">
          <Image
            src={house.imageUrl || "/c.jpg"}
            alt={house.name}
            width={800}
            height={400}
            className="w-full h-auto object-cover rounded-md mb-8"
            priority
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">{house.description}</p>
          </div>

          {/* Reviews Section */}
          <ReviewsSection
            productId={id}
            productType="house"
            sellerId={house.userId}
          />
        </div>

        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {house.name}
            </h1>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                house.advertisementType === "Rent"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              For {house.advertisementType}
            </span>
          </div>
          <p className="text-2xl text-green-600 font-semibold mb-6">
            {house.currency} {house.price.toLocaleString()}
          </p>

          {/* Payment Method Section - only show for Rent */}
          {house.advertisementType === "Rent" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Clock className="mr-2 text-blue-500" size={20} />
                Rental Information
              </h3>

              <div className="grid grid-cols-1 gap-3">
                <motion.div
                  className="flex items-center p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Calendar className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Schedule</p>
                    <p className="font-medium text-gray-800">
                      {house.paymentMethod}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <DollarSign className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rental Rate</p>
                    <p className="font-medium text-gray-800">
                      {house.currency} {house.price.toLocaleString()} per{" "}
                      {house.paymentMethod === "Monthly"
                        ? "month"
                        : house.paymentMethod === "Quarterly"
                        ? "quarter"
                        : house.paymentMethod === "Annual"
                        ? "year"
                        : "payment term"}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Home className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="font-medium text-gray-800">
                      {house.houseType}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-4 text-gray-700 mb-8">
            <div className="flex items-center gap-2">
              <Bed size={18} className="text-gray-500" />
              <span className="text-sm">{house.bedroom} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath size={18} className="text-gray-500" />
              <span className="text-sm">{house.bathroom} Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler size={18} className="text-gray-500" />
              <span className="text-sm">{house.size.toLocaleString()} ft²</span>
            </div>
            <div className="flex items-center gap-2">
              <Car size={18} className="text-gray-500" />
              <span className="text-sm">{house.parkingSpace} Parking</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Details
            </h2>
            <div className="space-y-3 text-gray-700">
              {/* Only show Payment Method for sale ads in this section */}
              {house.advertisementType === "Sale" && (
                <p>
                  <strong className="font-medium">Payment Method:</strong>{" "}
                  {house.paymentMethod}
                </p>
              )}
              <p>
                <strong className="font-medium">House Type:</strong>{" "}
                {house.houseType}
              </p>
              {house.condition && (
                <p>
                  <strong className="font-medium">Condition:</strong>{" "}
                  {house.condition}
                </p>
              )}
              {house.maintenance && (
                <p>
                  <strong className="font-medium">Maintenance:</strong>{" "}
                  {house.maintenance}
                </p>
              )}
              {house.essentials && house.essentials.length > 0 && (
                <p>
                  <strong className="font-medium">Essentials:</strong>{" "}
                  {house.essentials.join(", ")}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={openDialog}
            className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-primary/80 transition-colors duration-200"
          >
            Inquire Now
          </button>
          <ContactSellerDialog
            isOpen={isDialogOpen}
            onClose={closeDialog}
            productType="house"
            sellerName="the seller"
          />
        </div>
      </div>
    </div>
  );
}

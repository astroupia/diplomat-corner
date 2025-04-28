"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  CarFront,
  GaugeCircle,
  Fuel,
  Settings,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  BadgeCheck,
} from "lucide-react";
import type { ICar } from "@/lib/models/car.model";
import ContactSellerDialog from "@/components/dialogs/contact-seller-dialog";
import CarDetailLoadingSkeleton from "@/components/loading-effects/id-loading-car";
import ReviewsSection from "@/components/reviews/reviews-section";
import { motion } from "framer-motion";

const paymentMethodLabels: Record<string, string> = {
  Daily: "Daily",
  Weekly: "Weekly",
  Monthly: "Monthly",
  Annually: "Annually",
};

export default function CarDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id as string;
  const [car, setCar] = useState<ICar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCar(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCar();
  }, [id]);

  if (loading) {
    return <CarDetailLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-gray-600 text-lg">Car not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-5 max-w-6xl">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-700 hover:text-green-600 mb-8 text-sm font-medium transition-colors duration-200"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Cars
      </button>

      {/* Desktop: Side-by-side layout, Mobile: Stacked layout with specific order */}
      <div className="block lg:flex lg:space-x-12">
        {/* Left Column on Desktop / First + Third on Mobile */}
        <div className="lg:w-2/3">
          {/* 1. Picture - First on both desktop and mobile */}
          <Image
            src={car.imageUrl || "/car.jpg"}
            alt={car.name}
            width={800}
            height={400}
            className="w-full h-auto object-cover rounded-md mb-8"
            priority
          />

          {/* 3. Description - Visible only on desktop here, third on mobile (see below) */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">{car.description}</p>
          </div>

          {/* 4. Reviews - Visible only on desktop here, fourth on mobile (see below) */}
          <div className="hidden lg:block">
            <ReviewsSection
              productId={id}
              productType="car"
              sellerId={car.userId}
            />
          </div>
        </div>

        {/* Right Column on Desktop / Second on Mobile */}
        <div className="lg:w-1/3 mt-8 lg:mt-0 order-2">
          <div className="mb-4">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {car.name}
              </h1>
              <div className="flex-shrink-0 ml-2">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    car.advertisementType === "Rent"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  For {car.advertisementType}
                </span>
              </div>
            </div>
          </div>

          <p className="text-2xl text-green-600 font-semibold mb-6">
            {car.currency} {car.price.toLocaleString()}
          </p>

          {car.advertisementType === "Rent" && (
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
                      {paymentMethodLabels[car.paymentMethod] ||
                        "One-time Payment"}
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
                      {car.currency} {car.price.toLocaleString()} per{" "}
                      {paymentMethodLabels[car.paymentMethod]?.toLowerCase() ||
                        "day"}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <BadgeCheck className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className="font-medium text-gray-800">Available Now</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-4 text-gray-700 mb-8">
            <div className="flex items-center gap-2">
              <GaugeCircle size={18} className="text-gray-500" />
              <span className="text-sm">{car.speed} Mph</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel size={18} className="text-gray-500" />
              <span className="text-sm">{car.milesPerGallon} MPG</span>
            </div>
            <div className="flex items-center gap-2">
              <CarFront size={18} className="text-gray-500" />
              <span className="text-sm">{car.mileage.toLocaleString()} Km</span>
            </div>
            {car.year > 0 && (
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-gray-500" />
                <span className="text-sm">Year {car.year}</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {car.engine && (
                <motion.div
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <GaugeCircle className="text-gray-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Engine</p>
                    <p className="font-medium text-gray-800 break-words">
                      {car.engine}
                    </p>
                  </div>
                </motion.div>
              )}
              {car.transmission && (
                <motion.div
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <Settings className="text-gray-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-medium text-gray-800 break-words">
                      {car.transmission}
                    </p>
                  </div>
                </motion.div>
              )}
              {car.fuel && (
                <motion.div
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <Fuel className="text-gray-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium text-gray-800 break-words">
                      {car.fuel}
                    </p>
                  </div>
                </motion.div>
              )}
              {car.bodyType && (
                <motion.div
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <CarFront className="text-gray-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Body Type</p>
                    <p className="font-medium text-gray-800 break-words">
                      {car.bodyType}
                    </p>
                  </div>
                </motion.div>
              )}
              {car.condition && (
                <motion.div
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <BadgeCheck className="text-gray-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-medium text-gray-800 break-words">
                      {car.condition}
                    </p>
                  </div>
                </motion.div>
              )}
              {car.maintenance && (
                <motion.div
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <Clock className="text-gray-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Maintenance</p>
                    <p className="font-medium text-gray-800 break-words">
                      {car.maintenance}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsDialogOpen(true)}
            className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-primary/80 transition-colors duration-200"
          >
            Inquire Now
          </button>
          {/* Contact Seller Dialog */}
          <ContactSellerDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            productType="car"
            sellerName="the seller"
          />
        </div>
      </div>

      {/* Mobile-only sections for correct ordering */}
      <div className="lg:hidden mt-8">
        {/* 3. Description - Third on mobile */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Description
          </h2>
          <p className="text-gray-600 leading-relaxed">{car.description}</p>
        </div>

        {/* 4. Reviews - Fourth on mobile */}
        <ReviewsSection
          productId={id}
          productType="car"
          sellerId={car.userId}
        />
      </div>
    </div>
  );
}

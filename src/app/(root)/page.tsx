"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Image from "next/image";
import Link from "next/link";
import { images } from "@/public/assets/images";
import { type products, getProduct } from "@/public/assets/data/products";
import {
  ChevronDown,
  Plus,
  Star,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShoppingBag,
  Heart,
  HomeIcon,
  Shield,
  Users,
  Globe,
  Check,
  Clock,
  Zap,
} from "lucide-react";
import { useCallback } from "react";

// Dynamic Advertisement Component
const AdvertPlaceholder = ({
  className,
  size = "medium",
}: {
  className?: string;
  size?: "small" | "medium" | "large" | "banner";
}) => {
  const sizeClasses = {
    small: "h-[200px]",
    medium: "h-[300px]",
    large: "h-[420px]",
    banner: "h-[330px]",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 ${sizeClasses[size]} ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-primary font-medium">Advertisement Space</div>
          <div className="text-gray-500 text-sm mt-1">{size} format</div>
        </div>
      </div>
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  // Move state and effect outside of the render function
  const [showCar, setShowCar] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCar((prev) => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-2 sm:pt-3 md:pt-4">
      <MaxWidthWrapper className="px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 sm:gap-6">
          {/* Left Column - Advertisement Space */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-sm group">
              <Image
                width={800}
                height={420}
                src={images.air.src || "/placeholder.svg"}
                alt={images.air.alt}
                className="w-full h-[320px] sm:h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
                <span className="bg-primary/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                  Featured Ad
                </span>
                <h3 className="text-white text-xl sm:text-2xl font-bold mt-2 mb-2 sm:mb-3">
                  Ethiopian Airlines
                </h3>
                <p className="text-white/90 text-xs sm:text-sm mb-3 sm:mb-4 max-w-md">
                  Discover the world with Ethiopian Airlines. Special offers on
                  international flights.
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md hover:bg-white transition-colors duration-300 text-sm"
                >
                  Learn More
                  <ChevronDown
                    size={16}
                    className="text-white w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-primary"
                  />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-sm group">
                <Image
                  width={400}
                  height={200}
                  src={images.awash.src || "/placeholder.svg"}
                  alt={images.awash.alt}
                  className="w-full h-[150px] sm:h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3 sm:p-4 w-full">
                  <Link
                    href="https://awashbank.com/"
                    target="_blank"
                    className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-primary px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm shadow-md hover:bg-white transition-colors duration-300"
                  >
                    #Awash_Bank
                  </Link>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-sm group">
                <Image
                  width={400}
                  height={200}
                  src={images.dashen.src || "/placeholder.svg"}
                  alt={images.dashen.alt}
                  className="w-full h-[150px] sm:h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3 sm:p-4 w-full">
                  <Link
                    href="https://www.dashensuperapp.com/"
                    target="_blank"
                    className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-primary px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm shadow-md hover:bg-white transition-colors duration-300"
                  >
                    #Dashen_SuperApp
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Shop Now Feature */}
          <div className="lg:col-span-5 mt-4 lg:mt-0">
            <div className="relative h-[420px] sm:h-[500px] lg:h-full overflow-hidden rounded-xl sm:rounded-2xl shadow-sm group">
              {/* Alternating content - fixed implementation */}
              <div
                className={`transition-opacity duration-500 absolute inset-0 ${
                  showCar ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  width={600}
                  height={650}
                  src={images.car.src || "/placeholder.svg"}
                  alt={images.car.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div
                className={`transition-opacity duration-500 absolute inset-0 ${
                  showCar ? "opacity-0" : "opacity-100"
                }`}
              >
                <Image
                  width={600}
                  height={650}
                  src={images.building.src || "/placeholder.svg"}
                  alt="Luxury House"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <Link
                    href="#"
                    className="text-white hover:text-primary group-hover:text-primary relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-transparent backdrop-blur-sm rounded-full shadow-lg border-2 border-white/80 group-hover:bg-white hover:bg-primary transition-colors duration-300"
                  >
                    <div className="text-center">
                      <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
                      <span className="text-[10px] sm:text-xs font-medium mt-1">
                        Shop Now
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </div>

              {/* Alternating text content - fixed implementation */}
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 justify-between">
                <div>
                  <span className="bg-primary/90 text-white text-xs px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm">
                    New Arrival
                  </span>
                  <h3 className="text-white text-lg sm:text-xl font-bold mt-1 sm:mt-2">
                    {showCar ? "Premium Vehicles" : "Luxury Properties"}
                  </h3>
                  <p className="text-white/90 text-xs sm:text-sm">
                    {showCar
                      ? "Explore our collection of luxury cars"
                      : "Discover exclusive houses"}
                  </p>
                </div>

                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Link
                    href={showCar ? "/car" : "/house"}
                    className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-primary px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm shadow-md hover:bg-white transition-colors duration-300"
                  >
                    Learn More
                    <ChevronDown
                      size={14}
                      className="text-white w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-primary"
                    />
                  </Link>
                  <Link
                    href={
                      showCar ? "manage-product/car" : "manage-product/house"
                    }
                    className="inline-flex items-center gap-1 bg-primary/80 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm shadow-md hover:bg-primary transition-colors duration-300"
                  >
                    Add {showCar ? "Car" : "Property"}
                    <Plus
                      size={14}
                      className="text-primary w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-white"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

// Featured Products Carousel
const FeaturedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Create arrays of keys for the featured products section
  const featuredImageKeys = [
    "air",
    "air2",
    "building",
    "cash",
    "car",
    "half",
    "women",
  ];
  const productKeys = [
    "house1",
    "car1",
    "house2",
    "car2",
    "car3",
    "house1",
    "car1",
  ];

  const totalProducts = Math.min(featuredImageKeys.length, productKeys.length);
  const productsPerView = { mobile: 1, tablet: 2, desktop: 4 };

  // Determine how many products to show based on screen size
  const [itemsToShow, setItemsToShow] = useState(productsPerView.desktop);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(productsPerView.mobile);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(productsPerView.tablet);
      } else {
        setItemsToShow(productsPerView.desktop);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [productsPerView.desktop, productsPerView.mobile, productsPerView.tablet]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsToShow >= totalProducts ? 0 : prevIndex + 1
    );
  }, [itemsToShow, totalProducts]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, totalProducts - itemsToShow) : prevIndex - 1
    );
  };

  // Auto-scroll when not hovering
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovering, currentIndex, itemsToShow, totalProducts, nextSlide]);

  return (
    <section className="py-4 sm:py-5 md:py-6 bg-gray-50/50">
      <MaxWidthWrapper className="px-2 sm:px-4">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Discover our most popular items
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-1.5 sm:p-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-colors"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-1.5 sm:p-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-colors"
              aria-label="Next products"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          ref={carouselRef}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            }}
          >
            {featuredImageKeys.map((imageKey, index) => {
              const productKey = productKeys[index] as keyof typeof products;
              const image = images[imageKey as keyof typeof images];
              const product = getProduct(productKey);

              return (
                <div
                  key={index}
                  className="flex-none w-full sm:w-1/2 lg:w-1/4 px-2 sm:px-3"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative group h-48 sm:h-64 overflow-hidden">
                      <Image
                        width={400}
                        height={300}
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="absolute top-3 left-3">
                        <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                          #{product.tag}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex justify-between items-center">
                          <Link
                            href="#"
                            className="bg-white/90 backdrop-blur-sm text-primary text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-white transition-colors duration-300"
                          >
                            View Details
                          </Link>
                          <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-primary hover:bg-white transition-colors duration-300">
                            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4">
                      <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                        {product.tag}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-gray-800 text-xs sm:text-sm font-medium">
                            {product.rating}
                          </span>
                          <span className="text-gray-500 text-[10px] sm:text-xs">
                            ({product.reviews})
                          </span>
                        </div>
                        <span className="text-primary font-semibold text-sm sm:text-base">
                          {product.price}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-4 sm:mt-6 gap-1 sm:gap-1.5">
            {Array.from({ length: Math.ceil(totalProducts / itemsToShow) }).map(
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * itemsToShow)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / itemsToShow) === i
                      ? "bg-primary w-5 sm:w-6"
                      : "bg-gray-300 hover:bg-gray-400 w-2"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              )
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

// Single Ad Banner Section
const SingleAdSection = () => {
  const [isFirstAd, setIsFirstAd] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFirstAd((prev) => !prev);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-3 sm:py-4">
      <MaxWidthWrapper className="px-2 sm:px-4">
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-sm group"
        >
          {isFirstAd ? (
            // First Ad - Similar to left-column style
            <>
              <Image
                width={1200}
                height={330}
                src={images.dashen.src || "/placeholder.svg"}
                alt={images.dashen.alt}
                className="w-full h-[250px] sm:h-[330px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
                <span className="bg-primary/90 text-white text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm">
                  Featured Ad
                </span>
                <h3 className="text-white text-lg sm:text-2xl font-bold mt-1 sm:mt-2 mb-1 sm:mb-3">
                  Dashen SuperApp
                </h3>
                <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-4 max-w-md">
                  Discover Ethiopian Best SuperApp. Special offers for early
                  subscribers.
                </p>
                <Link
                  href="https://dashensuperapp.com"
                  className="inline-flex items-center gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md hover:bg-white transition-colors duration-300 text-xs sm:text-sm"
                >
                  Learn More
                  <ChevronDown
                    size={16}
                    className="text-white w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-primary"
                  />
                </Link>
              </div>
            </>
          ) : (
            // Second Ad - Premium Ad Space
            <>
              <Image
                width={1200}
                height={330}
                src={images.half.src || "/placeholder.svg"}
                alt={images.half.alt}
                className="w-full h-[250px] sm:h-[330px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
              <div className="absolute top-1/2 left-4 sm:left-16 transform -translate-y-1/2 max-w-lg p-2 sm:p-0">
                <span className="bg-primary/90 text-white text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm">
                  Premium Space
                </span>
                <h2 className="text-white text-xl sm:text-3xl font-bold mt-2 sm:mt-3 mb-2 sm:mb-4">
                  Premium Advertisement Space
                </h2>
                <p className="text-white/90 mb-3 sm:mb-6 text-xs sm:text-base hidden xs:block">
                  Showcase your brand or product in our premium banner space.
                  Reach thousands of potential customers daily.
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md hover:bg-white transition-colors duration-300 text-xs sm:text-sm"
                >
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
};

// Services Section
const ServicesSection = () => {
  return (
    <section className="py-4 sm:py-5 md:py-6 bg-gray-50/50">
      <MaxWidthWrapper className="px-2 sm:px-4">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative overflow-hidden">
              <Image
                width={600}
                height={500}
                src={images.car.src || "/placeholder.svg"}
                alt="City View"
                className="w-full h-[250px] sm:h-[300px] lg:h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-primary text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-sm">
                  Looking for something in Addis?
                </span>
              </div>
            </div>

            <div className="lg:w-1/2 p-4 sm:p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Our Range of Services
              </h2>
              <div className="w-12 sm:w-16 h-1 bg-primary rounded-full mb-4 sm:mb-6"></div>

              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-8">
                Looking for something in Addis? Whether you&apos;re buying or
                selling duty-free cars, searching for houses to rent, or looking
                to rent out your car, we&apos;ve got you covered. Connect with
                us to explore these services and much more.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      Buy & Sell
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Cars, houses, and more
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
                    <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      Property Rental
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Find your perfect home
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/about-us"
                className="inline-flex items-center gap-1 sm:gap-2 text-primary font-medium hover:text-primary/80 transition-colors text-sm sm:text-base"
              >
                Learn more about our services
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

// Why Choose Us Section
const WhyChooseUs = () => {
  // Define feature data for the Why Choose Us section
  const featureData = [
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "Verified Listings",
      description:
        "Every listing undergoes verification to ensure authenticity and quality standards.",
    },
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      title: "Exclusive Community",
      description:
        "Connect with a network of diplomats and expats for trusted transactions.",
    },
    {
      icon: <Globe className="w-5 h-5 text-primary" />,
      title: "Global Standards",
      description:
        "Products and services that meet international quality and safety benchmarks.",
    },
    {
      icon: <Check className="w-5 h-5 text-primary" />,
      title: "Hassle-Free Process",
      description:
        "Streamlined buying, selling, and renting processes designed for diplomatic needs.",
    },
    {
      icon: <Clock className="w-5 h-5 text-primary" />,
      title: "24/7 Support",
      description:
        "Our dedicated team is always available to assist with any queries or concerns.",
    },
    {
      icon: <Zap className="w-5 h-5 text-primary" />,
      title: "Fast Transactions",
      description:
        "Quick responses and efficient transaction processing for busy diplomats.",
    },
  ];

  return (
    <section id="why-diplomat-corner" className="py-4 sm:py-5 md:py-6">
      <MaxWidthWrapper className="px-2 sm:px-4">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why Diplomat Corner?
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-4 sm:mb-6"></div>
          <p className="text-gray-700 text-sm sm:text-base">
            Diplomat Corner is the premier marketplace designed exclusively for
            diplomats in Ethiopia. We connect diplomatic community members to
            facilitate hassle-free transactions for duty-free goods, housing,
            and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featureData.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-2 sm:p-3 bg-primary/10 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mb-4 sm:mb-5">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

// Home Component
export default function Home() {
  return (
    <div className="bg-white">
      <div className="px-1 sm:px-3 lg:px-5 xl:px-6 mx-auto">
        <HeroSection />
        <FeaturedProducts />
        <SingleAdSection />
        <WhyChooseUs />
        <ServicesSection />
      </div>
    </div>
  );
}

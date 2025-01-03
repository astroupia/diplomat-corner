import MaxWidthWrapper from "@/components/MaxWidthWrapper"; 
import { image } from "framer-motion/client";
import { ArrowBigDown, ArrowBigDownDash, ArrowBigDownDashIcon, ArrowDown, ChevronDown, Plus, Star } from "lucide-react";
import Link from "next/link";
import React from 'react';

export default function Home() {
  const images = ["/air.jpg", "/air2.jpg", "/b.jpg", "/b1.jpg","/car.jpg","wom.jpg","half.jpg"];
  const products = [
    { tag: "House For Rent", rating: 4.95, reviews: 22 },
    { tag: "Car For Sale", rating: 4.25, reviews: 22 },
    { tag: "House For Rent", rating: 3.95, reviews: 22 },
    { tag: "Car For Sale", rating: 4.6, reviews: 22 },
    { tag: "Car For Sale", rating: 4.3, reviews: 22 },
  ];

  return (
    <div className="bg-white" >
      <section >
      <MaxWidthWrapper className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-4">
            <div className="col-span-1 sm:col-span-2 grid grid-rows-2 gap-4 ">
              <div className="row-span-1">
                <div className="relative h-full">
                  <img
                      src={images[0]}
                      alt="Awash Bank"
                      className="w-full h-[420] object-cover rounded"
                  />
                    <Link
                      href="#"
                      className="absolute flex flex-row items-center bottom-4 left-4 bg-white text-primary px-4 py-2 rounded-3xl shadow hover:translate-y-1 hover:text-primary hover:bg-slate-200"
                    >
                      Learn More{" "}
                      <ChevronDown
                        size={24}
                        className="text-white w-5 h-5 ml-1 rounded-full bg-primary"
                      />
                    </Link>
                  </div>
                </div>

                <div className="row-span-1 grid grid-cols-2 gap-4">

                  <div className="relative h-full">
                    <img
                      src={images[1]}
                      alt="Awash Bank"
                      className="w-full h-full object-cover rounded"
                    />
                    <Link
                      href="#"
                      className="absolute bottom-4 right-4 bg-white text-primary px-4 py-2 rounded-3xl shadow"
                    >
                      #Awash_Bank
                    </Link>
                  </div>

                  <div className="relative">
                    <img
                      src={images[2]}
                      alt="Bike Promotion"
                      className="w-full h-full object-cover rounded"
                    />
                    <Link
                      href="#"
                      className="absolute bottom-4 right-4 bg-white text-primary px-4 py-2 rounded-3xl shadow"
                    >
                      #Dashin_Dube
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <div className="relative h-full">
                  <img
                    src={images[4]}
                    alt="Car"
                    className="w-full h-full object-cover rounded"
                  />

                  <Link
                    href="#"
                    className="absolute text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/55 text-white w-16 h-16 flex items-center justify-center rounded-full shadow border-2 border-white hover:scale-125"
                  >
                    Shop Now
                  </Link>

                  <div className="absolute bottom-4 right-6 flex gap-1">
                    <Link
                      href="#"
                      className="bg-white text-primary px-4 py-2 rounded-3xl shadow flex flex-row items-center"
                    >
                      Learn More{" "}
                      <ChevronDown
                        size={24}
                        className="text-white w-5 h-5 ml-1 rounded-full bg-primary"
                      />
                    </Link>
                    <Link
                      href="#"
                      className="bg-glass-500/65 text-white px-6 py-2 rounded-3xl shadow border-white border-2 flex flex-row items-center"
                    >
                      Add Product{" "}
                      <Plus
                        size={24}
                        className="text-gray-400 w-5 h-5 ml-1 rounded-full bg-white"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
      </MaxWidthWrapper>

      </section>


 {/* Featured Products Section */}
<section className="bg-slate-50 py-10">
        <MaxWidthWrapper>
          <div className="px-4 sm:px-8">
            <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative group overflow-hidden rounded-lg shadow-md w-full h-64">
                    <Link href="#">
                      <img
                        src={image}
                        alt={products[index]?.tag || "Product"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </Link>
                    <div className="absolute bottom-4 left-4">
                      <span className="text-primary text-sm bg-white px-2 py-1 rounded-md">
                        #{products[index]?.tag || "Unknown"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-gray-800 text-sm font-semibold">
                      {products[index]?.rating || 0}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({products[index]?.reviews || 0} reviews)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* One Image Ad Section */}
      <section>
        <MaxWidthWrapper className="p-4">
          <div>
            <Link href="#">
              <img
                src={images[6]}
                alt="plane"
                className="h-[330px] w-full rounded-3xl object-cover"
              />
            </Link>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Image and Text Section */}
      <section className="bg-slate-50 py-10">
        <MaxWidthWrapper className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-lg shadow-md mx-auto">
          <div className="flex-shrink-0 w-full sm:w-[500px]">
            <div className="relative">
              <img
                src={images[4]}
                alt="City View"
                className="rounded-lg w-full h-[500px] object-cover"
              />
              <span className="absolute top-2 left-2 bg-white text-primary text-sm font-medium px-3 py-1 rounded-full shadow">
                Looking for something in Addis?
              </span>
            </div>
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Our Range of Services
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Looking for something in Addis? Whether you're buying or selling
              duty-free cars, searching for houses to rent, or looking to rent out
              your car, we've got you covered. Connect with us to explore these
              services and much more.
            </p>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
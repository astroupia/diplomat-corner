import MaxWidthWrapper from "@/components/MaxWidthWrapper"; // Ensure this exists and works
import { ArrowBigDown, ArrowBigDownDash, ArrowBigDownDashIcon, ArrowDown, ChevronDown, Plus, Star } from "lucide-react";
import Link from "next/link";
import React from 'react';

export default function Home() {
  const images = ["/air.jpg", "/air2.jpg", "/b.jpg", "/b1.jpg","/car.jpg"];
  const products = [
    { tag: "House For Rent", rating: 4.95, reviews: 22 },
    { tag: "Car For Sale", rating: 4.25, reviews: 22 },
    { tag: "House For Rent", rating: 3.95, reviews: 22 },
    { tag: "Car For Sale", rating: 4.6, reviews: 22 },
    { tag: "Car For Sale", rating: 4.3, reviews: 22 },
  ];

  return (
    <div className="bg-slate-50" >
      <section >
      <MaxWidthWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-4">
            <div className="col-span-1 sm:col-span-2 grid grid-rows-2 gap-4 ">
              <div className="row-span-1">
                <div className="relative h-full">
                  <img
                      src="/air.jpg"
                      alt="Awash Bank"
                      className="w-full h-[420] object-cover rounded"
                  />
                    <Link
                      href="#"
                      className="absolute flex flex-row items-center bottom-4 left-4 bg-white text-green-700 px-4 py-2 rounded-3xl shadow hover:translate-y-1 hover:text-green-900 hover:bg-slate-200"
                    >
                      Learn More{" "}
                      <ChevronDown
                        size={24}
                        className="text-white w-5 h-5 ml-1 rounded-full bg-green-700"
                      />
                    </Link>
                  </div>
                </div>

                <div className="row-span-1 grid grid-cols-2 gap-4">

                  <div className="relative h-full">
                    <img
                      src="/air2.jpg"
                      alt="Awash Bank"
                      className="w-full h-full object-cover rounded"
                    />
                    <Link
                      href="#"
                      className="absolute bottom-4 right-4 bg-white text-green-700 px-4 py-2 rounded-3xl shadow"
                    >
                      #Awash_Bank
                    </Link>
                  </div>

                  <div className="relative">
                    <img
                      src="/b.jpg"
                      alt="Bike Promotion"
                      className="w-full h-full object-cover rounded"
                    />
                    <Link
                      href="#"
                      className="absolute bottom-4 right-4 bg-white text-green-700 px-4 py-2 rounded-3xl shadow"
                    >
                      #Dashin_Dube
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <div className="relative h-full">
                  <img
                    src="/car.jpg"
                    alt="Car"
                    className="w-full h-full object-cover rounded"
                  />

                  <Link
                    href="#"
                    className="absolute text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/55 text-white w-16 h-16 flex items-center justify-center rounded-full shadow border-2 border-white"
                  >
                    Shop Now
                  </Link>

                  <div className="absolute bottom-4 right-6 flex gap-1">
                    <Link
                      href="#"
                      className="bg-white text-green-700 px-4 py-2 rounded-3xl shadow flex flex-row items-center"
                    >
                      Learn More{" "}
                      <ChevronDown
                        size={24}
                        className="text-white w-5 h-5 ml-1 rounded-full bg-green-700"
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



    <section className="bg-white py-10">
      <MaxWidthWrapper>
        <div className="px-8">

        
      <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div key={index} className="flex flex-col items-center">

            <div className="relative group overflow-hidden rounded-lg shadow-md w-full h-64">
              <Link 
              href="#">
              <img
                src={image}
                alt={products[index]?.tag || "Product"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              </Link>
              <div className="absolute bottom-4 left-4">
                <span className="text-green-700 text-sm bg-white  px-2 py-1 rounded-md">
                  #{products[index]?.tag || "Unknown"}
                </span>
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-1">
              <Star className="w-4 h-4 text-green-500" />
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


    </div>
  );
}

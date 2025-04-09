import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ChevronDown, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { images } from "@public/assets/images";
import { products, getProduct } from "@public/assets/data/products";

// Components
const HeroSection = () => (
  <section>
    <MaxWidthWrapper className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-4">
        <div className="col-span-1 sm:col-span-2 grid grid-rows-2 gap-4">
          <div className="row-span-1">
            <div className="relative h-full">
              <Image
                width={100}
                height={100}
                src={images.air.src}
                alt={images.air.alt}
                className="w-full h-[420px] object-cover rounded"
                priority
              />
              <Link
                href="#"
                className="absolute flex flex-row items-center bottom-4 left-4 bg-white text-primary px-4 py-2 rounded-3xl shadow hover:translate-y-1 hover:text-primary hover:bg-slate-200 transition-all"
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
              <Image
                width={100}
                height={100}
                src={images.air2.src}
                alt={images.air2.alt}
                className="w-full h-full object-cover rounded"
              />
              <Link
                href="#"
                className="absolute bottom-4 right-4 bg-white text-primary px-4 py-2 rounded-3xl shadow hover:bg-slate-200 transition-all"
              >
                #Awash_Bank
              </Link>
            </div>

            <div className="relative">
              <Image
                width={100}
                height={100}
                src={images.cash.src}
                alt={images.cash.alt}
                className="w-full h-full object-cover rounded"
              />
              <Link
                href="#"
                className="absolute bottom-4 right-4 bg-white text-primary px-4 py-2 rounded-3xl shadow hover:bg-slate-200 transition-all"
              >
                #Dashin_Dube
              </Link>
            </div>
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2">
          <div className="relative h-full">
            <Image
              width={100}
              height={100}
              src={images.car.src}
              alt={images.car.alt}
              className="w-full h-full object-cover rounded"
            />

            <Link
              href="#"
              className="absolute text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/55 text-white w-16 h-16 flex items-center justify-center rounded-full shadow border-2 border-white hover:scale-125 transition-transform"
            >
              Shop Now
            </Link>

            <div className="absolute bottom-4 right-6 flex gap-1">
              <Link
                href="#"
                className="bg-white text-primary px-4 py-2 rounded-3xl shadow flex flex-row items-center hover:bg-slate-200 transition-all"
              >
                Learn More{" "}
                <ChevronDown
                  size={24}
                  className="text-white w-5 h-5 ml-1 rounded-full bg-primary"
                />
              </Link>
              <Link
                href="#"
                className="bg-glass-500/65 text-white px-6 py-2 rounded-3xl shadow border-white border-2 flex flex-row items-center hover:bg-glass-500/75 transition-all"
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
);

const FeaturedProducts = () => {
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
  const productKeys = ["house1", "car1", "house2", "car2", "car3"];

  return (
    <section className="bg-slate-50 py-10">
      <MaxWidthWrapper>
        <div className="px-4 sm:px-8">
          <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredImageKeys
              .slice(0, Math.min(featuredImageKeys.length, productKeys.length))
              .map((imageKey, index) => {
                const productKey = productKeys[index] as keyof typeof products;
                const image = images[imageKey as keyof typeof images];
                const product = getProduct(productKey);
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative group overflow-hidden rounded-lg shadow-md w-full h-64">
                      <Link href="#">
                        <Image
                          width={100}
                          height={100}
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </Link>
                      <div className="absolute bottom-4 left-4">
                        <span className="text-primary text-sm bg-white px-2 py-1 rounded-md">
                          #{product.tag}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-primary" />
                      <span className="text-gray-800 text-sm font-semibold">
                        {product.rating}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

const SingleAdSection = () => (
  <section>
    <MaxWidthWrapper className="p-4">
      <div>
        <Link href="#">
          <Image
            width={100}
            height={100}
            src={images.half.src}
            alt={images.half.alt}
            className="h-[330px] w-full rounded-3xl object-cover"
          />
        </Link>
      </div>
    </MaxWidthWrapper>
  </section>
);

const ServicesSection = () => (
  <section className="bg-slate-50 py-10">
    <MaxWidthWrapper className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-lg shadow-md mx-auto">
      <div className="flex-shrink-0 w-full sm:w-[500px]">
        <div className="relative">
          <Link href="/AboutUs">
            <Image
              width={100}
              height={100}
              src={images.car.src}
              alt="City View"
              className="rounded-lg w-full h-[500px] object-cover"
            />
          </Link>
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
          Looking for something in Addis? Whether you&apos;re buying or selling
          duty-free cars, searching for houses to rent, or looking to rent out
          your car, we&apos;ve got you covered. Connect with us to explore these
          services and much more.
        </p>
      </div>
    </MaxWidthWrapper>
  </section>
);

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <FeaturedProducts />
      <SingleAdSection />
      <ServicesSection />
    </div>
  );
}

"use client";

import Card from "@/components/car/car-card";
import type { ICar } from "@/lib/models/car.model";
import React, { useEffect, useState } from "react";
import LoadingSkeleton from "@/app/car/loading";
import { useAuth, useUser } from "@clerk/nextjs";
import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import FilterSection, { FilterOption } from "../filter-section";
import ListingBanner from "@/components/listing-banner"

const CardContainer: React.FC = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [cars, setCars] = useState<ICar[]>([]);
  const [userCars, setUserCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("Default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [fullCars, setFullCars] = useState<ICar[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterOptions: FilterOption[] = [
    { value: "Default", label: "Default" },
    { value: "Price Low to High", label: "Price: Low to High" },
    { value: "Price High to Low", label: "Price: High to Low" },
    { value: "Size Small to Large", label: "Size: Small to Large" },
    { value: "Size Large to Small", label: "Size: Large to Small" },
    { value: "Sedan", label: "Sedan" },
    { value: "SUV", label: "SUV" },
  ];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.cars)) {
          // Validate and transform car data before setting state
          const validatedCars = data.cars.map((car: ICar) => ({
            ...car,
            price: Number(car.price) || 0,
            mileage: Number(car.mileage) || 0,
            milesPerGallon: Number(car.milesPerGallon) || 0,
            speed: Number(car.speed) || 0,
            transmission: car.transmission || "N/A",
            fuel: car.fuel || "N/A",
            bodyType: car.bodyType || "N/A",
            currency: car.currency || "ETB",
            advertisementType: car.advertisementType || "Sale",
          }));

          // Separate user cars from all cars
          if (userId) {
            const userOwnedCars = validatedCars.filter(
              (car: ICar) => car.userId === userId
            );
            setUserCars(userOwnedCars);
          }

          setCars(validatedCars);
          setHasMore(validatedCars.length > displayLimit);
        } else {
          throw new Error(
            data.error || "Invalid data format: Expected an array of cars"
          );
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [userId, displayLimit]);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    let sortedCars = [...cars];

    // Sort conditions based on value. Adjust or add cases as needed.
    if (value === "Price Low to High") {
      sortedCars.sort((a, b) => a.price - b.price);
    } else if (value === "Price High to Low") {
      sortedCars.sort((a, b) => b.price - a.price);
    } else if (value === "Size Small to Large") {
      sortedCars.sort((a, b) => a.mileage - b.mileage);
    } else if (value === "mileage Large to Small") {
      sortedCars.sort((a, b) => b.mileage - a.mileage);
    }
    // Default: No sort (or sort by original order, e.g., by id)
    else {
      sortedCars = [...cars];
    }
    setCars(sortedCars);
  };

  // Handle filtering: update activeFilters and filter from the full list.
  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    if (filters.length === 0) {
      setCars(fullCars);
    } else {
      // As an example, assume filters are based on car types.
      const filteredCars = fullCars.filter((car) =>
        filters.includes(car.bodyType.toLowerCase())
      );
      setCars(filteredCars);
    }
  };

  const loadMore = () => {
    setDisplayLimit((prev) => prev + 6);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const displayedCars = cars.slice(0, displayLimit);

  return (
 
    <div className="container">
      <ListingBanner type="car" />
        {/* Filter Section */}
        <div className="container py-10" >
          <FilterSection
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            filterOptions={filterOptions}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />

        {/* User's Listings Section */}
        {userId && userCars.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
              Your Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCars.map((car) => (
                <Card key={car._id} {...car} listedBy={userId} />
              ))}
            </div>
          </div>
        )}

        {/* All Listings Section */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-5">
          All Available Cars
        </h2>
        {displayedCars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCars.map((car) => (
                <Card
                  key={car._id}
                  {...car}
                  listedBy={user?.firstName || "Unkown User"}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center py-10 text-gray-500">No cars available.</p>
        )}
      </div>
    </div>
  );
};

export default CardContainer;

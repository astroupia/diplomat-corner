"use client";

import CardHouse from "@/components/house/card-house";
import type { IHouse } from "@/lib/models/house.model";
import React, { useEffect, useState } from "react";
import LoadingSkeleton from "@/app/house/loading";
import { useAuth } from "@clerk/nextjs";
import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import FilterSection from "../filter-section";
import ListingBanner from "../listing-banner";


const CardContainer: React.FC = () => {
  const { userId } = useAuth();
  const [houses, setHouses] = useState<IHouse[]>([]);
  const [userHouses, setUserHouses] = useState<IHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>("Default");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [fullHouses, setFullHouses] = useState<IHouse[]>([]);

  // Filter options for properties
  const filterOptions = [
    { value: "Default", label: "Sort: Default" },
    { value: "Price Low to High", label: "Price: Low to High" },
    { value: "Price High to Low", label: "Price: High to Low" },
    { value: "Size Small to Large", label: "Size: Small to Large" },
    { value: "Size Large to Small", label: "Size: Large to Small" },
    { value: "Bedrooms (Ascending)", label: "Bedrooms: Fewest First" },
    { value: "Bedrooms (Descending)", label: "Bedrooms: Most First" },
  ];

  // Additional filter chips
  const filterChips = [
    { value: "1-bedroom", label: "1 Bedroom" },
    { value: "2-bedroom", label: "2 Bedrooms" },
    { value: "3-bedroom", label: "3+ Bedrooms" },
    { value: "parking", label: "Parking" },
    { value: "furnished", label: "Furnished" },
    { value: "pets-allowed", label: "Pets Allowed" },
  ];

  const allFilterOptions = [...filterOptions, ...filterChips];

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await fetch("/api/house", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          // Separate user houses from all houses
          if (userId) {
            const userOwnedHouses = data.filter(
              (house) => house.userId === userId
            );
            setUserHouses(userOwnedHouses);
          }

          setHouses(data);
          setHasMore(data.length > displayLimit);
        } else {
          throw new Error("Invalid data format: Expected an array");
        }
      } catch (error) {
        console.error("Error fetching houses:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, [userId, displayLimit]);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    let sortedHouses = [...houses];

    if (value === "Price Low to High") {
      sortedHouses.sort((a, b) => a.price - b.price);
    } else if (value === "Price High to Low") {
      sortedHouses.sort((a, b) => b.price - a.price);
    } else if (value === "Size Small to Large") {
      sortedHouses.sort((a, b) => a.size - b.size);
    } else if (value === "Size Large to Small") {
      sortedHouses.sort((a, b) => b.size - a.size);
    } else {
      sortedHouses = [...houses];
    }
    setHouses(sortedHouses);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    if (filters.length === 0) {
      setHouses(fullHouses);
    } else {
      const filteredHouses = fullHouses.filter((house) =>
        filters.includes(house.advertisementType.toLowerCase())
      );
      setHouses(filteredHouses);
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

  const displayedHouses = houses.slice(0, displayLimit);

  return (
    <>
    <div className="container">
      
     <ListingBanner type="house" />
      
        {/* Filter Section */}
        <div className="pt-10 pb-5">
          <FilterSection
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            filterOptions={allFilterOptions}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* User's Listings Section */}
        {userId && userHouses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
              Your Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userHouses.map((house) => (
                <CardHouse key={house._id} {...house} />
              ))}
            </div>
          </div>
        )}

        {/* All Listings Section */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          All Available Properties
        </h2>
        {displayedHouses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedHouses.map((house) => (
                <CardHouse key={house._id} {...house} />
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
          <p className="text-center py-10 text-gray-500">
            No properties available.
          </p>
        )}
      </div>
    </>
  );
};

export default CardContainer;

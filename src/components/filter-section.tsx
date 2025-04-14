"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Check, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSectionProps {
  sortOrder: string;
  onSortChange: (value: string) => void;
  filterOptions: FilterOption[]; // Options for filter chips and/or sorting options
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  sortOrder,
  onSortChange,
  filterOptions,
  activeFilters,
  onFilterChange,
}) => {
  // Local state for search input (if needed for filtering options further)
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close the select dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle filter chip toggling
  const handleFilterClick = (value: string) => {
    if (activeFilters.includes(value)) {
      onFilterChange(activeFilters.filter((filter) => filter !== value));
    } else {
      onFilterChange([...activeFilters, value]);
    }
  };

  // Get current sort option label from sort options (or fallback)
  const getCurrentSortLabel = useCallback(() => {
    const option = filterOptions.find((option) => option.value === sortOrder);
    return option ? option.label : "Sort By";
  }, [filterOptions, sortOrder]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
      <div className="flex flex-col gap-4">
        {/* Sort Control Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={18} className="text-gray-600" />
            <span className="text-gray-700 font-medium">Sort by:</span>
            <div className="relative" ref={selectRef}>
              <button
                onClick={() => setIsSelectOpen((prev) => !prev)}
                className="flex items-center justify-between w-48 px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <span>{getCurrentSortLabel()}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isSelectOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {isSelectOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto">
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onSortChange(option.value);
                            setIsSelectOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                            sortOrder === option.value
                              ? "bg-green-100 text-green-700"
                              : "text-gray-700"
                          }`}
                        >
                          <span>{option.label}</span>
                          {sortOrder === option.value && (
                            <Check
                              size={16}
                              className="text-green-600 inline-block ml-2"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Optional: If you want to add a search field in the sort section */}

          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
        </div>

        {/* Filter Chips Row */}
        <div className="flex flex-wrap gap-2 pt-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterClick(option.value)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeFilters.includes(option.value)
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
              {activeFilters.includes(option.value) && (
                <X size={14} className="text-white" />
              )}
            </button>
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={() => onFilterChange([])}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;

"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
<<<<<<< HEAD
import { useState, useEffect, useRef, useCallback } from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import { Loader2, Megaphone, Menu, Search } from "lucide-react";



// Define the type for search results based on your API response
interface SearchResult {
  id: string;
  name: string;
  type: "car" | "house";
}

const NavBar: React.FC = () => {
  const { user } = useUser();
  
  const isAdmin =
    user?.primaryEmailAddress?.emailAddress ===
    process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]); // State for results
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false); // Loading state
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false); // Dropdown visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const[isVisible, setIsVisible] = useState<boolean>(true)
  const searchRef = useRef<HTMLDivElement>(null); // Ref for the search container
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for debounce timeout
  // Debounced search function
  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      setIsSearchLoading(false);
    }
    setIsSearchLoading(true);
    setIsDropdownVisible(true); // Show dropdown immediately when typing starts

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: SearchResult[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setSearchResults([]); // Clear results on error
    } finally {
      setIsSearchLoading(false);
    }
  }, []);


  // Effect for debounced search
   useEffect(() => {
    // Clear the previous timeout if it exists
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchQuery.trim()) {
        setIsSearchLoading(true); // Show loading indicator while waiting for debounce
        setIsDropdownVisible(true);
        // Set a new timeout
        debounceTimeoutRef.current = setTimeout(() => {
           fetchSearchResults(searchQuery.trim());
        }, 300); // 300ms debounce time
    } else {
         setSearchResults([]);
         setIsSearchLoading(false);
         setIsDropdownVisible(false);
    }


    // Cleanup function to clear timeout if component unmounts or query changes
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, fetchSearchResults]);

  // Effect for scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

   // Effect to handle clicks outside the search component
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false); // Hide dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]); // Dependency on the ref

  const handleInputFocus = () => {
     if (searchResults.length > 0 || isSearchLoading) {
        setIsDropdownVisible(true);
     }
  };

  // // Optional: Handle blur with a slight delay if needed, but handleClickOutside might be sufficient
  // const handleInputBlur = () => {
  //   // setTimeout(() => setIsDropdownVisible(false), 150); // Delay to allow clicks on dropdown items
  // };

  const handleResultClick = () => {
    setIsDropdownVisible(false); // Hide dropdown when a result is clicked
    setSearchQuery(""); // Optional: clear search query after selection
  };

=======
import { useEffect, useState } from "react";

const NavBar = () => {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setIsAdmin(
        user.primaryEmailAddress?.emailAddress ===
          process.env.NEXT_PUBLIC_ADMIN_EMAIL
      );
    }
  }, [isLoaded, user]);
>>>>>>> d5eb80e51b9bfa8f4266a0ba8e9a677d918f59f5

  return (
    <nav
      className={`bg-white border border-b-primary px-6 py-2 fixed top-0 left-0 right-0 z-50 shadow-md m-0 transition-all duration-700 ease-out ${ // Increased z-index to 50
        isVisible
          ? "opacity-100 translate-y-0 "
          : "opacity-0 -translate-y-full pointer-events-none" // Use -translate-y-full
      }`}
    >
      <section className="w-full">
        <MaxWidthWrapper>
          <div className="flex items-center justify-between flex-wrap min-w-0">
            {/* Left Section: Brand Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/">
                <span className="text-black font-bold text-base">
                  <div className="flex flex-col pl-2">
                    <h3>Diplomat</h3>
                    <span className="mt-[-5px] text-primary">Corner</span>
                  </div>
                </span>
              </Link>
            </div>

            {/* Hamburger Menu Button for Mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-black"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Middle Section: Navigation Links - Desktop */}
            <div className="flex-1 hidden lg:flex justify-center gap-6 text-lg text-black font-semibold px-6 min-w-0">
              <Link href="/car" className="hover:text-primary transition">
                Car For Sale
              </Link>
              <Link
                href="/house"
                className="px-2 hover:text-primary transition"
              >
                House For Rent
              </Link>
              <Link
                href="/about-us"
                className="px-2 hover:text-primary transition"
              >
                About Us
              </Link>
            </div>

            {/* Right Section: Search, Notifications, and Authentication */}
            <div className="flex items-center gap-4 flex-shrink-0 min-w-0">
              {/* --- Search Component --- */}
              <div className="relative" ref={searchRef}> {/* Added ref here */}
                <div className="relative"> {/* Wrapper for input and icon */}
                   <input
                      type="text"
                      placeholder="Search..." // Updated placeholder
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={handleInputFocus} // Show dropdown on focus if results exist
                      // onBlur={handleInputBlur} // Optional blur handling
                      className="border border-primary rounded-full px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-primary w-40 lg:w-56 pr-8" // Increased width slightly
                   />
                   <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                     {isSearchLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Search className="w-5 h-5" />}
                   </span>
                </div>

                {/* --- Dropdown --- */}
                {isDropdownVisible && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50"> {/* Increased z-index */}
                    {isSearchLoading && searchResults.length === 0 ? (
                      <div className="p-2 text-center text-gray-500">Loading...</div>
                    ) : searchResults.length > 0 ? (
                      <ul>
                        {searchResults.map((result) => (
                          <li key={`${result.type}-${result.id}`} className="border-b last:border-b-0">
                            <Link
                              href={`/${result.type}/${result.id}`}
                              onClick={handleResultClick} // Hide dropdown on click
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {result.name} <span className="text-xs text-gray-400">({result.type})</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : !isSearchLoading && searchQuery ? ( // Show only if not loading and query exists
                      <div className="p-2 text-center text-gray-500">No results found.</div>
                    ) : null /* Don't show anything if loading initial results or query is empty */ }
                  </div>
                )}
              </div>
              {/* --- End Search Component --- */}


              {/* Authentication Buttons */}
              <div className="flex items-center gap-4">
<<<<<<< HEAD
                {!user ? (
                  <Link href="/sign-up">
                    <Button>Get Started</Button>
                  </Link>
=======
                {!isLoaded ? (
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                ) : !user ? (
                  <>
                    <Link href="/sign-up">
                      <Button>Get Started</Button>
                    </Link>
                  </>
>>>>>>> d5eb80e51b9bfa8f4266a0ba8e9a677d918f59f5
                ) : (
                  <>
                    <UserButton afterSignOutUrl="/"/> {/* Added afterSignOutUrl */}
                    <Link href="/notifications" className="text-primary">
                      <Megaphone className="w-6 h-6" />
                    </Link>
                    <Link
                      href="/manage-product/house" // Consider a general manage page?
                      className="px-2 hover:text-primary transition pl-3"
                    >
                      Manage Products
                    </Link>
                    {isAdmin && (
                      <span className="text-sm text-primary font-bold">
                        Admin
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu - shown when hamburger is clicked */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4">
              <div className="flex flex-col gap-4 text-lg text-black font-semibold">
                <Link href="/car" className="hover:text-primary transition">
                  Car For Sale
                </Link>
                <Link
                  href="/house"
                  className="hover:text-primary transition"
                >
                  House For Rent
                </Link>
                <Link
                  href="/about-us"
                  className="hover:text-primary transition"
                >
                  About Us
                </Link>

                {/* Mobile Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="border border-primary rounded-full px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-primary w-full"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary">
                    <Link href="#">
                      <Search className="w-5 h-5" />
                    </Link>
                  </button>
                </div>

                {/* Mobile Authentication */}
                {!user ? (
                  <Link href="/sign-up">
                    <Button>Get Started</Button>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link href="/notifications" className="text-primary">
                      <Megaphone className="w-6 h-6" />
                    </Link>
                    <Link
                      href="/manage-product/house"
                      className="hover:text-primary transition"
                    >
                      Manage Products
                    </Link>
                    {isAdmin && (
                      <span className="text-sm text-primary font-bold">
                        Admin
                      </span>
                    )}
                    <UserButton />
                  </div>
                )}
              </div>
            </div>
          )}
        </MaxWidthWrapper>
      </section>
    </nav>
  );
};

export default NavBar;

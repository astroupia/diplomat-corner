"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import { Bell, Loader2, Megaphone, Menu, Search } from "lucide-react";
import Image from "next/image";
import { INotification } from "@/types/notifications";

// Define the type for search results based on your API response
interface SearchResult {
  id: string;
  name: string;
  type: "car" | "house";
}

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[]; // Optional nested items
  isAdmin?: boolean; // Optional flag for admin-only items
  isAuth?: boolean;
  name: string;
  type: "car" | "house";
}

const NavBar: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notificationCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const lastCheckTime = useRef<Date>(new Date());

  // Set up notification checking when user data loads
  useEffect(() => {
    // Skip if Clerk authentication is not loaded yet
    if (!isLoaded) return;

    // Check for existing count in localStorage
    if (typeof window !== "undefined") {
      const storedCount = localStorage.getItem("unreadNotificationsCount");
      if (storedCount) {
        setUnreadNotifications(parseInt(storedCount));
      }
    }

    // Define notification update event handler
    const handleNotificationUpdate = (event: any) => {
      if (event.detail && typeof event.detail.count === "number") {
        setUnreadNotifications(event.detail.count);
      }
    };

    // Add the event listeners
    window.addEventListener(
      "unreadNotificationsUpdate",
      handleNotificationUpdate
    );

    // Cleanup interval when component unmounts or user changes
    return () => {
      // Clean up event listeners
      window.removeEventListener(
        "unreadNotificationsUpdate",
        handleNotificationUpdate
      );
    };
  }, [isLoaded, user]);

  // Reset notification count when user visits notifications page
  useEffect(() => {
    const handleRouteChange = () => {
      if (user && window.location.pathname === "/notifications") {
        // Reset the counter after a small delay (to allow for page transition)
        setTimeout(() => {
          setUnreadNotifications(0);
          // Update localStorage
          localStorage.setItem("unreadNotificationsCount", "0");
          lastCheckTime.current = new Date();
        }, 500);
      }
    };

    // Listen for route changes and check initial route
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", handleRouteChange);
      // Check the current route when the component mounts
      handleRouteChange();

      // Cleanup listener on unmount
      return () => {
        window.removeEventListener("popstate", handleRouteChange);
      };
    }

    return undefined; // Explicit return for the effect cleanup function
  }, [user]);

  // Debounced search function
  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      setIsSearchLoading(false);
      return;
    }
    setIsSearchLoading(true);
    setIsDropdownVisible(true); // Show dropdown immediately when typing starts

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
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
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false); // Hide dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    if (searchResults.length > 0 || isSearchLoading) {
      setIsDropdownVisible(true);
    }
  };

  // Function to handle mobile menu collapse
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Update handleResultClick to also close mobile menu
  const handleResultClick = () => {
    setIsDropdownVisible(false);
    setSearchQuery("");
    handleMobileMenuClose();
  };

  // Define navigation items with conditional visibility
  const navItems: NavItem[] = [
    {
      label: "Cars",
      href: "/car",
      name: "",
      type: "car",
    },
    {
      label: "Houses",
      href: "/house",
      name: "",
      type: "house",
    },
    {
      label: "About Us",
      href: "/about-us",
      name: "",
      type: "car",
    },
    {
      label: "Contact Us",
      href: "/contact-us",
      name: "",
      type: "car",
    },
  ];

  // Effect to setup notification polling and WebSocket connection
  useEffect(() => {
    // Define checkNewNotifications function inside useEffect
    const checkNewNotifications = async () => {
      if (!isLoaded || !user) return;

      try {
        // Check for new notifications since last check
        const response = await fetch(
          `/api/notifications/check-new?userId=${
            user.id
          }&lastCheck=${lastCheckTime.current.toISOString()}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.count > 0) {
            // Update the count
            setUnreadNotifications(
              (prev) => parseInt(prev.toString()) + data.count
            );

            // Dispatch event for other components
            const event = new CustomEvent("unreadNotificationsUpdate", {
              detail: { count: data.count },
            });
            window.dispatchEvent(event);

            // Update last check time
            lastCheckTime.current = new Date();
          }
        }
      } catch (error) {
        console.error("Error checking for new notifications:", error);
      }
    };

    // Define notification update handler inside useEffect
    const handleNotificationUpdate = (event: any) => {
      if (event.detail && typeof event.detail.count === "number") {
        setUnreadNotifications(event.detail.count);
      }
    };

    // First check for new notifications
    checkNewNotifications();

    // Set up polling interval for notifications - every 30 seconds
    notificationCheckInterval.current = setInterval(() => {
      checkNewNotifications();
    }, 30000);

    // Connect to WebSocket for real-time notification updates
    const socket = new WebSocket(
      `${window.location.protocol === "https:" ? "wss" : "ws"}://${
        window.location.host
      }/api/ws`
    );

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification" && user && data.userId === user.id) {
        handleNotificationUpdate(data);
      }
    };

    // Clean up on unmount
    return () => {
      if (notificationCheckInterval.current) {
        clearInterval(notificationCheckInterval.current);
      }
      socket.close();
    };
  }, [isLoaded, user]);

  return (
    <nav
      className={`bg-white border px-4 sm:px-6 py-2 fixed top-0 left-0 right-0 z-50 shadow-md m-0 transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <section className="w-full">
        <MaxWidthWrapper>
          <div className="flex items-center justify-between flex-wrap min-w-0">
            {/* Left Section: Brand Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" onClick={handleMobileMenuClose}>
                <span className="text-black font-normal text-base">
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
            <div className="hidden lg:flex flex-1 justify-center gap-4 xl:gap-6 text-base text-black font-normal px-4 xl:px-6 min-w-0">
              {navItems
                .filter((item) => !item.isAuth || (item.isAuth && user))
                .map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="hover:text-primary transition whitespace-nowrap"
                    onClick={handleMobileMenuClose}
                  >
                    {item.label}
                  </Link>
                ))}
            </div>

            {/* Right Section: Search, Notifications, and Authentication */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-6 flex-shrink-0 min-w-0">
              {/* Search Component */}
              <div className="relative" ref={searchRef}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleInputFocus}
                    className="border border-primary rounded-full px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-primary w-40 xl:w-56 pr-8"
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {isSearchLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </span>
                </div>
                {/* Dropdown */}
                {isDropdownVisible && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                    {isSearchLoading && searchResults.length === 0 ? (
                      <div className="p-2 text-center text-gray-500">
                        Loading...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <ul>
                        {searchResults.map((result) => (
                          <li
                            key={`${result.type}-${result.id}`}
                            className="border-b last:border-b-0"
                          >
                            <Link
                              href={`/${result.type}/${result.id}`}
                              onClick={handleResultClick}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {result.name}{" "}
                              <span className="text-xs text-gray-400">
                                ({result.type})
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      !isSearchLoading &&
                      searchQuery && (
                        <div className="p-2 text-center text-gray-500">
                          No results found.
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Authentication Buttons */}
              <div className="flex items-center gap-3 xl:gap-6">
                {!user ? (
                  <Link href="/sign-up" onClick={handleMobileMenuClose}>
                    <Button className="bg-gradient-to-r from-primary to-white-600 hover:from-white-600 hover:to-primary text-white font-medium px-4 xl:px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                      Get Started
                    </Button>
                  </Link>
                ) : (
                  <>
                    <div className="relative group">
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            rootBox:
                              "transform hover:scale-110 transition-transform duration-200",
                          },
                        }}
                      />
                    </div>
                    <Link href="/notifications" onClick={handleMobileMenuClose}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative bg-gradient-to-r from-gray-50 to-white p-2 rounded-full border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-300"
                      >
                        <Bell className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
                        {unreadNotifications > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">
                            {unreadNotifications > 99
                              ? "99+"
                              : unreadNotifications}
                          </span>
                        )}
                        <span className="sr-only">Notifications</span>
                      </Button>
                    </Link>
                    <Link
                      href="/manage-product/house"
                      onClick={handleMobileMenuClose}
                      className="relative overflow-hidden px-3 xl:px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary transition-all duration-300 group"
                    >
                      <span className="relative z-10">Manage Products</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 border-t border-gray-200">
              <div className="flex flex-col gap-4 text-lg text-black font-semibold p-4">
                {/* Navigation Links */}
                {navItems
                  .filter((item) => !item.isAuth || (item.isAuth && user))
                  .map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="hover:text-primary transition"
                      onClick={handleMobileMenuClose}
                    >
                      {item.label}
                    </Link>
                  ))}

                {/* Search Component for Mobile */}
                <div className="relative mt-4" ref={searchRef}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={handleInputFocus}
                      className="w-full border border-primary rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary pr-8"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {isSearchLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                  {/* Dropdown */}
                  {isDropdownVisible && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                      {isSearchLoading && searchResults.length === 0 ? (
                        <div className="p-2 text-center text-gray-500">
                          Loading...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <ul>
                          {searchResults.map((result) => (
                            <li
                              key={`${result.type}-${result.id}`}
                              className="border-b last:border-b-0"
                            >
                              <Link
                                href={`/${result.type}/${result.id}`}
                                onClick={handleResultClick}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {result.name}{" "}
                                <span className="text-xs text-gray-400">
                                  ({result.type})
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        !isSearchLoading &&
                        searchQuery && (
                          <div className="p-2 text-center text-gray-500">
                            No results found.
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Authentication Buttons for Mobile */}
                <div className="flex flex-col gap-4 mt-4">
                  {!user ? (
                    <Link href="/sign-up" onClick={handleMobileMenuClose}>
                      <Button className="w-full bg-gradient-to-r from-primary to-white-600 hover:from-white-600 hover:to-primary text-white font-medium py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                        Get Started
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <UserButton
                          afterSignOutUrl="/"
                          appearance={{
                            elements: {
                              rootBox: "w-full",
                            },
                          }}
                        />
                        <Link
                          href="/notifications"
                          onClick={handleMobileMenuClose}
                          className="flex-1"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-full relative bg-gradient-to-r from-gray-50 to-white p-2 rounded-full border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-300"
                          >
                            <Bell className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
                            {unreadNotifications > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">
                                {unreadNotifications > 99
                                  ? "99+"
                                  : unreadNotifications}
                              </span>
                            )}
                            <span className="sr-only">Notifications</span>
                          </Button>
                        </Link>
                      </div>
                      <Link
                        href="/manage-product/house"
                        onClick={handleMobileMenuClose}
                        className="w-full text-center relative overflow-hidden px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary transition-all duration-300 group"
                      >
                        <span className="relative z-10">Manage Products</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </MaxWidthWrapper>
      </section>
    </nav>
  );
};

export default NavBar;

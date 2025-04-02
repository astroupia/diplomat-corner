"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Megaphone, Search } from "lucide-react";
import Link from "next/link";
import MaxWidthWrapper from "./max-width-wrapper";
import { Button } from "./ui/button";

const NavBar = () => {
  const { user } = useUser();
  const isAdmin =
    user?.primaryEmailAddress?.emailAddress ===
    process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <nav className="bg-white border border-primary rounded-3xl px-6 py-2 top-0 z-10 shadow-md m-4">
      <section>
        <MaxWidthWrapper>
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left Section: Brand Logo */}
            <div className="flex items-center">
              <Link href="/">
                <span className="text-black font-bold text-base">
                  <div className="flex flex-col">
                    <h3>Diplomat</h3>
                    <span className="mt-[-5px] text-primary">Corner</span>
                  </div>
                </span>
              </Link>
            </div>

            {/* Middle Section: Navigation Links */}

            <div className="flex-1 hidden lg:flex justify-center gap-6 text-lg text-black font-semibold px-6">
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
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="border border-primary rounded-full px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary">
                  <Link href="#">
                    <Search className="w-5 h-5" />
                  </Link>
                </button>
              </div>

              {/* Authentication Buttons */}
              <div className="flex items-center gap-4">
                {!user ? (
                  <>
                    <Link href="/sign-up">
                      <Button>Get Started</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <UserButton />
                    {/* Notification Icon */}
                    <Link href="#" className="text-primary">
                      <Megaphone className="w-6 h-6" />
                    </Link>
                    <Link
                      href="/Product"
                      className="px-2 hover:text-primary transition"
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
        </MaxWidthWrapper>
      </section>
    </nav>
  );
};

export default NavBar;

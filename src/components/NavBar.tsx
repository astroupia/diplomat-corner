"use client";

import MaxWidthWrapper from "./MaxWidthWrapper";
import React from "react";
import { SignUpButton, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Search, Bell , Megaphone } from "lucide-react";
import Navitems from "./Navitem";
import { nav } from "framer-motion/client";

const NavBar = () => {
    const { user } = useUser();
    const isAdmin =
    user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    return (
        <nav className="bg-white border border-primary rounded-full px-6 py-2 sticky top-0 z-10 shadow-md mt-4 ml-3 mr-3">
        <section >
        <MaxWidthWrapper>
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left Section: Brand Logo */}
            <div className="flex items-center">
            <Link href="/app/page">
                <span className="text-black font-bold text-lg">
                Diplomat
                <br /><span className="text-primary">Corner</span>
                </span>
            </Link>
            </div>


          {/* Middle Section: Navigation Links */}


            <div className="flex-1 hidden lg:flex justify-center gap-6 text-lg text-gray-600 font-semibold px-6">
            <Link href="#" className="hover:text-primary transition">
                Car For Sale
            </Link>
            <Link href="#" className="hover:text-primary transition">
                House For Rent
            </Link>
            <Link href="#" className="hover:text-primary transition">
                Grocery
            </Link>
            <Link href="#" className="hover:text-primary transition">
                Items For Sale
            </Link>
            <Link
            href="/AboutUs" className="hover:text-primary transition">
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

            {/* Notification Icon */}
            <Link href="#"className="text-primary">
            <Megaphone  className="w-6 h-6" />
            </Link>

            {/* Authentication Buttons */}
            <div className="flex items-center gap-4">
            {!user ? (
                <>
                <SignUpButton />
                <SignInButton />
                </>
            ) : (
                <>
                <UserButton />
                {isAdmin && (
                    <span className="text-sm text-primary font-bold">Admin</span>
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

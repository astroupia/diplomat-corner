    "use client";

    import MaxWidthWrapper from "./MaxWidthWrapper";
    import React from "react";
    import { SignUp, SignIn, UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

    const NavBar = () => {
    const { user } = useUser();
    const isAdmin =user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    return (
        <nav className="bg-white border border-primary  rounded-full mx-4 my-2 px-6 py-2">
        <MaxWidthWrapper>
            <div className="flex items-center justify-between">
            {/* Left Section: Brand Logo */}
            <div className="flex items-center">
                <span className="text-black font-bold text-lg">
                Diplomat<span className="text-primary ">Corner</span>
                </span>
            </div>

            {/* Middle Section: Navigation Links */}
            <div className="flex-1 flex justify-center gap-6 text-sm text-gray-600">
                <a href="#" className="hover:text-primary  transition">
                Car For Sale
                </a>
                <a href="#" className="hover:text-primary  transition">
                House For Rent
                </a>
                <a href="#" className="hover:text-primary  transition">
                Grocery
                </a>
                <a href="#" className="hover:text-primary  transition">
                Items For Sale
                </a>
            </div>

            {/* Right Section: Search and Authentication */}
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative">
                <input
                    type="text"
                    placeholder="Search"
                    className="border border-primary  rounded-full px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-primary "
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary ">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m-3.65 1.35a7.5 7.5 0 110-15 7.5 7.5 0 010 15z"
                    />
                    </svg>
                </button>
                </div>

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
                        <span className="text-sm text-primary  font-bold">
                        Admin
                        </span>
                    )}
                    </>
                )}
                </div>
            </div>
            </div>
        </MaxWidthWrapper>
        </nav>
    );
    };

    export default NavBar;

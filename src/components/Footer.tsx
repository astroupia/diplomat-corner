    import React from "react";
    import { SignUpButton, SignInButton, UserButton, useUser } from "@clerk/nextjs";


    const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-black-200 py-8">
        <div className="container mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
            <div>

            <p className="text-sm text-primary mt-1">&copy; 2024</p>
            </div>
            <div>
            <h2 className="text-lg font-semibold text-primary mb-2">Connect</h2>
            <ul>
                <li>
                <a href="#" className="text-black hover:text-gray-800">
                    Contact
                </a>
                </li>
                <li>
                <a href="#" className="text-black hover:text-gray-800">
                    About Us
                </a>
                </li>
            </ul>
            </div>
            <div>
            <h2 className="text-lg font-semibold text-primary mb-2">Services</h2>
            <ul>
                <li>
                <a href="" className="text-black hover:text-gray-800">
                    Car For Sale
                </a>
                </li>
                <li>
                <a href="/HouseForRent" className="text-black hover:text-gray-800">
                    House For Rent
                </a>
                </li>
                <li>
                <a href="#" className="text-black hover:text-gray-800">
                    Grocery
                </a>
                </li>
                <li>
                <a href="#" className="text-black hover:text-gray-800">
                    Items For Sale
                </a>
                </li>
                <li>
                <a href="/aboutus" className="text-black hover:text-gray-800">
                    About Us
                </a>
                </li>
            </ul>
            </div>
            <div>
            <h2 className="text-lg font-semibold text-primary mb-2">Resources</h2>
            <ul>
                <li>
                <a href="#" className="text-black hover:text-gray-800">
                    Terms and Services
                </a>
                </li>
                <li>
                <a href="#" className="text-black hover:text-gray-800">
                    Policy
                </a>
                </li>
                <li>
                <a href="/Product" className="text-black hover:text-gray-800">
                    Shop
                </a>
                </li>
                <li>
                <a href="#" className="text-black hover:text-gray-800">
                    Log In
                </a>
                </li>
            </ul>
            </div>
            <div>
            <h2 className="text-lg font-semibold text-primary mb-2">Account</h2>
            <ul>
                <li>
                <SignInButton />
                </li>
                <li>
                <SignUpButton />
                </li>
                <li>
                <a href="#" className="text-black hover:text-gray-800">
                    Profile
                </a>
                </li>
            </ul>
            </div>
        </div>
        </footer>
    );
    };

    export default Footer;

    import React from "react";
import Card from "./CardHouse";

    const Page: React.FC = () => {
    const properties = [
        {
        address: "92 Allium Place, Orlando FL 32827",
        price: 590693,
        bedrooms: 4,
        bathrooms: 4,
        size: 2096,
        },
        {
        address: "74 Maple Avenue, Miami FL 33101",
        price: 750000,
        bedrooms: 5,
        bathrooms: 3,
        size: 2800,
        },
        {
        address: "10 Pine Street, Tampa FL 33607",
        price: 450000,
        bedrooms: 3,
        bathrooms: 2,
        size: 1800,
        },

        {
            address: "92 Allium Place, Orlando FL 32827",
            price: 590693,
            bedrooms: 4,
            bathrooms: 4,
            size: 2096,
            },
            {
            address: "74 Maple Avenue, Miami FL 33101",
            price: 750000,
            bedrooms: 5,
            bathrooms: 3,
            size: 2800,
            },
            {
            address: "10 Pine Street, Tampa FL 33607",
            price: 450000,
            bedrooms: 3,
            bathrooms: 2,
            size: 1800,
            },
    ];

    return (
        <div>
        {/* Cover Section */}
        <div
            className="relative h-64 bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: 'url("/c.jpg")' }}
        >
            <div className="text-center text-white">
            <h1 className="text-4xl font-bold">Properties</h1>
            <p className="text-lg mt-2">Service / House for Rent</p>
            </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">All Properties</h2>
                <select className="border border-gray-300 rounded px-3 py-1 text-gray-600">
                <option>Default Order</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
                </select>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property, index) => (
                <Card key={index} {...property} />
                ))}
            </div>
            </div>
        </div>
        </div>
    );
    };  

    export default Page;

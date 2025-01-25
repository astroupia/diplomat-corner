"use client"; 

import { Upload, Wifi, Home, Car, Check, PlayCircle, Church, Dumbbell, Circle, CheckCircle, ShoppingCart, Plus, Pen, Tv } from "lucide-react";
import { useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";

const ProductForm = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [paymentTerm, setPaymentTerm] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");

  const essentials = [
    "WiFi",
    "Furnished",
    "Play Ground",
    "Living Area",
    "GYM",
    "Outdoor",
    "Dining Area",
    "Jacuzzi",
    "Steam",
  ];

  const toggleSelection = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
  <section className="flex flex-col min-h-screen">
    <MaxWidthWrapper>
      <h1 className="text-xl md:text-2xl font-semibold text-primary m-6">Manage Products and Ads</h1>
  
      <div className="flex flex-col lg:flex-row bg-secondary h-auto lg:h-screen bg-primary-light p-4 lg:p-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/5 bg-secondary rounded-3xl shadow-md p-4 border-2 border-primary  lg:mb-0 pr-7 mr-4 ">  
          <ul className="space-y-4 text-primary font-semibold text-sm md:text-base">
            <li className="flex flex-row"><ShoppingCart size={20}/>Products</li>
            <li className="pl-4 flex flex-row text-primary"><Plus/> Add Products</li>
            <li className="pl-4 text-primary flex flex-row"><Pen/> Edit Products</li>
            <li className="flex flex-row"><Tv/>Adverts</li>
            <li className="pl-4 flex flex-row text-primary"><Plus/>Add Adverts</li>
            <li className="pl-4 flex flex-row text-primary"><Pen/> Edit Adverts</li>
          </ul>
        </aside>
  
        {/* Main Content */}
        <main className="flex-1 bg-white border-2 border-primary rounded-3xl shadow-md p-4 lg:p-6 ">
          {/* Buttons for Product Type */}
          <div className="flex flex-col pl-7 sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6 h-30">
            <Link
            href="/CarProduct">
            <button className="flex items-center justify-center space-x-2 bg-white  text-primary px-6 py-3 border border-primary rounded-lg shadow-md w-full sm:w-auto hover:bg-secondary ">
              <Car size={20} />
              <span className="font-semibold">Car For Sale</span>
            </button>
            </Link>
            <Link
            href="/Product">
            <button className="flex items-center justify-center space-x-2 bg-secondary text-primary px-6 py-3 rounded-lg shadow-md border border-primary w-full sm:w-auto ">
              <Home size={20} />
              <span className="font-semibold">House For Rent</span>
            </button>
            </Link>
          </div>
  
          {/* Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl border-primary p-4 lg:p-6"> 
            {/* Left Section */}
            <div className="col-span-12 lg:col-span-8 space-y-6 bg-secondary p-4 lg:p-6 rounded-3xl shadow-md border-3 border-primary ">
              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bedroom Input */}
                <div>
                  <label className="block text-sm font-semibold text-primary">Bedroom</label>
                  <input
                    type="number"
                    className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary"
                    placeholder="5"
                  />
                </div>
  
                {/* Buttons Next to Bedroom */}
                <div className="flex justify-start space-x-4">
                  <button className="flex flex-col items-center space-y-2 bg-white text-primary px-4 py-2 rounded-lg shadow-md">
                    <Home size={36} />
                    <span className="text-sm font-semibold">House</span>
                  </button>
                  <button className="flex flex-col items-center space-y-2 bg-secondary text-primary px-4 py-2 rounded-lg shadow-md border border-primary">
                    <Home size={36} />
                    <span className="text-sm font-semibold">Apartment</span>
                  </button>
                  <button className="flex flex-col items-center space-y-2 bg-secondary text-primary px-4 py-2 rounded-lg shadow-md border border-primary">
                    <PlayCircle size={36} />
                    <span className="text-sm font-semibold">Guest House</span>
                  </button>
                </div>
              </div>
  
              {/* Size and Bathroom Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary">Size</label>
                  <input
                    type="text"
                    className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary"
                    placeholder="225 sq m"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary">Bathroom</label>
                  <input
                    type="number"
                    className="w-full p-2 border-b-2 border-primary focus:outline-none focus:border-primary bg-secondary"
                    placeholder="3"
                  />
                </div>
              </div>
  
              {/* Essentials Section */}
              <div>
                <p className="text-sm font-semibold text-primary mb-4">Essentials</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {essentials.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleSelection(item)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-md text-sm font-semibold ${
                        selected.includes(item)
                          ? "bg-primary text-white border border-primary"
                          : "bg-secondary text-black border border-black"
                      }`}
                    >
                      {selected.includes(item) ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Circle size={16} />
                      )}
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Right Section */}
            <div className="col-span-12 lg:col-span-4 space-y-6 border-2 border-primary p-4 lg:p-6 rounded-3xl shadow-md">
              {/* Image Upload */}
              <div className="h-40 flex flex-col items-center justify-center border-dashed border-2 border-primary rounded-lg">
                <Upload size={40} className="text-primary" />
                <p className="mt-4 text-sm text-primary">Upload media for the campaign</p>
              </div>
  
              {/* Condition and Maintenance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary">Condition</label>
                  <input
                    type="text"
                    className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1"
                    placeholder="Excellent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary">Maintenance</label>
                  <input
                    type="text"
                    className="w-full border-b-2 border-primary focus:outline-none focus:border-primary p-1"
                    placeholder="Frequent"
                  />
                </div>
              </div>
  
              {/* Currency and Payment Terms */}
              <div>
                <p className="text-sm font-semibold text-primary mb-4">Currency</p>
                <div className="flex space-x-4">
                  {["ETB", "USD"].map((currencyOption) => (
                    <label
                      key={currencyOption}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-semibold ${
                        currency === currencyOption
                          ? "bg-primary text-white border border-primary"
                          : "bg-white text-black border border-black"
                      }`}
                    >
                      <input
                        type="radio"
                        name="currency"
                        value={currencyOption}
                        checked={currency === currencyOption}
                        onChange={() => setCurrency(currencyOption)}
                        className="hidden"
                      />
                      {currency === currencyOption ? <CheckCircle size={16} /> : <Circle size={16} />}
                      <span>{currencyOption}</span>
                    </label>
                  ))}
                </div>
              </div>
  
              {/* Payment Terms */}
              <div className="mt-4">
                <p className="text-sm font-semibold text-primary mb-2">Payment Terms</p>
                <div className="flex flex-wrap gap-4">
                  {["Monthly", "Quarter", "Annual"].map((term) => (
                    <label
                      key={term}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-semibold ${
                        paymentTerm === term
                          ? "bg-primary text-white border border-primary"
                          : "bg-white text-black border border-black"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={term}
                        checked={paymentTerm === term}
                        onChange={() => setPaymentTerm(term)}
                        className="hidden"
                      />
                      {paymentTerm === term ? <CheckCircle size={16} /> : <Circle size={16} />}
                      <span>{term}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MaxWidthWrapper>
  </section>
  
  );
};

export default ProductForm;

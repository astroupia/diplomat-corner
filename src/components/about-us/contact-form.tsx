"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Twitter,
  Instagram,
  LucideGithub,
  CheckCircle,
  Circle,
} from "lucide-react";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex flex-wrap bg-gray-100 p-8">
      {/* Contact Information */}
      <div className="relative w-full md:w-1/3 bg-primary text-white p-6 rounded-l-lg">
        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
        <p className="mb-36">Say something to start a live chat!</p>
        <ul className="space-y-8">
          <li className="mb-4 flex items-center">
            <Phone className="mr-2" /> +251910111213
          </li>
          <li className="mb-4 flex items-center">
            <Mail className="mr-2" /> ethio@gmail.com
          </li>
          <li className="mb-4 flex items-center">
            <MapPin className="mr-2" /> Addis Ababa, Dembel Kebede Building
          </li>
        </ul>
        {/* Social Media Icons */}
        <div className="absolute bottom-4 left-6 flex space-x-4">
          <a href="#" className="text-white hover:text-gray-200">
            <Twitter />
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            <Instagram />
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            <LucideGithub />
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="w-full md:w-2/3 bg-white p-6 rounded-r-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-primary"
                onChange={handleChange}
                value={formData.firstName}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-primary"
                onChange={handleChange}
                value={formData.lastName}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-primary"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-primary"
                onChange={handleChange}
                value={formData.phone}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-green-800">
              Select Subject
            </label>
            <div className="flex flex-wrap space-x-4">
              {["General Inquiry", "Advert has errors", "Want admin"].map(
                (option) => (
                  <button
                    key={option}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      formData.subject === option
                        ? "bg-primary text-white border border-primary"
                        : " text-black border "
                    }`}
                    onClick={() =>
                      handleChange({
                        target: { name: "subject", value: option },
                      })
                    }
                  >
                    {formData.subject === option ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Circle size={16} />
                    )}
                    <span>{option}</span>
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={4}
              className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-primary"
              onChange={handleChange}
              value={formData.message}
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-hoverPrimary"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

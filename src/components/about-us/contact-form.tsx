"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Twitter,
  Instagram,
  Github,
  CheckCircle,
  Circle,
  Send,
  Loader2,
} from "lucide-react";
import { submitContactForm } from "@/lib/actions/review.actions";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry" as
      | "General Inquiry"
      | "Advert has errors"
      | "Want admin",
    message: "",
  });
  const [isPending, startTransition] = useTransition();
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    errors?: any[];
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitContactForm(
        new FormData(e.target as HTMLFormElement)
      );
      setSubmitResult(result);
      if (result.success) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "General Inquiry",
          message: "",
        });
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100"
    >
      <div className="flex flex-wrap">
        <div className="relative w-full bg-primary p-6 text-white md:w-2/5 lg:p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="mb-4 text-xl font-bold">Contact Information</h2>
            <p className="mb-8 text-white/80 text-sm">
              Have questions or feedback? We&apos;re here to help!
            </p>

            <ul className="space-y-5">
              <li className="flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm">+251 910 111 213</span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm">contact@diplomatcorner.com</span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm">
                  Addis Ababa, Dembel Kebede Building
                </span>
              </li>
            </ul>

            <div className="absolute bottom-6 left-6 flex space-x-3">
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full border border-white/10 opacity-20"></div>
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full border border-white/10 opacity-20"></div>
        </div>

        <div className="w-full p-6 md:w-3/5 lg:p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {submitResult && submitResult.success ? (
              <div className="flex h-full flex-col items-center justify-center py-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Message Sent!
                </h3>
                <p className="mb-6 text-center text-gray-600 text-sm">
                  {submitResult.message}
                </p>
                <button
                  onClick={() => setSubmitResult(null)}
                  className="rounded-lg bg-primary px-5 py-2 text-sm text-white transition-colors hover:bg-primary/90"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      required
                      className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleChange}
                      value={formData.firstName}
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      required
                      className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleChange}
                      value={formData.lastName}
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleChange}
                      value={formData.email}
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      onChange={handleChange}
                      value={formData.phone}
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Select Subject
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        "General Inquiry",
                        "Advert has errors",
                        "Want admin",
                      ] as const
                    ).map((option) => (
                      <button
                        key={option}
                        type="button"
                        disabled={isPending}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                          formData.subject === option
                            ? "bg-primary text-white"
                            : "border border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, subject: option })
                        }
                      >
                        {formData.subject === option ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Circle className="h-3 w-3" />
                        )}
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    name="subject"
                    value={formData.subject}
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="message"
                    className="mb-1 block text-xs font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    onChange={handleChange}
                    value={formData.message}
                    disabled={isPending}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-70"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  {submitResult && !submitResult.success && (
                    <div className="mt-3">
                      <p className="text-xs text-red-600">
                        {submitResult.message}
                      </p>
                      {submitResult.errors && (
                        <ul className="mt-1 list-disc pl-5 text-xs text-red-600">
                          {submitResult.errors.map((error, index) => (
                            <li key={index}>{error.message}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactForm;

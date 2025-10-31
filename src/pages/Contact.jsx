"use client";

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaSnapchatGhost,
} from "react-icons/fa";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";

export default function Contact() {
  return (
    <>
      <section className="bg-gray-50 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-center">
          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mt-6 mb-10 text-center tracking-tighter">
            Talk to our team
          </h1>

          {/* Contact Container */}
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
            {/* Left: Contact Info */}
            <div className="bg-blue-600 text-white p-8 sm:p-10 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
                Get in Touch
              </h2>
              <p className="mb-8 text-blue-100 text-base sm:text-lg">
                We’d love to hear from you! Feel free to reach out using the
                details below.
              </p>

              <div className="space-y-4">
                {/* Phone */}
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl">Phone</h3>
                  <a
                    href="tel:+97433000109"
                    className="text-blue-100 hover:text-white transition text-sm sm:text-base"
                  >
                    +974 33000109
                  </a>
                </div>

                {/* Email */}
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl">Email</h3>
                  <a
                    href="mailto:ux@catalogueya.com"
                    className="text-blue-100 hover:text-white transition text-sm sm:text-base break-all"
                  >
                    ux@catalogueya.com
                  </a>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:space-x-5 mt-8">
                {[
                  { icon: <FaFacebookF size={20} />, url: "https://www.facebook.com" },
                  { icon: <FaInstagram size={20} />, url: "https://www.instagram.com" },
                  { icon: <FaTiktok size={20} />, url: "https://www.tiktok.com" },
                  { icon: <FaSnapchatGhost size={20} />, url: "https://www.snapchat.com" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Contact Form */}
            <section className="p-8 sm:p-10 md:p-12 flex flex-col space-y-5 bg-white">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                Send Us a Message
              </h2>

              <input
                type="text"
                placeholder="Your Name"
                className="p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />

              <input
                type="email"
                placeholder="Your Email"
                className="p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />

              <textarea
                rows="4"
                placeholder="Your Message"
                className="p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none"
                required
              ></textarea>

              <button
                type="submit"
                className="bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 text-sm sm:text-base"
              >
                Send Message
              </button>
            </section>
          </div>
        </div>
      </section>

      {/* FAQ Section Below */}
      <Faq />

      {/* Call To Action Section */}
      <CallToAction />
    </>
  );
}

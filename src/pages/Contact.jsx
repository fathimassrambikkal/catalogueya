"use client";

import React, { memo, lazy, Suspense } from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaSnapchatGhost } from "react-icons/fa";

const Faq = lazy(() => import("../components/Faq"));
const CallToAction = lazy(() => import("../components/CallToAction"));

// Social Icons
const socialLinks = [
  { icon: <FaFacebookF size={18} />, url: "https://www.facebook.com/share/1BGBgzNm9d/?mibextid=wwXIfr" },
  { icon: <FaInstagram size={18} />, url: "https://www.instagram.com/catalogueya.qa?igsh=b3k0MGY5Z21la3Bz" },
  { icon: <FaTiktok size={18} />, url: "https://www.tiktok.com/@catalogueya.qa?lang=en-GB" },
  { icon: <FaSnapchatGhost size={18} />, url: "https://snapchat.com/t/2LvJi7m4" },
];

const SocialIcon = memo(({ icon, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="
      w-16 h-16
      flex items-center justify-center
      rounded-2xl
      bg-neutral-100
      border-[3px] border-white
      shadow-[6px_6px_16px_rgba(0,0,0,0.12),-6px_-6px_16px_rgba(255,255,255,0.9)]
      hover:shadow-[3px_3px_10px_rgba(0,0,0,0.18),-3px_-3px_10px_rgba(255,255,255,1)]
      transition-all
    "
  >
    <div className="text-[#3d7bfd] text-[22px]">
      {icon}
    </div>
  </a>
));

export default function Contact() {
  return (
    <>
      <section className="bg-neutral-100 py-16 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-center">

          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-10 mt-8 tracking-tight text-center">
            Talk to our team
          </h1>

          {/* 🌟 OUTER BLURRED BORDER WRAPPER */}
          <div
            className="
              w-full max-w-3xl
              p-[7px]
              rounded-[34px]
              bg-white/5
              backdrop-blur-3xl
              border-[2px]
            "
          >

            {/* 🌟 SINGLE NEUMORPHIC CARD */}
            <div
              className="
                bg-white
                rounded-[30px]
                p-10
                flex flex-col
                space-y-10
                shadow-[8px_8px_25px_rgba(0,0,0,0.12),-8px_-8px_25px_rgba(255,255,255,0.8)]
              "
            >

              {/* Contact details */}
              <div className="text-gray-900 flex flex-col items-center text-center">
                {/* You can add your contact info here if needed */}
              </div>

              {/* Form Section */}
              <div className="flex flex-col space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-medium block">Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-medium block">Email</label>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-medium block">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                </div>

                {/* Gradient Submit Button */}
                <button
                  className="
                    w-full
                    py-4
                    rounded-full
                    text-white
                    font-medium
                    text-sm
                    shadow-[0_8px_18px_rgba(0,0,0,0.15)]
                    bg-blue-500
                    border-4 border-white
                    transition-all
                    hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)]
                    hover:brightness-110
                    mt-4
                  "
                >
                  Submit
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <Faq />
        <CallToAction />
      </Suspense>
    </>
  );
}
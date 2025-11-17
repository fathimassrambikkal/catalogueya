"use client";

import React, { memo, lazy, Suspense} from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaSnapchatGhost } from "react-icons/fa";

// Lazy-load heavy components
const Faq = lazy(() => import("../components/Faq"));
const CallToAction = lazy(() => import("../components/CallToAction"));

// Memoized Social Icons (outside render)
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
    className="bg-white border border-gray-200 text-gray-700 p-3 rounded-full hover:bg-gray-50 hover:shadow transition-transform transform-gpu will-change-transform"
  >
    {icon}
  </a>
));

const ContactForm = memo(() => (
  <section className="p-10 flex flex-col space-y-5 bg-white">
    <h2 className="text-2xl font-semibold text-gray-800">Send Us a Message</h2>

    <input
      type="text"
      placeholder="Your Name"
      className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      required
    />

    <input
      type="email"
      placeholder="Your Email"
      className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      required
    />

    <textarea
      rows={4}
      placeholder="Your Message"
      className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
      required
    />

    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition text-sm"
    >
      Send Message
    </button>
  </section>
));

export default function Contact() {
  return (
    <>
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-center">
          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-10 mt-8 text-center tracking-tight">
            Talk to our team
          </h1>

          {/* Contact Container */}
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg border border-gray-100 grid grid-cols-1 md:grid-cols-2 overflow-hidden backdrop-blur-sm">
            {/* Left: Contact Info */}
            <div className="bg-neutral-100 text-gray-900 p-10 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-6 tracking-tight">Get in Touch</h2>
              <p className="mb-8 text-gray-600 text-base leading-relaxed">
                We’d love to hear from you! Feel free to reach out using the details below.
              </p>

              <div className="space-y-5">
                {/* Phone */}
                <div>
                  <h3 className="font-medium text-lg text-gray-800">Phone</h3>
                  <a href="tel:+97433000109" className="text-gray-600 hover:text-gray-900 transition text-sm">
                    +974 33000109
                  </a>
                </div>

                {/* Email */}
                <div>
                  <h3 className="font-medium text-lg text-gray-800">Email</h3>
                  <a href="mailto:ux@catalogueya.com" className="text-gray-600 hover:text-gray-900 transition text-sm break-all">
                    ux@catalogueya.com
                  </a>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-4 mt-8">
                {socialLinks.map((s, i) => (
                  <SocialIcon key={i} icon={s.icon} url={s.url} />
                ))}
              </div>
            </div>

            {/* Right: Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Lazy-loaded Heavy Components */}
      <Suspense fallback={null}>
        <Faq />
        <CallToAction />
      </Suspense>
    </>
  );
}

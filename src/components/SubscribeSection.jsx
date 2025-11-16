"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { MdOutlineFeaturedPlayList, MdLocationSearching, MdEmail } from "react-icons/md";
import { FaImages } from "react-icons/fa6";
import { RiCustomerServiceFill } from "react-icons/ri";

const cardData = [
  {
    icon: <MdLocationSearching className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />,
    text: "Appear in search results for your service category and region",
  },
  {
    icon: <RiCustomerServiceFill className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />,
    text: "Gain access to lead inquiries and customer quote requests",
  },
  {
    icon: <FaImages className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />,
    text: "Showcase reviews, photos, new products, and promotions",
  },
  {
    icon: <MdOutlineFeaturedPlayList className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />,
    text: "Be featured in Catalogueya’s digital displays that reach a wider audience",
  },
  {
    icon: <MdEmail className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />,
    text: (
      <>
        For questions, contact our Partner Support Team at{" "}
        <a
          href="mailto:ux@catalogueya.com"
          className="text-blue-600 underline hover:text-blue-800"
        >
          ux@catalogueya.com
        </a>
      </>
    ),
  },
];

// Card animation variants
const cardVariant = {
  hidden: { opacity: 0, y: -20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const SubscribeSection = memo(() => {
  return (
    <section className="relative flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-12 py-10 overflow-hidden">
      {/* Animated Heading */}
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tighter flex flex-wrap justify-center mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        Subscribe Now
      </motion.h1>

      {/* Cards */}
      <div className="flex flex-col items-center justify-center w-full gap-4 sm:gap-6">
        {cardData.map((card, i) => (
          <motion.div
            key={i}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white shadow-2xl rounded-2xl px-4 sm:px-6 py-6 sm:py-8 w-full max-w-[90%] sm:max-w-md md:max-w-4xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mx-auto text-center sm:text-left transform-gpu will-change-transform"
          >
            <div className="flex-shrink-0">{card.icon}</div>
            <p className="text-base sm:text-lg font-medium">{card.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

export default SubscribeSection;

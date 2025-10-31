"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScrollVelocityContainer, ScrollVelocityRow } from "../ui/scroll-based-velocity";
import slider1 from "../assets/slider1.jpg";
import slider2 from "../assets/slider2.jpg";
import slider3 from "../assets/slider3.jpg";
import slider4 from "../assets/slider4.jpg";
import slider5 from "../assets/slider5.avif";
import slider6 from "../assets/slider6.jpg";
import slider7 from "../assets/slider7.jpg";
import slider8 from "../assets/slider8.jpg";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import logo4 from "../assets/logo4.png";
import logo5 from "../assets/logo5.png";
import logo6 from "../assets/logo6.png";
import SubscribeSection from "../components/SubscribeSection";
import CallToAction from "../components/CallToAction";

const sliderImages = [slider1, slider2, slider3, slider4, slider5, slider6, slider7, slider8];
const clientLogos = [logo1, logo2, logo3, logo4, logo5, logo6];

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-50 flex flex-col items-center py-16 px-4 sm:px-6 md:px-16 lg:px-20">
        {/* About Us badge */}
        <span className="inline-block font-medium text-gray-800 px-4 py-2 text-xs sm:text-sm md:text-base bg-white/10 backdrop-blur-2xl border border-white/30  p-12 shadow-[0_8px_40px_rgba(0,0,0,0.1)] rounded-full hover:bg-gray-100 transition mb-8 text-center mt-10">
          About Us
        </span>

        {/* Headings */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 lg:gap-12 mt-8">
          <div className="flex-1 flex flex-col items-center lg:items-start gap-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
              Trusted home
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
              services
            </h2>
          </div>

          <div className="flex-1 mt-4 lg:mt-0 text-center lg:text-left">
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
              Catalogueya is your go-to platform for trusted home services. Discover verified professionals for every part of your home from repairs and renovations to cleaning and landscaping. We feature only reliable, subscribed businesses you can trust.
            </p>
          </div>
        </div>

        {/* Improved Slider */}
        <ScrollVelocityContainer className="w-full py-12 md:py-16">
          <ScrollVelocityRow baseVelocity={3} direction={1} className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-start items-center">
            {sliderImages.map((img, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="flex-shrink-0 w-[220px] sm:w-[250px] md:w-[300px] lg:w-[320px] xl:w-[360px] h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 shadow-lg rounded-3xl overflow-hidden">
                <img src={img} alt={`slide-${i}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </section>

      {/* Client Logos Section */}
      <section className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-16 lg:px-20 bg-gray-50 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 lg:gap-12 mb-8 md:mb-12">
          <div className="flex-1 flex flex-col items-center lg:items-start gap-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
              Partners in
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
              Progress
            </h2>
          </div>

          <div className="flex-1 mt-4 lg:mt-0 text-center lg:text-left">
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
              <span className="text-gray-950 font-medium">Long-term relationships</span> built on creative trust, <br /> shared ambition, and measurable results.
            </p>
          </div>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-6xl mx-auto py-8 md:py-16">
          {clientLogos.map((logo, i) => (
            <img key={i} src={logo} alt={`client-logo-${i}`} className="w-full h-32 sm:h-36 md:h-44 object-contain rounded-2xl" />
          ))}
        </div>
      </section>

      {/* Subscribe Section */}
      <SubscribeSection />
     <CallToAction/>
    </>
  );
}

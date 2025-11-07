import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import banner1 from "../assets/banner1.avif";
import banner2 from "../assets/banner2.avif";
import banner3 from "../assets/banner3.avif";
import SearchBar from "../components/SearchBar";

const images = [banner1, banner2, banner3];

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [startSlider, setStartSlider] = useState(false);

  // Preload first image
  useEffect(() => {
    const img = new Image();
    img.src = images[0];
    img.onload = () => setFirstImageLoaded(true);
  }, []);

  // Window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Start slider after first image loads
  useEffect(() => {
    if (!firstImageLoaded) return;
    const timer = setTimeout(() => setStartSlider(true), 2000);
    return () => clearTimeout(timer);
  }, [firstImageLoaded]);

  // Slider autoplay
  useEffect(() => {
    if (!startSlider) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [startSlider]);

  const sectionHeight =
    windowWidth < 640 ? "h-[60vh]" : "h-[90vh] md:h-[90vh] lg:h-screen";

  const container = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const child = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
  };

  const headingText = "Welcome to Catalogueya";

  return (
    <section
      className={`relative w-full ${sectionHeight} overflow-hidden flex items-center justify-center bg-gray-200`}
    >
      {/* Banner Images */}
      {images.map((img, index) => {
        const isActive = index === currentIndex;
        const firstImageZoom =
          index === 0 && !startSlider
            ? { scale: [1.2, 1], x: [-20, 0] }
            : { scale: 1, x: 0 };

        return (
          <motion.img
            key={index}
            src={img}
            alt={`banner-${index}`}
            loading="lazy"
            className={`absolute w-full h-full object-cover transition-opacity duration-[1200ms] ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            initial={firstImageZoom}
            animate={firstImageZoom}
            transition={{
              duration: index === 0 && !startSlider ? 2 : 0.8,
              ease: "easeOut",
            }}
          />
        );
      })}

      {/* Content */}
      <div className="absolute z-10 inset-0 flex flex-col items-center justify-center gap-6 px-4">
        {/* Search Bar */}
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>

        {/* Heading */}
        <motion.h2
          variants={container}
          initial="hidden"
          animate={startSlider ? "visible" : "hidden"}
          className="font-extrabold tracking-tight text-center text-white
                     drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex flex-wrap justify-center
                     text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl leading-tight px-4"
        >
          {headingText.split("").map((char, i) => (
            <motion.span key={i} variants={child} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={startSlider ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ delay: headingText.length * 0.05 + 0.2, duration: 1 }}
          className="text-white/90 text-md md:text-xl lg:text-2xl font-semibold tracking-wide text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] max-w-2xl -mt-4 sm:-mt-1"
        >
          Enhance Everyday Living.
        </motion.p>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20 p-1.5 rounded-full bg-white/20 backdrop-blur-md">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`${windowWidth < 640 ? "w-2.5 h-2.5" : "w-4 h-4"} rounded-full transition-colors ${
              idx === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </section>
  );
}

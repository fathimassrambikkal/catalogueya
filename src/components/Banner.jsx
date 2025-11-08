import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import banner1 from "../assets/banner1.avif";
import banner2 from "../assets/banner2.avif";
import banner3 from "../assets/banner3.avif";
import SearchBar from "../components/SearchBar";

const images = [banner1, banner2, banner3];

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ✅ Preload all images (async, non-blocking)
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () =>
        setLoadedImages((prev) => ({
          ...prev,
          [src]: true,
        }));
    });
  }, []);

  // ✅ Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Resize handler
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sectionHeight =
    windowWidth < 640 ? "h-[60vh]" : "h-[90vh] md:h-[90vh] lg:h-screen";

  // ✅ Text animation variants (unchanged)
  const container = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const child = {
    hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const headingText = "Welcome to Catalogueya";

  return (
    <section
      className={`relative w-full ${sectionHeight} overflow-hidden flex items-center justify-center`}
    >
      {/* ✅ Always show first image immediately */}
      <img
        src={images[0]}
        alt="banner-initial"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />

      {/* ✅ Fade between loaded images */}
      {images.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <motion.img
            key={index}
            src={src}
            alt={`banner-${index}`}
            className="absolute w-full h-full object-cover"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              opacity: loadedImages[src] ? (isActive ? 1 : 0) : 0,
              willChange: "opacity",
            }}
          />
        );
      })}

      {/* ✅ Content — appears immediately with text animation */}
      <motion.div
        className="absolute z-10 inset-0 flex flex-col items-center justify-center gap-6 px-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>

        <motion.h2
          variants={container}
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

        <motion.p
          variants={child}
          className="text-white/90 text-md md:text-xl lg:text-2xl font-semibold tracking-wide text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] max-w-2xl -mt-4 sm:-mt-1"
        >
          Enhance Everyday Living.
        </motion.p>
      </motion.div>

      {/* ✅ Navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20 p-1.5 rounded-full bg-white/20 backdrop-blur-md">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`${
              windowWidth < 640 ? "w-2.5 h-2.5" : "w-4 h-4"
            } rounded-full transition-colors ${
              idx === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import React, { memo, lazy, Suspense, useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

// Lazy-load heavy components
const SubscribeSection = lazy(() => import("../components/SubscribeSection"));
// const CallToAction = lazy(() => import("../components/CallToAction"));

// Images
import slider1 from "../assets/slider1.avif";
import slider2 from "../assets/slider2.avif";
import slider3 from "../assets/slider3.avif";
import slider4 from "../assets/slider4.avif";
import slider5 from "../assets/slider5.avif";
import slider6 from "../assets/slider6.avif";
import slider7 from "../assets/slider7.webp";
import slider8 from "../assets/slider8.avif";

import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import logo4 from "../assets/logo4.png";
import logo5 from "../assets/logo5.png";
import logo6 from "../assets/logo6.png";

// Static arrays outside component
const sliderImages = [slider1, slider2, slider3, slider4, slider5, slider6, slider7, slider8];
const clientLogos = [logo1, logo2, logo3, logo4, logo5, logo6];

// Optimized Logo Item with loading state
const LogoItem = memo(({ logo, index }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="flex-shrink-0 w-48 h-32">
      <img
        src={logo}
        alt={`client-logo-${index}`}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
});

// Optimized Parallax Gallery Component
const ParallaxGallery = ({ images }) => {
  const gallery = useRef(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  // Smoother spring-based scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { height } = dimension;
  
  // Respect reduced motion preference
  const y = shouldReduceMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, height * 2]);
  const y2 = shouldReduceMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, height * 3.3]);
  const y3 = shouldReduceMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, height * 1.25]);
  const y4 = shouldReduceMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    let timeoutId;
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    // Throttled resize handler
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(resize, 100);
    };

    window.addEventListener("resize", throttledResize, { passive: true });
    resize(); // Initial call

    return () => {
      window.removeEventListener("resize", throttledResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      ref={gallery}
      className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-transparent p-[2vw]"
    >
      <Column images={[images[0], images[1], images[2]]} y={y} />
      <Column images={[images[3], images[4], images[5]]} y={y2} />
      <Column images={[images[6], images[7]]} y={y3} />
      <Column images={[images[2], images[4], images[6]]} y={y4} />
    </div>
  );
};

// Optimized Column Component with lazy loading
const Column = memo(({ images, y }) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[200px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <LazyImage key={i} src={src} index={i} />
      ))}
    </motion.div>
  );
});

// Lazy loaded image with intersection observer
const LazyImage = memo(({ src, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '100px' } // Load 100px before entering viewport
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg">
      {isVisible && (
        <img
          src={src}
          alt={`gallery-image-${index}`}
          className="pointer-events-none object-cover w-full h-full"
          loading="lazy"
        />
      )}
    </div>
  );
});

// CSS-based Marquee for 60fps performance
const LogoMarquee = ({ logos }) => {
  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className="flex gap-8 animate-marquee">
        {logos.map((logo, index) => (
          <LogoItem key={index} logo={logo} index={index} />
        ))}
        {/* Duplicate for seamless loop */}
        {logos.map((logo, index) => (
          <LogoItem key={`dup-${index}`} logo={logo} index={index} />
        ))}
      </div>
    </div>
  );
};

// Add this CSS to your global styles for smooth marquee
/*
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 20s linear infinite;
  will-change: transform;
}
*/

export default function About() {
  // Preload critical images
  useEffect(() => {
    // Preload first few images for better perceived performance
    const preloadImages = [sliderImages[0], sliderImages[1], clientLogos[0]];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <>
      <div className="w-full bg-neutral-100">
        {/* Hero Section with Split Layout - Reduced space on mobile */}
        <section className="bg-neutral-100 flex flex-col items-center py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 lg:px-20">
          <span className="inline-block font-medium text-gray-800 px-4 py-2 text-xs sm:text-sm md:text-base bg-white/10 backdrop-blur-2xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.1)] rounded-full hover:bg-gray-100 transition mt-8 sm:mb-8 text-center">
            About Us
          </span>

          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 sm:gap-8 lg:gap-16 mt-6 sm:mt-8">
            <div className="flex-1 flex flex-col items-center lg:items-start gap-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
                Trusted home
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
                services
              </h2>
            </div>

            <div className="flex-1 mt-4 sm:mt-6 lg:mt-0 text-center lg:text-left">
              <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed font-light">
                Catalogueya is your go-to platform for trusted home services. Discover verified professionals for every part of your home from repairs and renovations to cleaning and landscaping. We feature only reliable, subscribed businesses you can trust.
              </p>
            </div>
          </div>
        </section>

        {/* Reduced space below paragraph */}
        <div className="h-12 sm:h-20 bg-neutral-100"></div>

        {/* Parallax Gallery */}
        <ParallaxGallery images={sliderImages} />

        {/* End Space */}
        <div className="relative flex h-20 sm:h-40 items-center justify-center bg-neutral-100">
        </div>

        {/* Client Logos Section */}
        <section className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-16 lg:px-20 bg-neutral-100 py-8 sm:py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4 sm:gap-6 lg:gap-12 mb-6 sm:mb-8 md:mb-12">
            <div className="flex-1 flex flex-col items-center lg:items-start gap-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
                Partners in
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
                Progress
              </h2>
            </div>

            <div className="flex-1 mt-4 sm:mt-6 lg:mt-0 text-center lg:text-left">
              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                <span className="text-gray-950 font-medium">Long-term relationships</span> built on creative trust, <br /> shared ambition, and measurable results.
              </p>
            </div>
          </div>

          {/* Logo Marquee */}
          <LogoMarquee logos={clientLogos} />
        </section>

        {/* Lazy-loaded Subscribe & CTA */}
        <Suspense fallback={null}>
          <SubscribeSection />
          {/* <CallToAction /> */}
        </Suspense>
      </div>
    </>
  );
}
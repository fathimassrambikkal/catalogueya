import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import banner1 from "../assets/banner1.avif";
import banner2 from "../assets/banner2.avif";
import banner3 from "../assets/banner3.avif";
import SearchBar from "../components/SearchBar";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";

// Fallback images
const fallbackImages = [banner1, banner2, banner3];

const fallbackResponsiveImages = [
  { src: banner1, alt: "Modern living room banner 1" },
  { src: banner2, alt: "Elegant kitchen interior banner 2" },
  { src: banner3, alt: "Cozy bedroom design banner 3" }
];

// Intersection Observer Hook
const useIsInViewport = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1 });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref]);

  return isIntersecting;
};

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const sectionRef = useRef(null);
  const isInViewport = useIsInViewport(sectionRef);
  const rafActive = useRef(true);

  // Use the hooks
  const { settings, loading: settingsLoading } = useSettings();
  const { fixedWords, loading: fixedWordsLoading } = useFixedWords();

  // Get dynamic content from APIs
  const responsiveImages = useMemo(() => {
    // If settings has hero_images, use them
    if (settings.hero_images) {
      try {
        const images = typeof settings.hero_images === 'string' 
          ? JSON.parse(settings.hero_images) 
          : settings.hero_images;
        
        return images.map((img, index) => ({
          src: img,
          alt: settings[`hero_image_alt_${index + 1}`] || `Banner image ${index + 1}`
        }));
      } catch (error) {
        console.error('Error parsing hero_images:', error);
        return fallbackResponsiveImages;
      }
    }
    return fallbackResponsiveImages;
  }, [settings]);

  const headingText = useMemo(() => {
    return settings.hero_title || fixedWords.heroTitle || "Welcome to Catalogueya";
  }, [settings.hero_title, fixedWords.heroTitle]);

  const subtitleText = useMemo(() => {
    return settings.hero_subtitle || fixedWords.heroSubtitle || "Enhance Everyday Living";
  }, [settings.hero_subtitle, fixedWords.heroSubtitle]);

  // Preload images from API or fallback
  useEffect(() => {
    const imagesToPreload = responsiveImages.length > 0 ? responsiveImages : fallbackResponsiveImages;
    
    imagesToPreload.forEach((img, index) => {
      const image = new Image();
      image.src = img.src;
      if (index === 0) {
        image.fetchPriority = 'high';
      }
    });
  }, [responsiveImages]);

  // Ultra-smooth auto-slide with requestAnimationFrame and proper cleanup
  useEffect(() => {
    const duration = 5000;
    
    const animate = (timestamp) => {
      if (!rafActive.current) return;
      
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      
      if (elapsed >= duration) {
        setCurrentIndex(prev => (prev + 1) % responsiveImages.length);
        lastTimeRef.current = timestamp;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Only animate when in viewport
    if (isInViewport && responsiveImages.length > 0) {
      rafActive.current = true;
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      rafActive.current = false;
    }

    return () => {
      rafActive.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInViewport, responsiveImages.length]);

  const sectionHeight = "h-[60vh] sm:h-[80vh] md:h-[90vh] lg:h-screen";

  // Motion variants - KEEPING THE EXACT SAME H1 EFFECT
  const container = useMemo(
    () => ({
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: { 
          staggerChildren: 0.02,
          willChange: "opacity, transform, filter"
        }
      }
    }),
    []
  );

  const child = useMemo(
    () => ({
      hidden: { 
        opacity: 0, 
        y: 20, 
        filter: "blur(6px)",
        willChange: "opacity, transform, filter"
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { 
          duration: 0.6, 
          ease: "easeOut",
          willChange: "opacity, transform, filter"
        }
      }
    }),
    []
  );

  const handleDotClick = useCallback((index) => {
    setCurrentIndex(index);
    lastTimeRef.current = performance.now();
  }, []);

  // Show loading state only if both APIs are loading and no cached data
  if (settingsLoading && fixedWordsLoading && Object.keys(settings).length === 0 && Object.keys(fixedWords).length === 0) {
    return (
      <section
        className={`relative w-full ${sectionHeight} overflow-hidden flex items-center justify-center transform-gpu bg-gray-200`}
        style={{ contentVisibility: 'auto' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto transform-gpu"></div>
          <p className="mt-4 text-gray-600 transform-gpu">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${sectionHeight} overflow-hidden flex items-center justify-center transform-gpu`}
      style={{ contentVisibility: 'auto' }}
    >
      {/* IMMEDIATE FIRST IMAGE - No delay with high priority */}
      <img
        src={responsiveImages[0]?.src || fallbackImages[0]}
        alt={responsiveImages[0]?.alt || fallbackResponsiveImages[0].alt}
        className="absolute inset-0 w-full h-full object-cover transform-gpu"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
        style={{ 
          transform: "translateZ(0)",
          contentVisibility: 'auto'
        }}
        onError={(e) => {
          console.error('Failed to load banner image:', responsiveImages[0]?.src);
          e.target.src = fallbackImages[0];
        }}
      />

      {/* Optimized image slides with GPU layers */}
      {responsiveImages.map((img, index) => {
        const isActive = index === currentIndex;
        return (
          <motion.img
            key={index}
            src={img.src}
            alt={img.alt}
            className="absolute w-full h-full object-cover transform-gpu"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              willChange: "opacity"
            }}
            style={{
              opacity: isActive ? 1 : 0,
              willChange: "opacity",
              transform: "translateZ(0)",
              backfaceVisibility: 'hidden',
              contentVisibility: isActive ? 'auto' : 'hidden'
            }}
            loading={index === 0 ? "eager" : "lazy"}
            decoding={index === 0 ? "sync" : "async"}
            fetchPriority={index === 0 ? "high" : "low"}
            onError={(e) => {
              console.error('Failed to load banner image:', img.src);
              e.target.src = fallbackImages[index] || fallbackImages[0];
            }}
          />
        );
      })}

      {/* Overlay Content - ADJUSTED FOR MOBILE ONLY */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 transform-gpu
                   pt-12 sm:pt-0"
        variants={container}
        initial="hidden"
        animate="visible"
        style={{ willChange: 'transform' }}
      >
        {/* Search Bar - Higher z-index within container */}
        <div className="w-full max-w-2xl transform-gpu relative z-30">
          <SearchBar />
        </div>

        {/* H1 Text - Lower z-index so dropdown appears above it */}
        <motion.h2
          variants={container}
          className="font-extrabold text-center text-white
                     drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex flex-wrap justify-center
                     text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl tracking-tight px-4 transform-gpu relative z-10"
          style={{ willChange: 'transform' }}
        >
          {headingText.split("").map((char, i) => (
            <motion.span 
              key={i} 
              variants={child} 
              className="inline-block transform-gpu"
              style={{ willChange: 'transform, opacity, filter' }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          variants={child}
          className="text-white/90 text-md md:text-xl lg:text-2xl font-semibold tracking-wide text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] max-w-2xl -mt-4 sm:-mt-1 transform-gpu relative z-10"
          style={{ willChange: 'transform' }}
        >
          {subtitleText}
        </motion.p>
      </motion.div>

      {/* Simple Navigation Dots - Just dot jump effect */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 transform-gpu">
        <div className="flex gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transform-gpu">
          {responsiveImages.map((_, idx) => (
            <button
              key={idx}
              className="relative group transform-gpu"
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{ willChange: 'transform' }}
            >
              <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 transform-gpu ${
                idx === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/40 group-hover:bg-white/60"
              }`} style={{ willChange: 'transform' }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
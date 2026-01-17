import React, { memo, lazy, Suspense, useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";

// Import LogoMarquee component
import LogoMarquee from "../components/LogoMarquee";

// Base URL from your API response
const BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// Regular function (not a hook)
const resolveImageUrl = (img) => {
  if (!img) return null;
  
  if (img.startsWith('http') || img.startsWith('//') || img.startsWith('data:')) {
    return img;
  }
  
  return `${BASE_URL}/${img.replace(/^\//, '')}`;
};

// Regular function (not a hook)
const safeParseArrayWithBaseUrl = (value) => {
  if (!value) return [];
  
  let result = [];
  
  try {
    if (Array.isArray(value)) {
      result = value.map(img => resolveImageUrl(img)).filter(Boolean);
    } else if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        result = parsed.map(img => resolveImageUrl(img)).filter(Boolean);
      }
    }
  } catch (err) {
    console.error('Failed to parse value:', err);
  }
  
  return result;
};

// Lazy-load heavy components
const SubscribeSection = lazy(() => import("../components/SubscribeSection"));

// Optimized Parallax Gallery
const ParallaxGallery = memo(({ images }) => {
  const gallery = useRef(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 40,
    restDelta: 0.001
  });

  const { height } = dimension;
  
  const y = shouldReduceMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, height * 2]);
  const y2 = shouldReduceMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, height * 3.3]);
  const y3 = shouldReduceMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, height * 1.25]);
  const y4 = shouldReduceMotion ? 0 : useTransform(smoothProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const updateDimension = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", updateDimension);
    updateDimension();

    return () => window.removeEventListener("resize", updateDimension);
  }, []);

  if (images.length < 8) return null;

  return (
    <div
      ref={gallery}
      className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-transparent p-[2vw]"
    >
      <Column images={images.slice(0, 3)} y={y} />
      <Column images={images.slice(3, 6)} y={y2} />
      <Column images={images.slice(6, 8)} y={y3} />
      <Column images={[images[2], images[4], images[6]]} y={y4} />
    </div>
  );
});

// Optimized Column Component
const Column = memo(({ images, y }) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[200px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <LazyImage key={`${src}-${i}`} src={src} index={i} />
      ))}
    </motion.div>
  );
});

// Lazy Image
const LazyImage = memo(({ src, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '300px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={ref} 
      className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg bg-gray-100"
    >
      {isVisible && (
        <img
          src={src}
          alt={`gallery-image-${index}`}
          className={`pointer-events-none object-cover w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={handleImageLoad}
          onError={(e) => {
            console.error(`Image ${index} failed: ${src}`);
            e.target.style.display = 'none';
          }}
        />
      )}
    </div>
  );
});

// Main About Component
export default function About() {
  const [isRTL, setIsRTL] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { settings } = useSettings();
  const { fixedWords } = useFixedWords();
  
  // Use useMemo properly inside component
  const fw = useMemo(() => fixedWords?.fixed_words || {}, [fixedWords]);
  const galleryImages = useMemo(() => 
    safeParseArrayWithBaseUrl(settings?.about_imgs), 
    [settings?.about_imgs]
  );
  const clientLogos = useMemo(() => 
    safeParseArrayWithBaseUrl(settings?.partners_imgs), 
    [settings?.partners_imgs]
  );
  
  const hasGalleryImages = galleryImages.length >= 8;

  useEffect(() => {
    setIsClient(true);
    
    // Remove old CSS injection since LogoMarquee doesn't need it
    const styleId = 'about-critical-css';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const checkRTL = () => {
      const htmlDir = document.documentElement.getAttribute('dir');
      setIsRTL(htmlDir === 'rtl');
    };
    
    checkRTL();
    
    const observer = new MutationObserver(checkRTL);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['dir'] 
    });
    
    return () => observer.disconnect();
  }, [isClient]);

  const aboutTitle = useMemo(() => settings?.about_title || '', [settings?.about_title]);
  const aboutText = useMemo(() => settings?.about_text || '', [settings?.about_text]);
  const partnersTitle = useMemo(() => settings?.partners_title || '', [settings?.partners_title]);
  const partnersText = useMemo(() => settings?.partners_text || '', [settings?.partners_text]);

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="bg-white flex flex-col items-center py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 lg:px-20">
        <span className="inline-block font-medium text-gray-800 px-4 py-2 text-xs sm:text-sm md:text-base bg-white/10 backdrop-blur-2xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.1)] rounded-full hover:bg-gray-100 transition mt-8 sm:mb-8 text-center">
          {fw.aboute || 'About Us'}
        </span>

        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 sm:gap-8 lg:gap-16 mt-6 sm:mt-8">
          <div className="flex-1 flex flex-col items-center lg:items-start gap-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
              {aboutTitle}
            </h2>
          </div>

          <div className="flex-1 mt-4 sm:mt-6 lg:mt-0 text-center lg:text-left">
            <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed font-light">
              {aboutText}
            </p>
          </div>
        </div>
      </section>

      <div className="h-12 sm:h-20 bg-white" />

      {/* Gallery */}
      {hasGalleryImages ? (
        <ParallaxGallery images={galleryImages} />
      ) : isClient && (
        <div className="flex flex-col items-center justify-center h-[175vh] bg-gray-50 p-4">
          <p className="text-gray-400 italic text-center">
            {galleryImages.length === 0 
              ? 'Gallery images will appear here' 
              : `Need at least 8 images for gallery. Currently have ${galleryImages.length}.`}
          </p>
        </div>
      )}

      <div className="h-20 sm:h-40 bg-white" />

      {/* Client Logos Section */}
      <section className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-16 lg:px-20 bg-white py-8 sm:py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4 sm:gap-6 lg:gap-12 mb-6 sm:mb-8 md:mb-12">
          <div className="flex-1 flex flex-col items-center lg:items-start gap-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
              {partnersTitle}
            </h2>
          </div>

          <div className="flex-1 mt-4 sm:mt-6 lg:mt-0 text-center lg:text-left">
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
              {partnersText}
            </p>
          </div>
        </div>

        {isClient && clientLogos.length > 0 && (
  <LogoMarquee 
    logos={clientLogos} 
    isRTL={isRTL}
    duration={30} // 30 seconds for one complete loop
  />
)}
      </section>

      <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse" />}>
        <SubscribeSection />
      </Suspense>
    </div>
  );
}
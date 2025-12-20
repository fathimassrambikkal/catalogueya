import React, { memo, lazy, Suspense, useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";

// Lazy-load heavy components
const SubscribeSection = lazy(() => import("../components/SubscribeSection"));

// Base URL from your API response
const BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// Helper function to safely parse JSON strings to arrays and add base URL
const safeParseArrayWithBaseUrl = (value) => {
  if (Array.isArray(value)) {
    // Add base URL to each image if it doesn't already have it
    return value.map(img => {
      if (img && !img.startsWith('http') && !img.startsWith('//')) {
        return `${BASE_URL}/${img.replace(/^\//, '')}`;
      }
      return img;
    });
  }
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        // Add base URL to each image
        return parsed.map(img => {
          if (img && !img.startsWith('http') && !img.startsWith('//')) {
            return `${BASE_URL}/${img.replace(/^\//, '')}`;
          }
          return img;
        });
      }
      return [];
    } catch (err) {
      console.error('Failed to parse string to array:', err, 'Value:', value);
      return [];
    }
  }
  
  return [];
};

// Optimized Logo Item with loading state
const LogoItem = memo(({ logo, index }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Handle image loading with proper URL
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  const handleImageError = (e) => {
    console.error(`Logo ${index} failed to load:`, logo);
    // Try to fallback to direct URL
    if (logo && !logo.startsWith(BASE_URL)) {
      const fullUrl = `${BASE_URL}/${logo.replace(/^\//, '')}`;
      console.log(`Trying fallback URL: ${fullUrl}`);
      e.target.src = fullUrl;
    } else {
      e.target.style.display = 'none';
    }
  };
  
  return (
    <div className="flex-shrink-0 w-48 h-32">
      <img
        src={logo}
        alt={`client-logo-${index}`}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
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

  // Don't render gallery if we don't have enough images
  if (images.length < 8) {
    return (
      <div className="flex flex-col items-center justify-center h-[175vh] bg-gray-50 p-4">
        <p className="text-gray-400 italic text-center mb-4">
          Need at least 8 images for gallery. Currently have {images.length}.
        </p>
      </div>
    );
  }

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

  const handleImageError = (e) => {
    console.error(`Gallery image ${index} failed to load:`, src);
    // Try to fallback to direct URL
    if (src && !src.startsWith(BASE_URL)) {
      const fullUrl = `${BASE_URL}/${src.replace(/^\//, '')}`;
      e.target.src = fullUrl;
    } else {
      e.target.style.display = 'none';
      e.target.parentElement.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center bg-gray-200">
          <p class="text-gray-500 text-sm">Failed to load image</p>
          <p class="text-gray-400 text-xs mt-1 truncate px-2">${src ? src.substring(0, 50) + '...' : 'No source'}</p>
        </div>
      `;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '100px' } 
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg bg-gray-100">
      {isVisible && src && (
        <img
          src={src}
          alt={`gallery-image-${index}`}
          className="pointer-events-none object-cover w-full h-full"
          loading="lazy"
          onError={handleImageError}
        />
      )}
    </div>
  );
});

// CSS-based Marquee for 60fps performance with RTL support - Using your second code's simpler approach
const LogoMarquee = ({ logos, isRTL }) => {
  // Safeguard against non-array logos
  const safeLogos = Array.isArray(logos) ? logos : [];
  
  // Don't render if no logos
  if (safeLogos.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-400 italic">No logos available to display</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className={`flex gap-8 ${isRTL ? 'animate-marquee-rtl' : 'animate-marquee'}`}>
        {safeLogos.map((logo, index) => (
          <LogoItem key={index} logo={logo} index={index} />
        ))}
        {/* Duplicate for seamless loop */}
        {safeLogos.map((logo, index) => (
          <LogoItem key={`dup-${index}`} logo={logo} index={index} />
        ))}
      </div>
    </div>
  );
};

export default function About() {
  const [isRTL, setIsRTL] = useState(false);
  const { settings } = useSettings();
  
  // Moved the hook call inside the component
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  // Console log fw.about
  useEffect(() => {
    console.log('fw.about value:', fw.about);
    console.log('full fixedWords:', fixedWords);
    console.log('full fw object:', fw);
  }, [fw.about, fixedWords, fw]);

  // Check for RTL language
  useEffect(() => {
    const checkRTL = () => {
      const htmlDir = document.documentElement.getAttribute('dir');
      const isRTL = htmlDir === 'rtl';
      setIsRTL(isRTL);
    };

    checkRTL();
    
    const observer = new MutationObserver(checkRTL);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['dir'] 
    });

    return () => observer.disconnect();
  }, []);

  // Preload critical images
  useEffect(() => {
    const preloadImages = [];
    
    // Use the safeParseArrayWithBaseUrl helper to get images with proper URLs
    const aboutImgs = safeParseArrayWithBaseUrl(settings?.about_imgs);
    const partnersImgs = safeParseArrayWithBaseUrl(settings?.partners_imgs);
    
    const firstGalleryImage = aboutImgs.length > 0 ? aboutImgs[0] : null;
    const firstLogoImage = partnersImgs.length > 0 ? partnersImgs[0] : null;
    
    if (firstGalleryImage) {
      preloadImages.push(firstGalleryImage);
    }
    
    if (firstLogoImage) {
      preloadImages.push(firstLogoImage);
    }
    
    preloadImages.forEach(src => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [settings?.about_imgs, settings?.partners_imgs]);

  // Extract images using safeParseArrayWithBaseUrl to handle both strings and arrays
  const galleryImages = safeParseArrayWithBaseUrl(settings?.about_imgs);
  const clientLogos = safeParseArrayWithBaseUrl(settings?.partners_imgs);

  // Check if we have enough images for gallery
  const hasGalleryImages = galleryImages.length >= 8;

  return (
    <>
      <div className="w-full bg-white">
        {/* Hero Section with Split Layout - Reduced space on mobile */}
        <section className="bg-white flex flex-col items-center py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 lg:px-20">
          <span className="inline-block font-medium text-gray-800 px-4 py-2 text-xs sm:text-sm md:text-base bg-white/10 backdrop-blur-2xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.1)] rounded-full hover:bg-gray-100 transition mt-8 sm:mb-8 text-center">
            {fw.aboute }
          </span>

          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 sm:gap-8 lg:gap-16 mt-6 sm:mt-8">
            <div className="flex-1 flex flex-col items-center lg:items-start gap-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
                {settings?.about_title || "Trusted home services"}
              </h2>
            </div>

            <div className="flex-1 mt-4 sm:mt-6 lg:mt-0 text-center lg:text-left">
              <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed font-light">
                {settings?.about_text || "Catalogueya is your go-to platform for trusted home services. Discover verified professionals for every part of your home from repairs and renovations to cleaning and landscaping. We feature only reliable, subscribed businesses you can trust."}
              </p>
            </div>
          </div>
        </section>

        {/* Reduced space below paragraph */}
        <div className="h-12 sm:h-20 bg-white"></div>

        {/* Parallax Gallery - Only render if we have enough images from API */}
        {hasGalleryImages && <ParallaxGallery images={galleryImages} />}
        
        {/* Show placeholder if not enough images for gallery */}
        {!hasGalleryImages && galleryImages.length > 0 && (
          <div className="flex flex-col items-center justify-center h-[175vh] bg-gray-50 p-4">
            <p className="text-gray-400 italic text-center mb-4">
              Need at least 8 images for gallery. Currently have {galleryImages.length}.
            </p>
          </div>
        )}
        
        {/* Show placeholder if no gallery images */}
        {galleryImages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[175vh] bg-gray-50 p-4">
            <p className="text-gray-400 italic text-center mb-4">
              Gallery images will appear here
            </p>
          </div>
        )}

        {/* End Space */}
        <div className="relative flex h-20 sm:h-40 items-center justify-center bg-white">
        </div>

        {/* Client Logos Section */}
        <section className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-16 lg:px-20 bg-white py-8 sm:py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4 sm:gap-6 lg:gap-12 mb-6 sm:mb-8 md:mb-12">
            <div className="flex-1 flex flex-col items-center lg:items-start gap-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 text-center lg:text-left leading-snug tracking-tighter">
                {settings?.partners_title || "Partners in Progress"}
              </h2>
            </div>

            <div className="flex-1 mt-4 sm:mt-6 lg:mt-0 text-center lg:text-left">
              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                {settings?.partners_text || "Long-term relationships built on creative trust, shared ambition, and measurable results."}
              </p>
            </div>
          </div>

          {/* Logo Marquee with RTL support - Using the simpler animation from second code */}
          <LogoMarquee logos={clientLogos} isRTL={isRTL} />
        </section>

        {/* Lazy-loaded Subscribe & CTA */}
        <Suspense fallback={null}>
          <SubscribeSection />
        </Suspense>
      </div>
    </>
  );
}
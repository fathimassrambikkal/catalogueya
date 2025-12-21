import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} from "react";

import SearchBar from "../components/SearchBar";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";

/* Intersection observer */
const useIsInViewport = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, [ref]);

  return isVisible;
};

export default function Banner() {
  const { settings } = useSettings();
  const { fixedWords } = useFixedWords();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  const sectionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimestamp = useRef(0);
  const isInView = useIsInViewport(sectionRef);

  /* -------------------------------------------
      HERO IMAGES - FIXED VERSION
  ------------------------------------------- */
  const responsiveImages = useMemo(() => {
    const apiImages = settings?.hero_backgrounds;
    
  

    // If undefined or null
    if (!apiImages) {
      console.log("⚠️ No hero images found in settings");
      return [];
    }

    // FIX 1: Handle string case (JSON inside string)
    if (typeof apiImages === 'string') {
      console.log("🔍 Processing hero_backgrounds as string");
      console.log("🔍 Raw string:", apiImages);
      
      try {
        // Clean the string first
        const cleanStr = apiImages
          .replace(/\\\//g, '/')  // Fix escaped slashes: \/ to /
          .replace(/\\"/g, '"')   // Fix escaped quotes: \" to "
          .replace(/\\\\/g, '\\'); // Fix double backslashes
        
        console.log("🔍 Cleaned string:", cleanStr);
        
        // Try to extract JSON array
        const match = cleanStr.match(/\[.*\]/);
        if (match) {
          console.log("🔍 Found JSON array:", match[0]);
          const parsedArray = JSON.parse(match[0]);
          console.log("🔍 Parsed array:", parsedArray);
          
          // Convert to proper image objects
          const images = parsedArray.map((item, i) => {
            const src = String(item).trim();
            let finalSrc = src;
            
            // Make sure URL is complete
            if (!src.startsWith('http')) {
              finalSrc = `https://catalogueyanew.com.awu.zxu.temporary.site/${src}`;
            }
            
            return {
              src: finalSrc,
              alt: `Hero image ${i + 1}`,
              id: `api-banner-${i}`,
            };
          });
          
          console.log("✅ Converted to images:", images);
          return images;
        }
      } catch (err) {
        console.error("❌ Error parsing hero_backgrounds string:", err);
      }
      
      return [];
    }

    // FIX 2: Handle array case
    if (Array.isArray(apiImages)) {
      console.log("📦 Processing hero_backgrounds as array");
      
      // Check if it's an array with a JSON string inside
      if (apiImages.length === 1 && typeof apiImages[0] === 'string' && 
          apiImages[0].includes('[') && apiImages[0].includes(']')) {
        
        console.log("🔍 Array contains JSON string:", apiImages[0]);
        
        try {
          const cleanStr = apiImages[0]
            .replace(/\\\//g, '/')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
          
          const match = cleanStr.match(/\[.*\]/);
          if (match) {
            const parsedArray = JSON.parse(match[0]);
            
            return parsedArray.map((item, i) => {
              const src = String(item).trim();
              let finalSrc = src;
              
              if (!src.startsWith('http')) {
                finalSrc = `https://catalogueyanew.com.awu.zxu.temporary.site/${src}`;
              }
              
              return {
                src: finalSrc,
                alt: `Hero image ${i + 1}`,
                id: `api-banner-${i}`,
              };
            });
          }
        } catch (err) {
          console.error("❌ Error parsing array content:", err);
        }
      } else {
        // Normal array processing
        return apiImages
          .filter(src => src && typeof src === 'string')
          .map((src, i) => {
            let finalSrc = src.trim();
            
            // Make sure URL is complete
            if (!finalSrc.startsWith('http')) {
              finalSrc = `https://catalogueyanew.com.awu.zxu.temporary.site/${finalSrc}`;
            }
            
            return {
              src: finalSrc,
              alt: `Hero image ${i + 1}`,
              id: `api-banner-${i}`,
            };
          });
      }
    }

    console.log("⚠️ hero_backgrounds is not string or array, returning empty");
    return [];
  }, [settings?.hero_backgrounds]);

  /* -------------------------------------------
      HERO TEXT (TITLE + SUBTITLE)
  ------------------------------------------- */
  const headingText = settings?.hero_title ?? "";
  const subtitleText = settings?.hero_sub_title ?? "";

  /* Preload first image with error handling */
  useEffect(() => {
    const first = responsiveImages[0];
    if (!first?.src) return;

    console.log("🖼️ Preloading first image:", first.src);
    
    const img = new Image();
    img.src = first.src;
    img.onload = () => {
      console.log(`✅ First image loaded successfully:`, first.src);
      setLoadedImages((p) => ({ ...p, [first.id]: true }));
    };
    img.onerror = (err) => {
      console.error(`❌ Failed to load first image:`, first.src, err);
      console.error(`❌ Error details:`, err);
      setImageLoadErrors((p) => ({ ...p, [first.id]: true }));
    };
  }, [responsiveImages]);

  /* Auto-slide animation */
  useEffect(() => {
    if (responsiveImages.length === 0) return;

    const SLIDE_TIME = 5000;

    const tick = (now) => {
      if (!lastTimestamp.current) lastTimestamp.current = now;

      if (now - lastTimestamp.current >= SLIDE_TIME) {
        setCurrentIndex((prev) => (prev + 1) % responsiveImages.length);
        lastTimestamp.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    if (isInView && responsiveImages.length > 1) {
      animationFrameRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isInView, responsiveImages.length]);

  const handleDotClick = useCallback((i) => {
    lastTimestamp.current = performance.now();
    setCurrentIndex(i);
  }, []);

  // Handle image load errors
  const handleImageError = useCallback((imgId, imgSrc) => {
    console.error(`❌ Failed to load image ${imgId}:`, imgSrc);
    setImageLoadErrors((p) => ({ ...p, [imgId]: true }));
  }, []);

  const sectionHeight = "h-[60vh] sm:h-[80vh] md:h-[90vh] lg:h-screen";

  // Debug: Show what we have
  console.log("🔍 FINAL - responsiveImages:", responsiveImages);
  console.log("🔍 FINAL - Number of images:", responsiveImages.length);
  responsiveImages.forEach((img, i) => {
    console.log(`🔍 FINAL - Image ${i}:`, img.src);
  });

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${sectionHeight} overflow-hidden flex items-center justify-center`}
    >
      {/* Preload first image */}
      {responsiveImages[0]?.src && (
        <link rel="preload" as="image" href={responsiveImages[0].src} />
      )}

      {/* Background images */}
      {responsiveImages.map((img, i) => (
        <img
          key={img.id}
          src={img.src}
          alt={img.alt}
          width="1920"
          height="1080"
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => {
            console.log(`✅ Image ${img.id} loaded successfully`);
            setLoadedImages((p) => ({ ...p, [img.id]: true }));
          }}
          onError={(e) => {
            console.error(`❌ Image ${img.id} failed to load:`, img.src);
            console.error(`❌ Error event:`, e);
            handleImageError(img.id, img.src);
          }}
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-[800ms] ease-out
            ${i === currentIndex ? "opacity-100" : "opacity-0"}
            ${imageLoadErrors[img.id] ? 'hidden' : ''}
          `}
          style={imageLoadErrors[img.id] ? { display: 'none' } : {}}
        />
      ))}

      {/* Skeleton loading */}
      {!loadedImages[responsiveImages[0]?.id] &&
        responsiveImages.length > 0 &&
        !imageLoadErrors[responsiveImages[0]?.id] && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}

      {/* Banner content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 z-10">
        {/* Search bar positioned lower */}
        <div className="w-full max-w-2xl z-30 mt-16 ">
          <SearchBar />
        </div>

        <h1 className="font-semibold text-center text-white drop-shadow-lg text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight px-4 ">
          {headingText}
        </h1>

        <p className="text-white/90 text-md md:text-xl lg:text-2xl font-normal text-center max-w-2xl -mt-4 tracking-normal">
          {subtitleText}
        </p>
      </div>

      {/* Pagination dots */}
      {responsiveImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            {responsiveImages.map((_, idx) => (
              <button key={idx} onClick={() => handleDotClick(idx)}>
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "bg-white scale-125"
                      : "bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
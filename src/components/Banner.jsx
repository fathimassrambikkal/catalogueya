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

/* -----------------------------------
   Stable Intersection Observer
----------------------------------- */
const useIsInViewport = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return isVisible;
};

/* -----------------------------------
   Normalize hero images ONCE
----------------------------------- */
const normalizeHeroImages = (apiImages) => {
  if (!apiImages) return [];

  const normalizeSrc = (src, i) => {
    const clean = String(src).trim();
    const finalSrc = clean.startsWith("http")
      ? clean
      : `https://catalogueyanew.com.awu.zxu.temporary.site/${clean}`;

    return {
      src: finalSrc,
      alt: `Hero image ${i + 1}`,
      id: `api-banner-${i}`,
    };
  };

  try {
    // String with embedded JSON
    if (typeof apiImages === "string") {
      const cleanStr = apiImages
        .replace(/\\\//g, "/")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");

      const match = cleanStr.match(/\[.*\]/);
      if (match) {
        return JSON.parse(match[0]).map(normalizeSrc);
      }
      return [];
    }

    // Array
    if (Array.isArray(apiImages)) {
      if (
        apiImages.length === 1 &&
        typeof apiImages[0] === "string" &&
        apiImages[0].includes("[")
      ) {
        const cleanStr = apiImages[0]
          .replace(/\\\//g, "/")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");

        const match = cleanStr.match(/\[.*\]/);
        if (match) {
          return JSON.parse(match[0]).map(normalizeSrc);
        }
      }

      return apiImages
        .filter((src) => typeof src === "string")
        .map(normalizeSrc);
    }
  } catch {
    return [];
  }

  return [];
};

export default function Banner() {
  const { settings } = useSettings();
  useFixedWords(); // used elsewhere, keep hook call

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  const sectionRef = useRef(null);
  const timerRef = useRef(null);
  const isInView = useIsInViewport(sectionRef);

  /* -----------------------------------
     HERO IMAGES (PURE + MEMOIZED)
  ----------------------------------- */
  const responsiveImages = useMemo(
    () => normalizeHeroImages(settings?.hero_backgrounds),
    [settings?.hero_backgrounds]
  );

  /* -----------------------------------
     Preload first image
  ----------------------------------- */
  useEffect(() => {
    const first = responsiveImages[0];
    if (!first?.src) return;

    const img = new Image();
    img.src = first.src;
    img.onload = () =>
      setLoadedImages((p) => ({ ...p, [first.id]: true }));
    img.onerror = () =>
      setImageErrors((p) => ({ ...p, [first.id]: true }));
  }, [responsiveImages]);

  /* -----------------------------------
     Auto-slide (battery-safe)
  ----------------------------------- */
  useEffect(() => {
    if (!isInView || responsiveImages.length <= 1) return;

    const SLIDE_TIME = 5000;

    timerRef.current = setTimeout(() => {
      setCurrentIndex((p) => (p + 1) % responsiveImages.length);
    }, SLIDE_TIME);

    return () => clearTimeout(timerRef.current);
  }, [isInView, currentIndex, responsiveImages.length]);

  const handleDotClick = useCallback((i) => {
    clearTimeout(timerRef.current);
    setCurrentIndex(i);
  }, []);

  const handleImageError = useCallback((id) => {
    setImageErrors((p) => ({ ...p, [id]: true }));
  }, []);

  const sectionHeight = "h-[60vh] sm:h-[80vh] md:h-[90vh] lg:h-screen";

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${sectionHeight} overflow-hidden flex items-center justify-center`}
      style={{ contain: "layout paint" }}
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
          onLoad={() =>
            setLoadedImages((p) => ({ ...p, [img.id]: true }))
          }
          onError={() => handleImageError(img.id)}
          className={`absolute inset-0 w-full h-full object-cover
            transition-opacity duration-[800ms] ease-out
            ${i === currentIndex ? "opacity-100" : "opacity-0"}
            ${imageErrors[img.id] ? "hidden" : ""}`}
        />
      ))}

      {/* Skeleton */}
      {!loadedImages[responsiveImages[0]?.id] &&
        responsiveImages.length > 0 &&
        !imageErrors[responsiveImages[0]?.id] && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 z-10">
        <div className="w-full max-w-2xl z-30 mt-16">
          <SearchBar />
        </div>

        <h1 className="font-semibold text-center text-white drop-shadow-lg text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight px-4">
          {settings?.hero_title ?? ""}
        </h1>

        <p className="text-white/90 text-md md:text-xl lg:text-2xl font-normal text-center max-w-2xl -mt-4">
          {settings?.hero_sub_title ?? ""}
        </p>
      </div>

      {/* Pagination */}
      {responsiveImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-0  ">
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

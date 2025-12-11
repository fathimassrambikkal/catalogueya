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

  const sectionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimestamp = useRef(0);
  const isInView = useIsInViewport(sectionRef);

  /* -------------------------------------------
      HERO IMAGES (API ONLY)
  ------------------------------------------- */
  const responsiveImages = useMemo(() => {
    const apiRaw = settings?.hero_backgrounds; // ✅ FIXED
    if (!apiRaw) return [];

    try {
      const imgs =
        typeof apiRaw === "string" ? JSON.parse(apiRaw) : apiRaw;

      if (!Array.isArray(imgs) || imgs.length === 0) return [];

      const ASSET_BASE =
        import.meta.env.VITE_ASSET_BASE_URL?.replace(/\/$/, "");

      return imgs.map((src, i) => ({
        src: src.startsWith("http")
          ? src
          : `${ASSET_BASE}/${src.replace(/^\/+/, "")}`,
        alt: `Hero image ${i + 1}`,
        id: `api-banner-${i}`,
      }));
    } catch {
      return [];
    }
  }, [settings?.hero_backgrounds]);

  /* -------------------------------------------
      HERO TEXT (TITLE + SUBTITLE)
  ------------------------------------------- */
  const headingText = settings?.hero_title ?? "";        // ✅ FIXED
  const subtitleText = settings?.hero_sub_title ?? "";   // ✅ FIXED

  /* Preload first image */
  useEffect(() => {
    const first = responsiveImages[0];
    if (!first?.src) return;

    const img = new Image();
    img.src = first.src;
    img.onload = () =>
      setLoadedImages((p) => ({ ...p, [first.id]: true }));
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

    if (isInView) animationFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isInView, responsiveImages.length]);

  const handleDotClick = useCallback((i) => {
    lastTimestamp.current = performance.now();
    setCurrentIndex(i);
  }, []);

  const sectionHeight = "h-[60vh] sm:h-[80vh] md:h-[90vh] lg:h-screen";

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
          onLoad={() =>
            setLoadedImages((p) => ({ ...p, [img.id]: true }))
          }
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-[800ms] ease-out
            ${i === currentIndex ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}

      {/* Skeleton loading */}
      {!loadedImages[responsiveImages[0]?.id] &&
        responsiveImages.length > 0 && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}

      {/* Banner content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 z-10">
        <div className="w-full max-w-2xl z-30">
          <SearchBar />
        </div>

        <h1 className="font-semibold text-center text-white drop-shadow-lg text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight px-4">
          {headingText}
        </h1>

        <p className="text-white/90 text-md md:text-xl lg:text-2xl font-normal text-center max-w-2xl -mt-4 tracking-normal">
          {subtitleText}
        </p>
      </div>

      {/* Pagination dots */}
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
    </section>
  );
}

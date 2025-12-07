import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} from "react";

import banner1 from "../assets/banner1.webp";
import banner2 from "../assets/banner2.webp";
import banner3 from "../assets/banner3.webp";
import SearchBar from "../components/SearchBar";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";

/* fallback images */
const fallbackResponsiveImages = [
  { src: banner1, alt: "Modern living room banner 1", id: "b0" },
  { src: banner2, alt: "Elegant kitchen interior banner 2", id: "b1" },
  { src: banner3, alt: "Cozy bedroom design banner 3", id: "b2" }
];

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

  /* Parse images once */
  const responsiveImages = useMemo(() => {
    if (!settings.hero_images) return fallbackResponsiveImages;
    try {
      const imgs =
        typeof settings.hero_images === "string"
          ? JSON.parse(settings.hero_images)
          : settings.hero_images;

      return imgs.map((src, i) => ({
        src,
        alt: settings[`hero_image_alt_${i + 1}`] || `Banner image ${i + 1}`,
        id: `banner-${i}`
      }));
    } catch {
      return fallbackResponsiveImages;
    }
  }, [settings.hero_images]);

  const headingText =
    settings.hero_title || fixedWords.hero_title || "Welcome to Catalogueya";

  const subtitleText =
    settings.hero_sub_title ||
    fixedWords.hero_sub_title ||
    "Enhance Everyday Living";

  /* Preload first image */
  useEffect(() => {
    const first = responsiveImages[0];
    if (!first?.src) return;

    const img = new Image();
    img.src = first.src;
    img.onload = () =>
      setLoadedImages((p) => ({ ...p, [first.id]: true }));
  }, [responsiveImages]);

  /* Auto-slide */
  useEffect(() => {
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
      {/* PRELOAD FIRST IMAGE */}
      {responsiveImages[0]?.src && (
        <link rel="preload" as="image" href={responsiveImages[0].src} />
      )}

      {/* IMAGES – PURE CSS FADE */}
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
            will-change-opacity
            ${i === currentIndex ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}

      {/* Skeleton while first image loads */}
      {!loadedImages[responsiveImages[0]?.id] && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 z-10">
        <div className="w-full max-w-2xl z-30">
          <SearchBar />
        </div>

        <h2 className="font-extrabold text-center text-white drop-shadow-lg text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight px-4">
          {headingText}
        </h2>

        <p className="text-white/90 text-md md:text-xl lg:text-2xl font-semibold text-center max-w-2xl -mt-4">
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

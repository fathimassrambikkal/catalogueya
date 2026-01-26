import React, {
  memo,
  lazy,
  Suspense,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";
import { log, warn } from "../utils/logger";

import LogoMarquee from "../components/LogoMarquee";
import SmartImage from "../components/SmartImage";

// 🔒 DEV flag
const __DEV__ = import.meta.env.DEV;

// Lazy-load heavy components
const SubscribeSection = lazy(() => import("../components/SubscribeSection"));

/* ----------------------------------------
   Parallax Gallery
---------------------------------------- */
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
    restDelta: 0.001,
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

    updateDimension();
    window.addEventListener("resize", updateDimension);
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

/* ----------------------------------------
   Column
---------------------------------------- */
const Column = memo(({ images, y }) => (
  <motion.div
    className="relative -top-[45%] flex h-full w-1/4 min-w-[200px] flex-col gap-[2vw]
               first:top-[-45%] [&:nth-child(2)]:top-[-95%]
               [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
    style={{ y }}
  >
    {images.map((src, i) => (
      <LazyImage key={`${src}-${i}`} src={src} index={i} />
    ))}
  </motion.div>
));

/* ----------------------------------------
   Lazy Image
---------------------------------------- */
const LazyImage = memo(({ src, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "300px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleError = () => {
    warn("About: gallery image failed to load", { index, src });
    setHasError(true);
  };

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg bg-gray-100"
    >
      {isVisible && !hasError && (
        <SmartImage
          image={src}
          alt={`gallery-image-${index}`}
          className={`pointer-events-none object-cover w-full h-full transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
        />
      )}

      {hasError && (
        <div className="flex items-center justify-center w-full h-full bg-gray-200">
          <span className="text-gray-400 text-sm">Image failed to load</span>
        </div>
      )}
    </div>
  );
});

/* ----------------------------------------
   About Page
---------------------------------------- */
export default function About() {
  const [isRTL, setIsRTL] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { settings } = useSettings();
  const { fixedWords } = useFixedWords();

  const fw = useMemo(() => fixedWords?.fixed_words || {}, [fixedWords]);

  const galleryImages = useMemo(
    () => (Array.isArray(settings?.about_imgs) ? settings.about_imgs : []),
    [settings?.about_imgs]
  );

  const clientLogos = useMemo(
    () => (Array.isArray(settings?.partners_imgs) ? settings.partners_imgs : []),
    [settings?.partners_imgs]
  );

  const hasGalleryImages = galleryImages.length >= 8;

  useEffect(() => {
    if (__DEV__) {
      log("About: settings debug", {
        galleryImagesLength: galleryImages.length,
        clientLogosLength: clientLogos.length,
        hasGalleryImages,
      });
    }
  }, [galleryImages.length, clientLogos.length, hasGalleryImages]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkRTL = () =>
      setIsRTL(document.documentElement.getAttribute("dir") === "rtl");

    checkRTL();
    const observer = new MutationObserver(checkRTL);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    return () => observer.disconnect();
  }, [isClient]);

  const aboutTitle = useMemo(() => settings?.about_title || "", [settings?.about_title]);
  const aboutText = useMemo(() => settings?.about_text || "", [settings?.about_text]);
  const partnersTitle = useMemo(() => settings?.partners_title || "", [settings?.partners_title]);
  const partnersText = useMemo(() => settings?.partners_text || "", [settings?.partners_text]);

  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <section className="bg-white flex flex-col items-center py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 lg:px-20">
        <span className="inline-block font-medium text-gray-800 px-4 py-2 text-xs sm:text-sm md:text-base bg-white/10 backdrop-blur-2xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.1)] rounded-full mt-8 sm:mb-8">
          {fw.aboute || "About Us"}
        </span>

        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 lg:gap-16 mt-6">
          <h2 className="flex-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900">
            {aboutTitle}
          </h2>

          <p className="flex-1 text-gray-600 text-base sm:text-lg md:text-xl">
            {aboutText}
          </p>
        </div>
      </section>

      <div className="h-12 sm:h-20 bg-white" />

      {/* Gallery */}
      {hasGalleryImages && <ParallaxGallery images={galleryImages} />}

      <div className="h-20 sm:h-40 bg-white" />

      {/* Partners */}
      <section className="px-4 sm:px-6 md:px-16 lg:px-20 py-12 sm:py-20 bg-white">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mb-8">
          <h2 className="flex-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900">
            {partnersTitle}
          </h2>
          <p className="flex-1 text-gray-600">{partnersText}</p>
        </div>

        {isClient && clientLogos.length > 0 && (
          <LogoMarquee logos={clientLogos} isRTL={isRTL} duration={30} useSmartImage />
        )}
      </section>

      <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse" />}>
        <SubscribeSection />
      </Suspense>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function useIsInViewport(ref, options = { threshold: 0.1 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      options
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options]);

  return isVisible;
}

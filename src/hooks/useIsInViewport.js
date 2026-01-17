import { useState, useEffect } from "react";

export const useIsInViewport = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1 });

    const el = ref.current;
    if (el) observer.observe(el);

    return () => el && observer.unobserve(el);
  }, [ref]);

  return isIntersecting;
};
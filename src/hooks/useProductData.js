import { useState, useEffect, useRef } from "react";
import { error as logError } from "../utils/logger";

export const useProductData = (fetchFunction, transformFunction) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);

      try {
        const res = await fetchFunction(1);
        const paginated = res?.data?.data?.products;

        if (!mounted || !paginated?.data) return;

        let transformed = [];
        try {
          transformed = transformFunction(paginated.data);
        } catch (e) {
          logError("useProductData: transform failed", e);
          return;
        }

        setProducts(transformed);

        // 🔹 Background image warm-up (safe)
        transformed.forEach((product) => {
          if (!product?.img) return;

          const src = product.img.startsWith("http")
            ? product.img
            : `https://catalogueyanew.com.awu.zxu.temporary.site/${product.img}`;

          const img = new Image();
          img.src = src;
        });
      } catch (e) {
        logError("useProductData: fetch failed", e);
        if (mounted) setErr(e);
      } finally {
        isFetchingRef.current = false;
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [fetchFunction, transformFunction]);

  return { products, isLoading, error: err };
};

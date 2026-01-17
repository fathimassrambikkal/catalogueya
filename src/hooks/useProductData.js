import { useState, useEffect } from "react";

export const useProductData = (fetchFunction, transformFunction) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let isFetching = false;

    const fetchData = async () => {
      if (isFetching) return;
      isFetching = true;
      setIsLoading(true);

      try {
        const res = await fetchFunction(1);
        const paginated = res?.data?.data?.products;

        if (!mounted || !paginated?.data) return;

        const transformed = transformFunction(paginated.data);
        setProducts(transformed);
        
        // Preload images in background
        transformed.forEach(product => {
          if (product?.img) {
            const img = new Image();
            const imageUrl = product.img.startsWith('http') ? product.img : `https://catalogueyanew.com.awu.zxu.temporary.site/${product.img}`;
            img.src = imageUrl;
            img.fetchPriority = 'high';
          }
        });
      } catch (err) {
        console.error("Failed to load products", err);
        setError(err.message);
      } finally {
        isFetching = false;
        setIsLoading(false);
      }
    };

    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [fetchFunction, transformFunction]);

  return { products, isLoading, error };
};
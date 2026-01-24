// SmartImage.jsx - CORRECT VERSION
import React, { useState, useRef, useEffect, useMemo } from "react";

const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

const SmartImage = ({
  image,
  alt = "",
  className = "",
  loading = "lazy",
  fetchPriority = "auto",
  decoding = "async",
  onLoad,
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  // ✅ Normalize image data
  const normalizedImage = useMemo(() => {
    if (!image) return null;
    
    // If image is an object with avif/webp
    if (typeof image === 'object' && !Array.isArray(image)) {
      return {
        avif: image.avif,
        webp: image.webp,
        fallback: image.url || image.src || image.path || null,
      };
    }
    
    // If it's a string
    if (typeof image === 'string') {
      return { fallback: image };
    }
    
    return null;
  }, [image]);

  // ✅ Get the actual URL to load
  const getImageUrl = (imgData) => {
    if (!imgData) return null;
    
    // Try avif first, then webp, then fallback
    const src = imgData.avif || imgData.webp || imgData.fallback;
    
    if (!src) return null;
    
    // Format URL if needed
    if (typeof src === 'string') {
      if (src.startsWith("http") || src.startsWith("blob:") || src.startsWith("data:")) {
        return src;
      }
      return `${API_BASE_URL}/${src.replace(/^\//, "")}`;
    }
    
    return null;
  };

  const imageUrl = useMemo(() => {
    return getImageUrl(normalizedImage);
  }, [normalizedImage]);

  // ✅ Handle image load
  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  // ✅ Handle image error
  const handleError = (e) => {
    setHasError(true);
    
    // Try fallback if available
    if (normalizedImage?.fallback && normalizedImage.fallback !== imageUrl) {
      // Don't infinite loop
      const fallbackUrl = getImageUrl({ fallback: normalizedImage.fallback });
      if (fallbackUrl && imgRef.current && fallbackUrl !== imageUrl) {
        imgRef.current.src = fallbackUrl;
        return;
      }
    }
    
    if (onError) onError(e);
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const loadHandler = () => handleLoad({ target: img });
    const errorHandler = () => handleError({ target: img });

    img.addEventListener('load', loadHandler);
    img.addEventListener('error', errorHandler);

    return () => {
      img.removeEventListener('load', loadHandler);
      img.removeEventListener('error', errorHandler);
    };
  }, [imageUrl]);

  if (!imageUrl || hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={imageUrl}
      alt={alt}
      className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

export default SmartImage;
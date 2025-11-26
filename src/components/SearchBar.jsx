import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { getCategories } from "../api";
import { useTranslation } from "react-i18next"; 
import qatarflag from "../assets/Qatarflag.jpg";

// Pre-fetch categories immediately when module loads
let preloadedCategories = null;

(async () => {
  try {
    const res = await getCategories();
    preloadedCategories = res?.data?.data || [];
  } catch (err) {
    console.warn("Pre-fetch categories failed:", err);
    preloadedCategories = [];
  }
})();

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categories, setCategories] = useState(preloadedCategories || []);
  const [isLoading, setIsLoading] = useState(!preloadedCategories);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // Fetch categories if preload didn't complete
  useEffect(() => {
    if (preloadedCategories !== null) {
      setCategories(preloadedCategories);
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (mounted && res?.data?.data) {
          setCategories(res.data.data);
          preloadedCategories = res.data.data;
        }
        setIsLoading(false);
      } catch (err) {
        console.warn("Failed to fetch categories:", err);
        setIsLoading(false);
      }
    };

    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  // Extract category titles from API response
  const categoryTitles = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.map((c) => c.title_en || c.title || c.name).filter(Boolean);
  }, [categories]);

  // Debounced search term for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 50);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // SLOWER placeholder animation with proper cleanup
  useEffect(() => {
    if (searchTerm || categoryTitles.length === 0) return;
    
    let animationFrame;
    let intervalId;

    const animatePlaceholder = () => {
      intervalId = setInterval(() => {
        setShowPlaceholder(false);
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % categoryTitles.length);
          setShowPlaceholder(true);
        }, 300); // Increased from 150ms to 300ms for slower fade out
      }, 3000); // Increased from 2000ms to 3000ms for slower transitions
    };

    animationFrame = requestAnimationFrame(animatePlaceholder);

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [searchTerm, categoryTitles.length]);

  // Optimized click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchTerm("");
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside, { passive: true });
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoized search handler
  const handleSearch = useCallback(() => {
    if (!searchTerm || !Array.isArray(categories)) return;
    
    const category = categories.find(
      (cat) => 
        (cat.title_en?.toLowerCase() === searchTerm.toLowerCase()) ||
        (cat.title?.toLowerCase() === searchTerm.toLowerCase()) ||
        (cat.name?.toLowerCase() === searchTerm.toLowerCase())
    );
    
    if (category) {
      navigate(`/category/${category.id}`);
    } else {
      alert("Category not found!");
    }
  }, [searchTerm, categories, navigate]);

  // Highly optimized category filtering
  const filteredCategories = useMemo(() => {
    if (!debouncedSearch || !Array.isArray(categories)) return [];
    
    const searchLower = debouncedSearch.toLowerCase();
    const exactMatches = [];
    const partialMatches = [];
    
    // Single pass optimization for API data structure
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const title = cat.title_en || cat.title || cat.name;
      if (!title) continue;
      
      const titleLower = title.toLowerCase();
      
      if (titleLower === searchLower) {
        exactMatches.push({ ...cat, displayTitle: title });
      } else if (titleLower.startsWith(searchLower)) {
        exactMatches.push({ ...cat, displayTitle: title });
      } else if (titleLower.includes(searchLower)) {
        partialMatches.push({ ...cat, displayTitle: title });
      }
    }
    
    return [...exactMatches, ...partialMatches].slice(0, 12);
  }, [debouncedSearch, categories]);

  // Optimized input handler
  const handleInputChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Optimized clear handler
  const handleClear = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Optimized category selection
  const handleCategorySelect = useCallback((category) => {
    const displayTitle = category.title_en || category.title || category.name;
    setSearchTerm(displayTitle);
    
    // Auto-navigate after selection
    setTimeout(() => {
      navigate(`/category/${category.id}`);
    }, 10);
  }, [navigate]);

  // Loading skeleton for placeholder
  const placeholderContent = useMemo(() => {
    if (isLoading || categoryTitles.length === 0) {
      return "Search categories...";
    }
    return categoryTitles[currentWordIndex];
  }, [isLoading, categoryTitles, currentWordIndex]);

  return (
    <div ref={searchRef} className="w-full relative transform-gpu" style={{ willChange: 'transform' }}>
      {/* Search Input Container - Higher z-index */}
      <div
        className={`flex items-center px-4 py-3 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl relative z-40 transform-gpu
          ${i18n.language === "ar" ? "pr-6" : "pl-6"}
        `}
        style={{ willChange: 'transform' }}
      >
        {/* Search Icon - Bigger size */}
        <AiOutlineSearch
          className={`text-white transform-gpu
            text-xl sm:text-2xl md:text-2xl /* Increased sizes */
            ${i18n.language === "ar" ? "ml-3" : "mr-2"}
          `}
          style={{ willChange: 'transform' }}
        />

        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 outline-none bg-transparent text-white transform-gpu placeholder-transparent"
          style={{ willChange: 'transform' }}
          placeholder={isLoading ? "Loading..." : "Search categories..."}
        />

        <AnimatePresence mode="wait">
          {!searchTerm && showPlaceholder && (
            <motion.span
              key={placeholderContent}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                opacity: { duration: 0.4 },
                y: { duration: 0.6 }, 
                willChange: "opacity, transform"
              }}
              className={`absolute top-3 pointer-events-none select-none text-gray-400 transform-gpu ${
                i18n.language === "ar"
                  ? "right-14 text-right"
                  : "left-14 text-left"
              }`}
              style={{ willChange: 'transform, opacity' }}
            >
              {placeholderContent}
            </motion.span>
          )}
        </AnimatePresence>

        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="transform-gpu"
            style={{ willChange: 'transform' }}
          >
            <AiOutlineClose
              onClick={handleClear}
              className="text-gray-300 hover:text-white text-xl cursor-pointer ml-2 transform-gpu"
              style={{ willChange: 'transform' }}
            />
          </motion.div>
        )}

        <img
          src={qatarflag}
          alt="Qatar Flag"
          className="
            w-7 h-5          
            sm:w-8 sm:h-6    
            md:w-9 md:h-7     
            ml-2 rounded-sm shadow-md object-cover transform-gpu
          "
          loading="lazy"
          decoding="async"
          style={{ 
            transform: 'translateZ(0)',
            contentVisibility: 'auto'
          }}
        />
      </div>

      {/* Dropdown Container - Highest z-index */}
      <AnimatePresence>
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
              duration: 0.2, 
              ease: "easeOut",
              willChange: "transform, opacity"
            }}
            className="absolute top-full left-0 w-full mt-2 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl z-[9999] transform-gpu"
            style={{ 
              willChange: 'transform, opacity',
              // Force above everything including banner text
              isolation: 'isolate'
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-5 pt-4 pb-5 transform-gpu">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="p-2 rounded-lg bg-white/10 animate-pulse transform-gpu"
                    style={{ willChange: 'transform' }}
                  >
                    <div className="h-4 bg-white/20 rounded transform-gpu"></div>
                  </div>
                ))
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => handleCategorySelect(cat)}
                    className={`p-2 rounded-lg cursor-pointer text-center transition transform-gpu ${
                      cat.displayTitle?.toLowerCase() === searchTerm.toLowerCase()
                        ? "bg-white/20 text-white font-semibold"
                        : "text-gray-200 hover:bg-white/10"
                    }`}
                    style={{ willChange: 'transform' }}
                  >
                    {cat.displayTitle}
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center text-gray-400 transform-gpu"
                  style={{ willChange: 'transform' }}
                >
                  No categories found
                </motion.div>
              )}
            </div>
            
            {!isLoading && filteredCategories.length > 0 && (
              <div className="px-5 pb-5 transform-gpu">
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={handleSearch}
                  className="w-full bg-white/20 text-white py-2 rounded-xl hover:bg-white/30 transition font-medium transform-gpu"
                  style={{ willChange: 'transform' }}
                >
                  Search
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
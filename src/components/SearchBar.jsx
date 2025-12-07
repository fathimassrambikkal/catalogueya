import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api";
import { useTranslation } from "react-i18next"; 
import qatarflag from "../assets/Qatarflag.jpg";

// SVG Icons - EXACT SAME SIZE AND VISUAL STYLE AS AiOutlineSearch/AiOutlineClose
const SearchIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="20" // Smaller for desktop
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const CloseIcon = ({ className = "" }) => (
  <svg 
    className={`${className} transform-gpu`}
    width="16" // Smaller
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
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
    
    let intervalId;

    const animatePlaceholder = () => {
      intervalId = setInterval(() => {
        setShowPlaceholder(false);
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % categoryTitles.length);
          setShowPlaceholder(true);
        }, 300);
      }, 3000);
    };

    animatePlaceholder();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [searchTerm, categoryTitles.length]);

  // Show/hide dropdown based on search term
  useEffect(() => {
    setIsDropdownVisible(searchTerm.length > 0);
  }, [searchTerm]);

  // Optimized click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchTerm("");
        setIsDropdownVisible(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside, { passive: true });
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoized search handler (for search button click)
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
      setSearchTerm("");
      setIsDropdownVisible(false);
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

  // Clear handler (used by close icon in dropdown)
  const handleClear = useCallback(() => {
    setSearchTerm("");
    setIsDropdownVisible(false);
  }, []);

  // Optimized category selection (when clicking a category item)
  const handleCategorySelect = useCallback((category) => {
    const displayTitle = category.title_en || category.title || category.name;
    setSearchTerm(displayTitle);
    // Show the category name in search bar but don't navigate yet
  }, []);

  // Loading skeleton for placeholder
  const placeholderContent = useMemo(() => {
    if (isLoading || categoryTitles.length === 0) {
      return "Search categories...";
    }
    return categoryTitles[currentWordIndex];
  }, [isLoading, categoryTitles, currentWordIndex]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div ref={searchRef} className="w-full min-w-[280px] relative transform-gpu" style={{ willChange: 'transform' }}>
      {/* Search Input Container - Higher z-index */}
      <div
        className={`flex items-center px-3 xs:px-4 py-3 xs:py-4 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl relative z-40 transform-gpu
          ${i18n.language === "ar" ? "pr-4 xs:pr-6" : "pl-4 xs:pl-6"}
        `}
        style={{ willChange: 'transform' }}
      >
        {/* Search Icon - Smaller size for desktop */}
        <SearchIcon
          className={`text-white transform-gpu
            text-lg xs:text-xl sm:text-xl md:text-xl /* Smaller for desktop */
            ${i18n.language === "ar" ? "ml-2 xs:ml-3" : "mr-2 xs:mr-2"}
          `}
          style={{ willChange: 'transform' }}
        />

        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="flex-1 outline-none bg-transparent text-white text-sm xs:text-base transform-gpu placeholder-transparent"
          style={{ willChange: 'transform' }}
          placeholder={isLoading ? "Loading..." : "Search categories..."}
        />

        {/* Placeholder with CSS animation */}
        {!searchTerm && showPlaceholder && (
          <span
            key={placeholderContent}
            className={`absolute top-3 xs:top-4 pointer-events-none select-none text-gray-400 text-sm xs:text-base transform-gpu animate-placeholder-slide ${
              i18n.language === "ar"
                ? "right-12 xs:right-14 text-right"
                : "left-12 xs:left-14 text-left"
            }`}
            style={{ willChange: 'transform, opacity' }}
          >
            {placeholderContent}
          </span>
        )}

        {/* Qatar Flag */}
        <img
          src={qatarflag}
          alt="Qatar Flag"
          className="
            w-7 h-5 xs:w-7 xs:h-5          
            sm:w-8 sm:h-6    
            md:w-9 md:h-7     
            ml-2 mr-3 xs:mr-4 rounded-sm shadow-md object-cover transform-gpu
          "
          loading="lazy"
          decoding="async"
          style={{ 
            transform: 'translateZ(0)',
            contentVisibility: 'auto'
          }}
        />
      </div>

      {/* Dropdown Container - Pure CSS animation */}
      {isDropdownVisible && (
        <div
          className="absolute top-full left-0 w-full mt-2 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl z-[9999] transform-gpu animate-dropdown-slide"
          style={{ 
            willChange: 'transform, opacity',
            isolation: 'isolate'
          }}
        >
          {/* Dropdown Header with Close Icon INSIDE */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10">
            <h3 className="text-white text-sm font-medium">
              {filteredCategories.length} {filteredCategories.length === 1 ? 'result' : 'results'} found
            </h3>
            <button
              onClick={handleClear}
              className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition transform-gpu active:scale-95"
              aria-label="Close search"
            >
              <CloseIcon className="transform-gpu" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-5 pt-4 pb-3 transform-gpu">
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
              filteredCategories.map((cat, index) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat)}
                  className={`p-2 rounded-lg cursor-pointer text-center transition transform-gpu animate-item-fade-in ${
                    cat.displayTitle?.toLowerCase() === searchTerm.toLowerCase()
                      ? "bg-white/20 text-white font-semibold"
                      : "text-gray-200 hover:bg-white/10"
                  } active:scale-95`}
                  style={{ 
                    willChange: 'transform',
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  {cat.displayTitle}
                </button>
              ))
            ) : (
              <div 
                className="col-span-full text-center text-gray-400 py-4 transform-gpu animate-fade-in"
                style={{ willChange: 'transform' }}
              >
                No categories found
              </div>
            )}
          </div>
          
          {/* Search Button - Only navigates when clicked */}
          {!isLoading && filteredCategories.length > 0 && (
            <div className="px-5 pb-5 pt-2 border-t border-white/10 transform-gpu">
              <button
                onClick={handleSearch}
                className="w-full bg-white/20 text-white py-2.5 rounded-xl hover:bg-white/30 transition font-medium transform-gpu animate-fade-in active:scale-95"
                style={{ 
                  willChange: 'transform',
                  animationDelay: '0.2s'
                }}
              >
                Search for "{searchTerm}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes placeholder-slide {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes dropdown-slide {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes item-fade-in {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-placeholder-slide {
          animation: placeholder-slide 0.6s ease-out;
        }
        
        .animate-dropdown-slide {
          animation: dropdown-slide 0.2s ease-out;
        }
        
        .animate-item-fade-in {
          animation: item-fade-in 0.3s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { searchCategories } from "../api";
import { useTranslation } from "react-i18next"; 
import qatarflag from "../assets/Qatarflag.jpg";
import { log, warn } from "../utils/logger";
import { showToast } from "../utils/showToast";
// SVG Icons 
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

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
 
  

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
const [isLoading, setIsLoading] = useState(false);

const [placeholderCategories, setPlaceholderCategories] = useState([]);


const PLACEHOLDER_SEEDS = useMemo(() => {
  return i18n.language === "ar"
    ? ["ا", "ب", "خ", "ك"]
    : ["a", "g", "p", "c"];
}, [i18n.language]);

useEffect(() => {
  if (searchTerm) return; // ⛔ stop when typing

  let active = true;

  const loadPlaceholderData = async () => {
    try {
      const seed =
        PLACEHOLDER_SEEDS[
          Math.floor(Math.random() * PLACEHOLDER_SEEDS.length)
        ];

      const res = await searchCategories(seed);
      if (!active) return;

      const data = res?.data;

      // ✅ make sure placeholder has MULTIPLE items
      const combined = [
        ...(data?.categories || []),
        ...(data?.products || []).map(p => ({
          id: `p-${p.id}`,
          name: p.name
        }))
      ];

      setPlaceholderCategories(combined);
      setCurrentWordIndex(0);
    } catch (e) {
      warn("Placeholder fetch failed", e);
    }
  };

  loadPlaceholderData();
  const id = setInterval(loadPlaceholderData, 10000); // refresh content

  return () => {
    active = false;
    clearInterval(id);
  };
}, [searchTerm, i18n.language, PLACEHOLDER_SEEDS]);








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
     showToast(
  i18n.language === "ar"
    ? "لم يتم العثور على الفئة"
    : "Category not found",
  { rtl: i18n.language === "ar" }
);
    }
  }, [searchTerm, categories, navigate]);

useEffect(() => {
  if (!searchTerm.trim()) {
    setCategories([]);
    setIsDropdownVisible(false);
    return;
  }

  const timer = setTimeout(async () => {
    setIsLoading(true);
    try {
      const res = await searchCategories(searchTerm);
      setCategories(res?.data?.categories || []);
      setIsDropdownVisible(true);
    } catch (err) {
      warn("Category search failed", err);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [searchTerm]);



const placeholderTitles = useMemo(() => {
  return placeholderCategories
    .map(c => c.title_en || c.title || c.name)
    .filter(Boolean);
}, [placeholderCategories]);

useEffect(() => {
  if (placeholderTitles.length > 0) {
    setCurrentWordIndex(0);
  }
}, [placeholderTitles]);

const placeholderContent = useMemo(() => {
  if (placeholderTitles.length === 0) return null;
  return placeholderTitles[currentWordIndex];
}, [placeholderTitles, currentWordIndex]);


useEffect(() => {
  if (searchTerm || placeholderTitles.length === 0) return;

  const interval = setInterval(() => {
    setCurrentWordIndex(prev =>
      placeholderTitles.length > 1
        ? (prev + 1) % placeholderTitles.length
        : prev // keep same word if only one
    );
  }, 2000);

  return () => clearInterval(interval);
}, [searchTerm, placeholderTitles]);







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
const handleCategorySelect = useCallback(
  (category) => {
    navigate(`/category/${category.id}`);
    setSearchTerm("");
    setIsDropdownVisible(false);
  },
  [navigate]
);


useEffect(() => {
  log("Placeholder categories:", placeholderTitles);
}, [placeholderTitles]);

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
        className={`flex items-center px-3 xs:px-4 py-3 xs:py-4 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl relative z-50 transform-gpu
          ${i18n.language === "ar" ? "pr-4 xs:pr-6" : "pl-4 xs:pl-6"}
        `}
        style={{ willChange: 'transform' }}
      >
        {/* Search Icon - Smaller size for desktop */}
        <SearchIcon
          className={`text-white transform-gpu
              w-[clamp(19px,4vw,22px)]
    h-[clamp(18px,4vw,22px)]
            ${i18n.language === "ar" ? "ml-2 xs:ml-3" : "mr-2 xs:mr-2"}
          `}
          style={{ willChange: 'transform' }}
        />

        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="flex-1 outline-none bg-transparent text-white text-sm xs:text-base transform-gpu "
          style={{ willChange: 'transform' }}
          
        />

        {/* Placeholder with CSS animation */}
        {!searchTerm && (
  <span
    key={`${placeholderContent}-${currentWordIndex}`}
    className={`absolute top-3 xs:top-4 pointer-events-none select-none 
      text-gray-400 text-sm xs:text-base 
      transform-gpu animate-placeholder-slide
      ${i18n.language === "ar"
        ? "right-12 xs:right-14 text-right"
        : "left-12 xs:left-14 text-left"
      }`}
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
          className="absolute top-full left-0 w-full mt-2
  rounded-xl
  border border-white/20
  bg-black/40 backdrop-blur-xl
  shadow-xl
  z-[9999]
  px-1 transform-gpu animate-dropdown-slide"
          style={{ 
            willChange: 'transform, opacity',
            isolation: 'isolate'
          }}
        >
          {/* Dropdown Header with Close Icon INSIDE */}
          <div className="flex items-center justify-between px-3 pt-1 pb-1 border-b border-white/10">
            <h3 className="text-white text-sm font-medium">
              {categories.length} {categories.length === 1 ? 'result' : 'results'} found
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
        style={{ willChange: "transform" }}
      >
        <div className="h-4 bg-white/20 rounded transform-gpu"></div>
      </div>
    ))
  ) : categories.length > 0 ? (
    categories.map((cat, index) => {
      const title = cat.title_en || cat.title || cat.name;

      return (
        <button
          key={cat.id}
          onClick={() => handleCategorySelect(cat)}
       className={`
  text-center
  rounded-md
  px-1 py-1
  text-xs
  sm:px-3 sm:py-2 sm:text-sm
  transition
  active:scale-95
  ${
    title.toLowerCase() === searchTerm.toLowerCase()
      ? "bg-white/20 text-white font-semibold"
      : "text-gray-300 hover:bg-white/10"
  }
`}

          style={{
            willChange: "transform",
            animationDelay: `${index * 0.05}s`
          }}
        >
          {title}
        </button>
      );
    })
  ) : (
    <div
      className="col-span-full text-center text-gray-400 py-4 transform-gpu animate-fade-in"
      style={{ willChange: "transform" }}
    >
      No categories found
    </div>
  )}
</div>

          
         
         
        </div>
      )}

      {/* CSS Animations */}
 <style>{`
/* ================= Placeholder animation ================= */
@keyframes placeholder-slide {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  40% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-8px);
  }
}

.animate-placeholder-slide {
  animation: placeholder-slide 2s ease-in-out;
}

/* ================= Dropdown animation ================= */
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

.animate-dropdown-slide {
  animation: dropdown-slide 0.2s ease-out;
}

/* ================= Item animation ================= */
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

.animate-item-fade-in {
  animation: item-fade-in 0.3s ease-out forwards;
  opacity: 0;
}

/* ================= Generic fade ================= */
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
`}</style>

    </div>
  );
}
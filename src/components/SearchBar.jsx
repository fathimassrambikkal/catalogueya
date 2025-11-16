import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { categories } from "../data/categoriesData";
import { useTranslation } from "react-i18next"; 
import qatarflag from "../assets/Qatarflag.jpg"

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentWord, setCurrentWord] = useState("I'm looking for...");
  const [startCycle, setStartCycle] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { i18n } = useTranslation(); // get current language

  // Start cycling categories after 0.5s
  useEffect(() => {
    const timer = setTimeout(() => setStartCycle(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Cycle through categories with slower vanish effect
  useEffect(() => {
    if (!startCycle) return;

    const texts = categories.map((c) => c.title);
    let index = 0;

    const interval = setInterval(() => {
      if (searchTerm) return; // stop cycling if user types

      // Show the current word
      setCurrentWord(texts[index]);

      // Vanish after 1.8s (slower)
      const vanishTimer = setTimeout(() => setCurrentWord(null), 1800);

      // Move to next word
      index = (index + 1) % texts.length;

      return () => clearTimeout(vanishTimer);
    }, 2500); // spacing between words

    return () => clearInterval(interval);
  }, [startCycle, searchTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!searchTerm) return;
    const category = categories.find(
      (cat) => cat.title.toLowerCase() === searchTerm.toLowerCase()
    );
    if (category) {
      navigate(`/category/${category.id}`);
    } else {
      alert("Category not found!");
    }
  };

  const filteredCategories = categories
    .filter((cat) =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      a.title.toLowerCase().startsWith(searchTerm.toLowerCase()) ? -1 : 1
    );

  return (
    <div ref={searchRef} className="w-full relative">
      <div className="flex items-center px-4 py-3 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl relative">
        <AiOutlineSearch className="text-white text-xl mr-2" />

        <input
          type="text"
          placeholder=""
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none bg-transparent text-white"
        />

        {/* Animate placeholder / category words */}
        <AnimatePresence>
          {!searchTerm && currentWord && (
            <motion.span
              key={currentWord}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                opacity: { duration: 0.6 },
                y: { duration: 0.8, ease: "easeOut" },
              }}
              className={`absolute top-3 pointer-events-none select-none text-gray-400
                ${i18n.language === "ar" ? "right-10 text-right" : "left-10 text-left"}
              `}
            >
              {currentWord}
            </motion.span>
          )}
        </AnimatePresence>

        {searchTerm && (
          <AiOutlineClose
            onClick={() => setSearchTerm("")}
            className="text-gray-300 hover:text-white text-lg cursor-pointer ml-2"
          />
        )}

        <img
          src={qatarflag}
          alt="Qatar Flag"
          className="w-8 h-6 ml-3 rounded-sm shadow-md"
        />
      </div>

      <AnimatePresence>
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full mt-2 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl z-30"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-5 pt-4 pb-5">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSearchTerm(cat.title)}
                    className={`p-2 rounded-lg cursor-pointer text-center transition ${
                      cat.title.toLowerCase() === searchTerm.toLowerCase()
                        ? "bg-white/20 text-white font-semibold"
                        : "text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    {cat.title}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400">
                  No categories found
                </div>
              )}
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={handleSearch}
                className="w-full bg-white/20 text-white py-2 rounded-xl hover:bg-white/30 transition font-medium"
              >
                Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

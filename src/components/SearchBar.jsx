import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { categories } from "../data/categoriesData";

export default function SearchBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
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
      setSearchOpen(false);
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
      {/* Search Input */}
      <div
        className="flex items-center px-4 py-3 cursor-pointer rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl"
        onClick={() => setSearchOpen(true)}
      >
        <AiOutlineSearch className="text-white text-xl mr-2" />
        <input
          type="text"
          placeholder="I'm looking for..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none bg-transparent text-white placeholder-gray-300"
        />
      </div>

      {/* Dark Glass Dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full mt-2 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl z-30"
          >
            {/* Close Button */}
            <div className="flex justify-end p-3">
              <button
                onClick={() => setSearchOpen(false)}
                className="text-gray-200 hover:text-white text-xl transition"
              >
                <AiOutlineClose />
              </button>
            </div>

            {/* Category List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-5 pb-5">
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

            {/* Search Button */}
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

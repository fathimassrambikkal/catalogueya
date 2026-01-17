import React, { useState } from "react";
import { FaSearch, FaFilter, FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";

const Website = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const categories = ["All", "Electronics", "Fashion", "Home & Garden", "Books", "Sports", "Beauty"];
  
  const products = [
    { id: 1, name: "Wireless Headphones", price: "$129.99", rating: 4.5, category: "Electronics", image: "🎧" },
    { id: 2, name: "Smart Watch Series 5", price: "$299.99", rating: 4.8, category: "Electronics", image: "⌚" },
    { id: 3, name: "Designer Handbag", price: "$199.99", rating: 4.3, category: "Fashion", image: "👜" },
    { id: 4, name: "Gaming Laptop", price: "$1299.99", rating: 4.7, category: "Electronics", image: "💻" },
    { id: 5, name: "Yoga Mat Premium", price: "$49.99", rating: 4.6, category: "Sports", image: "🧘" },
    { id: 6, name: "Cookbook Collection", price: "$39.99", rating: 4.4, category: "Books", image: "📚" },
    { id: 7, name: "Skincare Set", price: "$89.99", rating: 4.5, category: "Beauty", image: "🧴" },
    { id: 8, name: "Garden Tools Set", price: "$79.99", rating: 4.2, category: "Home & Garden", image: "🌿" },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Catalogueya</h1>
        <p className="text-gray-600">Discover amazing products from top brands worldwide</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2">
              <FaFilter /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-4">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="text-5xl">{product.image}</span>
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                <button className="text-gray-400 hover:text-red-500">
                  <FaHeart />
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mb-4">{product.category}</p>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <FaShoppingCart /> Add to Cart
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Website;
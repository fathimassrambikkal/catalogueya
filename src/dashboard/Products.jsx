import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaUpload, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Products({ products, setProducts, editingProduct, setEditingProduct }) {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    description: "",
    tags: [], 
    image: "",
    media: [],
    category: "", 
    hidden: false, 
  });

  const availableCategories = [
    "Carpenter",
    "Lighting", 
    "Carpet",
    "Furniture",
    "Decoration",
    "Kitchen",
    "Bathroom",
    "Outdoor"
  ];

  const availableTags = [
    "New Arrival",
    "Limited Edition",
    "Best Seller",
    "Low in Stock",
    "Out of Stock"
  ];

  useEffect(() => {
    if (!editingProduct) return;

    if (editingProduct.id) {
      setFormData({
        id: editingProduct.id,
        name: editingProduct.name || "",
        price: editingProduct.price || "",
        stock: editingProduct.stock || "",
        description: editingProduct.description || "",
        tags: editingProduct.tags ? [...editingProduct.tags] : [], 
        image: editingProduct.image || "",
        media: editingProduct.media ? [...editingProduct.media] : [],
        category: editingProduct.category || "",
        hidden: editingProduct.hidden || false, 
      });
    } else {
      setFormData({
        id: null,
        name: "",
        price: "",
        stock: "",
        description: "",
        tags: [], 
        image: "",
        media: [],
        category: "",
        hidden: false, 
      });
    }
  }, [editingProduct]);

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      category: category
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag] 
    }));
  };

  const toggleProductVisibility = (productId) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, hidden: !p.hidden }
          : p
      )
    );
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Product Name is required!");
      return;
    }

    const cleaned = {
      ...formData,
      stock: formData.stock === "" ? "" : Number(formData.stock),
      price: formData.price === "" ? "" : Number(formData.price),
    };

    if (!cleaned.image && cleaned.media.length > 0) {
      cleaned.image = cleaned.media[0].url;
    }

    if (cleaned.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === cleaned.id ? { ...p, ...cleaned } : p))
      );
    } else {
      const newProd = { ...cleaned, id: Date.now(), image: cleaned.image || "" };
      setProducts((prev) => [...prev, newProd]);
    }

    setEditingProduct(null);
  };

  const handleDeleteProduct = () => {
    if (formData.id) {
      setProducts((prev) => prev.filter((p) => p.id !== formData.id));
    }
    setEditingProduct(null);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleMediaFiles = async (files) => {
    if (!files || files.length === 0) return;

    const newItems = await Promise.all(
      Array.from(files).map(async (file, idx) => {
        const type = file.type.startsWith("video") ? "video" : "image";
        const url = await fileToBase64(file);
        return {
          id: Date.now() + Math.random() + idx,
          title: file.name || `Upload ${idx + 1}`,
          type,
          status: "ok",
          file,
          url,
        };
      })
    );

    setFormData((prev) => ({ ...prev, media: [...prev.media, ...newItems] }));
  };

  const handleRemoveMedia = (id) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m.id !== id),
    }));
  };

  const pickFirstMediaAsImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: prev.media.length ? prev.media[0].url || "" : "",
    }));
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-8 overflow-x-hidden max-w-full">
      {/* Header with Top-right Add Button */}
      <div className="flex flex-row items-center justify-between gap-2 mb-4 mt-4 sm:mt-10 min-w-0 w-full">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex-1 min-w-0 truncate pr-2">Our Products</h2>
        <button
          className="flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all text-sm min-w-0 flex-shrink-0 whitespace-nowrap"
          onClick={() => setEditingProduct({})} 
        >
          <FaPlus className="flex-shrink-0 text-sm" /> 
          <span className="sm:inline hidden">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 min-w-0 w-full">
        {products.map((p) => (
          <div key={p.id} className="bg-white/80 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-xl p-3 border border-gray-200/60 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-200 relative min-w-0 overflow-hidden w-full">
            
            {/* Hide Eye Icon - Bottom Right */}
            <button
              onClick={() => toggleProductVisibility(p.id)}
              className={`absolute bottom-2 right-2 p-2 rounded-full backdrop-blur-md border transition-all duration-200 flex-shrink-0 ${
                p.hidden 
                  ? "bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200" 
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              }`}
              title={p.hidden ? "Show to users" : "Hide from users"}
            >
              {p.hidden ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
            </button>

            {/* Hidden Badge */}
            {p.hidden && (
              <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-600 rounded border border-yellow-200 flex-shrink-0">
                Hidden
              </div>
            )}

            {/* Display multiple tags */}
            {p.tags && p.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 min-w-0">
                {p.tags.map((tag, index) => (
                  <div key={index} className="inline-block px-2 py-1 text-xs font-semibold bg-blue-500/10 text-blue-600 rounded border border-blue-200 truncate max-w-[70px] sm:max-w-[80px]">
                    {tag}
                  </div>
                ))}
              </div>
            )}
            
            {p.image ? (
              <img src={p.image} className="w-full h-20 sm:h-32 object-cover rounded-lg mb-2 border border-gray-200/60 min-w-0" alt={p.name} />
            ) : (
              <div className="w-full h-20 sm:h-32 rounded-lg mb-2 bg-gray-50/60 border border-gray-200/60 flex items-center justify-center text-gray-400 backdrop-blur-sm text-xs min-w-0">
                No image
              </div>
            )}
            
            <h3 className="font-semibold text-sm sm:text-[15px] text-gray-900 truncate min-w-0">{p.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate min-w-0">Price: QAR {p.price}</p>
            <p className="text-xs sm:text-sm text-gray-600 truncate min-w-0">Stock: {p.stock}</p>
            
            {/* Display single category */}
            {p.category && (
              <div className="mt-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate min-w-0">
                  Category: {p.category}
                </p>
              </div>
            )}

            <div className="mt-2 flex gap-2 min-w-0 w-full">
              <button 
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-sm min-w-0 flex-1 justify-center" 
                onClick={() => setEditingProduct(p)}
              >
                <FaEdit className="flex-shrink-0" /> 
                <span className="truncate">Edit</span>
              </button>
              <button 
                className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors text-sm min-w-0 flex-1 justify-center" 
                onClick={() => setProducts((prev) => prev.filter((prod) => prod.id !== p.id))}
              >
                <FaTrash className="flex-shrink-0" /> 
                <span className="truncate">Delete</span>
              </button>
            </div>
          </div>
        ))}

        {/* Add Product Card */}
        <div
          className="bg-white/80 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-dashed border-gray-300/60 transition-all duration-200 min-w-0 w-full"
          onClick={() => setEditingProduct({})}
        >
          <FaPlus className="text-xl sm:text-2xl text-gray-400 mb-2 flex-shrink-0" />
          <span className="text-gray-600 font-medium text-sm text-center min-w-0">Add Product</span>
        </div>
      </div>

      {/* Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start p-1 sm:p-2 md:p-4 overflow-auto z-50">
          <div className="bg-white/90 backdrop-blur-lg w-full max-w-[calc(100vw-8px)] sm:max-w-2xl md:max-w-3xl rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-gray-200/60 max-h-[90vh] overflow-y-auto mx-1 sm:mx-2 min-w-0">
            {/* Header */}
            <div className="bg-blue-500 text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold truncate min-w-0 flex-1 pr-2">
                {formData.id ? "Edit Product" : "Add Product"}
              </h2>
              <button 
                className="text-white text-xl hover:text-gray-200 transition-colors flex-shrink-0 w-6 h-6 flex items-center justify-center min-w-0" 
                onClick={() => setEditingProduct(null)}
              >
                ×
              </button>
            </div>

            <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 min-w-0">
              {/* Upload Area */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-3 sm:p-4 md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4 min-w-0">Upload Images / Videos</h3>
                <label className="border-2 border-dashed border-gray-300/60 rounded-xl p-3 sm:p-4 md:p-6 flex flex-col items-center text-gray-500 cursor-pointer hover:bg-gray-50/60 transition-all duration-200 backdrop-blur-sm text-center min-w-0">
                  <FaUpload className="text-lg sm:text-2xl mb-1 sm:mb-2 flex-shrink-0" />
                  <span className="text-xs sm:text-sm min-w-0">Upload from Files</span>
                  <input type="file" className="hidden" onChange={(e) => handleMediaFiles(e.target.files)} multiple accept="image/*,video/*" />
                </label>

                <div className="mt-2 sm:mt-4 space-y-2 min-w-0">
                  {formData.media.map((m) => (
                    <div key={m.id} className={`flex justify-between items-center p-2 sm:p-3 rounded-lg border backdrop-blur-sm min-w-0 ${
                      m.status === "error" 
                        ? "bg-red-100/60 border-red-300/60" 
                        : "bg-blue-100/60 border-blue-300/60"
                    }`}>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {m.type === "image" ? (
                          <img src={m.url} alt={m.title} className="w-8 h-6 sm:w-10 sm:h-8 md:w-12 md:h-8 object-cover rounded-lg border border-gray-200/60 flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-6 sm:w-10 sm:h-8 md:w-12 md:h-8 flex items-center justify-center bg-gray-100/60 rounded-lg text-xs backdrop-blur-sm flex-shrink-0 min-w-0">VIDEO</div>
                        )}
                        <span className="truncate text-gray-700 flex-1 text-xs sm:text-sm min-w-0">{m.title}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {m.status === "ok" ? <FaCheck className="text-green-600 text-sm flex-shrink-0" /> : <FaTimes className="text-red-600 text-sm flex-shrink-0" />}
                        <button className="text-gray-700 hover:text-red-600 transition-colors flex-shrink-0" onClick={() => handleRemoveMedia(m.id)}>
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2 min-w-0">
                    <button 
                      type="button" 
                      className="px-3 py-2 rounded-lg bg-gray-100/60 border border-gray-200/60 text-sm backdrop-blur-sm hover:bg-gray-200/60 transition-all disabled:opacity-50 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0" 
                      onClick={pickFirstMediaAsImage} 
                      disabled={formData.media.length === 0}
                    >
                      Use first as product image
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-3 sm:p-4 md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 min-w-0">Product Information</h3>
                <div className="grid grid-cols-1 gap-2 sm:gap-4 md:gap-6 mt-2 sm:mt-4 min-w-0">
                  <div className="min-w-0">
                    <label className="font-medium mb-1 block text-gray-700 text-sm sm:text-base min-w-0">
                      Product Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                      className="border border-gray-300/60 p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-w-0" 
                      value={formData.name} 
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 min-w-0">
                    <div className="min-w-0">
                      <label className="font-medium mb-1 block text-gray-700 text-sm sm:text-base min-w-0">Product Price (QAR)</label>
                      <input 
                        className="border border-gray-300/60 p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-w-0" 
                        type="number" 
                        value={formData.price} 
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} 
                      />
                    </div>
                    <div className="min-w-0">
                      <label className="font-medium mb-1 block text-gray-700 text-sm sm:text-base min-w-0">Stock Quantity</label>
                      <input 
                        className="border border-gray-300/60 p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-w-0" 
                        type="number" 
                        value={formData.stock} 
                        onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))} 
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="font-medium mb-1 block text-gray-700 text-sm sm:text-base min-w-0">Product Description</label>
                    <textarea 
                      className="border border-gray-300/60 p-2 rounded-lg w-full h-20 sm:h-24 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-w-0" 
                      value={formData.description} 
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} 
                    />
                  </div>
                </div>
              </div>

              {/* Product Category Section */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-3 sm:p-4 md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4 min-w-0">Product Category</h3>
                
                <div className="rounded-xl border border-gray-300/60 min-w-0">
                  <div className="relative h-28 sm:h-36 md:h-44 overflow-hidden rounded-xl min-w-0">
                    <div className="absolute top-0 left-0 right-0 h-3 sm:h-4 bg-gradient-to-b from-white/90 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-3 sm:h-4 bg-gradient-to-t from-white/90 to-transparent z-10 pointer-events-none"></div>
                    
                    <div className="h-full overflow-y-auto min-w-0">
                      <div className="space-y-1 p-1 min-w-0">
                        {availableCategories.map((category) => (
                          <div
                            key={category}
                            className={`text-gray-700 hover:bg-gray-100/60 bg-gray-50/60 flex h-7 sm:h-8 md:h-9 w-full items-center gap-2 rounded-lg px-2 sm:px-3 md:px-4 cursor-pointer transition-all duration-200 min-w-0 ${
                              formData.category === category ? "bg-blue-500/10 text-blue-600 border border-blue-200" : ""
                            }`}
                            onClick={() => handleCategoryChange(category)}
                          >
                            <span className="text-xs sm:text-sm font-medium flex-1 truncate min-w-0">{category}</span>
                            {formData.category === category && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {formData.category && (
                  <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-200/60 min-w-0">
                    <p className="text-xs sm:text-sm text-blue-600 truncate min-w-0">
                      Selected: <span className="font-semibold">{formData.category}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Tags & Stock */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-3 sm:p-4 md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 min-w-0">Product Tags & Stock</h3>
                <div className="grid grid-cols-1 gap-2 sm:gap-4 md:gap-6 mt-2 sm:mt-4 min-w-0">
                  <div className="min-w-0">
                    <label className="font-medium mb-1 block text-gray-700 text-sm sm:text-base min-w-0">Special Mark</label>
                    <div className="space-y-1 sm:space-y-2 min-w-0">
                      {availableTags.map((tag) => (
                        <label key={tag} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50/60 transition-all backdrop-blur-sm min-w-0">
                          <input
                            type="checkbox"
                            checked={formData.tags.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20 flex-shrink-0"
                          />
                          <span className="text-gray-700 text-sm truncate min-w-0">{tag}</span>
                        </label>
                      ))}
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-200/60 min-w-0">
                        <p className="text-xs sm:text-sm text-blue-600 truncate min-w-0">
                          Selected: {formData.tags.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Visibility Toggle in Modal */}
              {formData.id && (
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-3 sm:p-4 md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] min-w-0">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4 min-w-0">Product Visibility</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, hidden: !prev.hidden }))}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap text-sm min-w-0 ${
                        formData.hidden 
                          ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30" 
                          : "bg-green-500 text-white shadow-lg shadow-green-500/30"
                      }`}
                    >
                      {formData.hidden ? <FaEyeSlash className="flex-shrink-0" /> : <FaEye className="flex-shrink-0" />}
                      {formData.hidden ? "Hidden" : "Visible"}
                    </button>
                    <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left min-w-0">
                      {formData.hidden 
                        ? "Hidden from customer view" 
                        : "Visible to customers"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gray-50/60 backdrop-blur-sm border-t border-gray-200/60 min-w-0">
              <div className="text-sm text-gray-700 font-medium text-center sm:text-left mb-2 sm:mb-0 flex-1 min-w-0">
                Do you want to add this product on sale?
              </div>
              
              <div className="flex gap-2 sm:gap-2 md:gap-3 flex-wrap justify-center sm:justify-end w-full sm:w-auto min-w-0">
                {formData.id && (
                  <button 
                    className="px-4 py-2 rounded-lg bg-red-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all text-sm whitespace-nowrap min-w-[70px] text-center flex-1 sm:flex-none"
                    onClick={handleDeleteProduct}
                  >
                    Delete
                  </button>
                )}
                <button 
                  className="px-4 py-2 rounded-lg bg-gray-300/60 backdrop-blur-sm border border-gray-300/60 hover:bg-gray-400/60 transition-all text-sm whitespace-nowrap min-w-[70px] text-center flex-1 sm:flex-none"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all text-sm whitespace-nowrap min-w-[70px] text-center flex-1 sm:flex-none"
                  onClick={handleSave}
                >
                  {formData.id ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
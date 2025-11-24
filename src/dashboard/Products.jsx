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
    "Out in Stock"
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
    <div className="w-full px-4 md:px-8">
      {/* Header with Top-right Add Button */}
      <div className="flex items-center justify-between mb-6 mt-10">
        <h2 className="text-lg font-semibold text-gray-900">Our Products</h2>
        <button
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
          onClick={() => setEditingProduct({})} 
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white/80 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-xl p-4 border border-gray-200/60 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-200 relative">
            
            {/*  Hide Eye Icon - Bottom Right */}
            <button
              onClick={() => toggleProductVisibility(p.id)}
              className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
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
              <div className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-600 rounded-md border border-yellow-200">
                Hidden
              </div>
            )}

            {/*  Display multiple tags */}
            {p.tags && p.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {p.tags.map((tag, index) => (
                  <div key={index} className="inline-block px-2 py-1 text-xs font-semibold bg-blue-500/10 text-blue-600 rounded-md border border-blue-200">
                    {tag}
                  </div>
                ))}
              </div>
            )}
            {p.image ? (
              <img src={p.image} className="w-full h-32 object-cover rounded-lg mb-3 border border-gray-200/60" alt={p.name} />
            ) : (
              <div className="w-full h-32 rounded-lg mb-3 bg-gray-50/60 border border-gray-200/60 flex items-center justify-center text-gray-400 backdrop-blur-sm">
                No image
              </div>
            )}
            <h3 className="font-semibold text-[17px] text-gray-900">{p.name}</h3>
            <p className="text-sm text-gray-600">Price: QAR {p.price}</p>
            <p className="text-sm text-gray-600">Stock: {p.stock}</p>
            
            {/* Display single category */}
            {p.category && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Category: {p.category}
                </p>
              </div>
            )}

            <div className="mt-3 flex gap-3">
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors" onClick={() => setEditingProduct(p)}>
                <FaEdit /> Edit
              </button>
              <button className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors" onClick={() => setProducts((prev) => prev.filter((prod) => prod.id !== p.id))}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        {/* Add Product Card */}
        <div
          className="bg-white/80 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-dashed border-gray-300/60 transition-all duration-200"
          onClick={() => setEditingProduct({})}
        >
          <FaPlus className="text-3xl text-gray-400 mb-2" />
          <span className="text-gray-600 font-medium">Add Product</span>
        </div>
      </div>

      {/* Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start py-10 overflow-auto z-50">
          <div className="bg-white/90 backdrop-blur-lg w-full max-w-3xl rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden border border-gray-200/60">
            {/* Header */}
            <div className="bg-blue-500 text-white px-6 py-4 flex justify-between">
              <h2 className="text-lg font-semibold">{formData.id ? "Edit Product" : "Add Product"}</h2>
              <button className="text-white text-xl hover:text-gray-200 transition-colors" onClick={() => setEditingProduct(null)}>×</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Upload Area */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Images / Videos</h3>
                <label className="border-2 border-dashed border-gray-300/60 rounded-xl p-6 flex flex-col items-center text-gray-500 cursor-pointer hover:bg-gray-50/60 transition-all duration-200 backdrop-blur-sm">
                  <FaUpload className="text-2xl mb-2" />
                  <span>Upload from Files</span>
                  <input type="file" className="hidden" onChange={(e) => handleMediaFiles(e.target.files)} multiple accept="image/*,video/*" />
                </label>

                <div className="mt-4 space-y-3">
                  {formData.media.map((m) => (
                    <div key={m.id} className={`flex justify-between items-center p-3 rounded-lg border backdrop-blur-sm ${
                      m.status === "error" 
                        ? "bg-red-100/60 border-red-300/60" 
                        : "bg-blue-100/60 border-blue-300/60"
                    }`}>
                      <div className="flex items-center gap-3">
                        {m.type === "image" ? (
                          <img src={m.url} alt={m.title} className="w-12 h-8 object-cover rounded-lg border border-gray-200/60" />
                        ) : (
                          <div className="w-12 h-8 flex items-center justify-center bg-gray-100/60 rounded-lg text-xs backdrop-blur-sm">VIDEO</div>
                        )}
                        <span className="truncate max-w-xs text-gray-700">{m.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {m.status === "ok" ? <FaCheck className="text-green-600" /> : <FaTimes className="text-red-600" />}
                        <button className="text-gray-700 hover:text-red-600 transition-colors" onClick={() => handleRemoveMedia(m.id)}><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-2">
                    <button 
                      type="button" 
                      className="px-3 py-1 rounded-lg bg-gray-100/60 border border-gray-200/60 text-sm backdrop-blur-sm hover:bg-gray-200/60 transition-all disabled:opacity-50" 
                      onClick={pickFirstMediaAsImage} 
                      disabled={formData.media.length === 0}
                    >
                      Use first media as product image
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="font-medium mb-1 block text-gray-700">Product Title <span className="text-red-500">*</span></label>
                    <input className="border border-gray-300/60 p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="font-medium mb-1 block text-gray-700">Product Price (QAR)</label>
                    <input className="border border-gray-300/60 p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" type="number" value={formData.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-medium mb-1 block text-gray-700">Product Description</label>
                    <textarea className="border border-gray-300/60 p-2 rounded-lg w-full h-24 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Product Category Section - Scroll Area with Fade Effect */}
      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Category</h3>
        
        {/* Scroll Area Container */}
        <div className="rounded-xl border border-gray-300/60">
          <div className="relative h-48 overflow-hidden rounded-xl">
            {/* Fade Effect Top */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/90 to-transparent z-10 pointer-events-none"></div>
            
            {/* Fade Effect Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/90 to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrollable Content */}
            <div className="h-full overflow-y-auto">
              <div className="space-y-1 p-1">
                {availableCategories.map((category, index) => (
                  <div
                    key={category}
                    className={`text-gray-700 hover:bg-gray-100/60 bg-gray-50/60 flex h-10 w-full items-center gap-2 rounded-lg px-4 cursor-pointer transition-all duration-200 ${
                      formData.category === category ? "bg-blue-500/10 text-blue-600 border border-blue-200" : ""
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    <span className="text-sm font-medium flex-1">{category}</span>
                    {formData.category === category && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Category Display */}
        {formData.category && (
          <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-200/60">
            <p className="text-sm text-blue-600">
              Selected: <span className="font-semibold">{formData.category}</span>
            </p>
          </div>
        )}
      </div>
              {/*  Tags & Stock - Now multiple checkboxes for tags */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <h3 className="text-lg font-semibold text-gray-900">Product Tags & Stock</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="font-medium mb-1 block text-gray-700">Special Mark</label>
                    <div className="space-y-2">
                      {availableTags.map((tag) => (
                        <label key={tag} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50/60 transition-all backdrop-blur-sm">
                          <input
                            type="checkbox"
                            checked={formData.tags.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                          />
                          <span className="text-gray-700">{tag}</span>
                        </label>
                      ))}
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-200/60">
                        <p className="text-sm text-blue-600">
                          Selected: {formData.tags.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="font-medium mb-1 block text-gray-700">Number of Current Stock</label>
                    <input className="border border-gray-300/60 p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" type="number" value={formData.stock} onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/*  Visibility Toggle in Modal */}
              {formData.id && (
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Visibility</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, hidden: !prev.hidden }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        formData.hidden 
                          ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30" 
                          : "bg-green-500 text-white shadow-lg shadow-green-500/30"
                      }`}
                    >
                      {formData.hidden ? <FaEyeSlash /> : <FaEye />}
                      {formData.hidden ? "Hidden from Users" : "Visible to Users"}
                    </button>
                    <span className="text-sm text-gray-600">
                      {formData.hidden 
                        ? "This product is hidden from customer view" 
                        : "This product is visible to customers"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50/60 backdrop-blur-sm border-t border-gray-200/60">
              {/*  Sale question text */}
              <div className="text-sm text-gray-700 font-medium">
                Do you want to add this product on sale?
              </div>
              
              <div className="flex gap-4">
                {formData.id && (
                  <button className="px-6 py-2 rounded-lg bg-red-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all" onClick={handleDeleteProduct}>
                    Delete
                  </button>
                )}
                <button className="px-6 py-2 rounded-lg bg-gray-300/60 backdrop-blur-sm border border-gray-300/60 hover:bg-gray-400/60 transition-all" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button className="px-6 py-2 rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all" onClick={handleSave}>
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
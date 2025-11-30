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

      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-2 mb-4 mt-4 sm:mt-10 min-w-0 w-full max-w-full overflow-x-hidden">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex-1 min-w-0 truncate pr-2 break-words">
          Our Products
        </h2>

        <button
          className="flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all text-sm flex-shrink-0 min-w-0"
          onClick={() => setEditingProduct({})}
        >
          <FaPlus className="text-sm" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-full overflow-x-hidden">

        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white/80 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-xl p-3 border border-gray-200/60 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-200 relative min-w-0"
          >

            {/* Toggle visibility */}
            <button
              onClick={() => toggleProductVisibility(p.id)}
              className={`absolute bottom-2 right-2 p-2 rounded-full backdrop-blur-md border transition-all ${
                p.hidden
                  ? "bg-yellow-100 text-yellow-600 border-yellow-200"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {p.hidden ? <FaEyeSlash /> : <FaEye />}
            </button>

            {p.hidden && (
              <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-600 rounded border border-yellow-200 break-words">
                Hidden
              </div>
            )}

            {p.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 min-w-0">
                {p.tags.map((tag, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 text-xs font-semibold bg-blue-500/10 text-blue-600 rounded border border-blue-200 truncate max-w-[80px] break-words"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {p.image ? (
              <img
                src={p.image}
                className="w-full h-20 sm:h-32 object-cover rounded-lg mb-2 border border-gray-200/60 min-w-0"
                alt={p.name}
              />
            ) : (
              <div className="w-full h-20 sm:h-32 rounded-lg mb-2 bg-gray-50 flex items-center justify-center text-gray-400 text-xs break-words">
                No image
              </div>
            )}

            <h3 className="font-semibold text-sm text-gray-900 truncate break-words min-w-0">{p.name}</h3>
            <p className="text-xs text-gray-600 truncate break-words">Price: QAR {p.price}</p>
            <p className="text-xs text-gray-600 truncate break-words">Stock: {p.stock}</p>

            {p.category && (
              <p className="text-xs text-gray-600 mt-1 truncate break-words">Category: {p.category}</p>
            )}

            <div className="mt-2 flex gap-2 min-w-0">
              <button
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm flex-1 justify-center min-w-0"
                onClick={() => setEditingProduct(p)}
              >
                <FaEdit /> Edit
              </button>

              <button
                className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm flex-1 justify-center min-w-0"
                onClick={() => setProducts(prev => prev.filter(prod => prod.id !== p.id))}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <div
          onClick={() => setEditingProduct({})}
          className="bg-white/80 backdrop-blur-lg shadow rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg border border-dashed border-gray-300 transition-all min-w-0"
        >
          <FaPlus className="text-2xl text-gray-400 mb-2" />
          <span className="text-gray-600 font-medium text-sm break-words">Add Product</span>
        </div>

      </div>

      {/* MODAL — SCROLL FIXED */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start p-2 md:p-4 overflow-y-auto overflow-x-hidden z-50">

          <div className="
            bg-white/90 backdrop-blur-lg w-full 
            max-w-[calc(100vw-16px)] sm:max-w-2xl md:max-w-3xl 
            rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] 
            border border-gray-200/60 
            max-h-[90vh] overflow-y-auto mx-1 sm:mx-2 min-w-0
          ">

            {/* HEADER */}
            <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center sticky top-0 z-10 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold truncate flex-1 break-words min-w-0">
                {formData.id ? "Edit Product" : "Add Product"}
              </h2>
              <button
                className="text-white text-xl w-6 h-6 flex items-center justify-center flex-shrink-0 min-w-0"
                onClick={() => setEditingProduct(null)}
              >
                ×
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 sm:p-6 space-y-6 min-w-0">

              {/* Upload */}
              <div className="bg-white/60 rounded-xl p-4 border min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold break-words">Upload Images / Videos</h3>

                <label className="border-2 border-dashed p-4 rounded-xl flex flex-col items-center text-gray-500 cursor-pointer min-w-0">
                  <FaUpload className="text-2xl mb-2" />
                  Upload from Files
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => handleMediaFiles(e.target.files)}
                    multiple
                    accept="image/*,video/*"
                  />
                </label>

                <div className="mt-4 space-y-2 min-w-0">
                  {formData.media.map((m) => (
                    <div
                      key={m.id}
                      className={`flex justify-between items-center p-3 rounded-lg border min-w-0 ${
                        m.status === "error"
                          ? "bg-red-100/60 border-red-300"
                          : "bg-blue-100/60 border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {m.type === "image" ? (
                          <img src={m.url} className="w-12 h-10 object-cover rounded-lg border flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-10 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">VIDEO</div>
                        )}
                        <span className="truncate text-sm break-words min-w-0">{m.title}</span>
                      </div>

                      <button
                        className="text-gray-700 hover:text-red-600 flex-shrink-0 min-w-0"
                        onClick={() => handleRemoveMedia(m.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}

                  <button
                    className="px-3 py-2 rounded-lg bg-gray-100 border hover:bg-gray-200 transition-all w-full sm:w-auto min-w-0 break-words"
                    onClick={pickFirstMediaAsImage}
                    disabled={formData.media.length === 0}
                  >
                    Use first as product image
                  </button>
                </div>
              </div>

              {/* PRODUCT INFO */}
              <div className="bg-white/60 rounded-xl p-4 border min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold break-words">Product Information</h3>

                <div className="space-y-4 mt-4 min-w-0">
                  <div className="min-w-0">
                    <label className="text-sm font-medium block mb-1 break-words">
                      Product Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="border p-2 rounded-lg w-full min-w-0"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                    <div className="min-w-0">
                      <label className="text-sm font-medium block mb-1 break-words">Product Price</label>
                      <input
                        className="border p-2 rounded-lg w-full min-w-0"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="text-sm font-medium block mb-1 break-words">Stock Quantity</label>
                      <input
                        className="border p-2 rounded-lg w-full min-w-0"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <label className="text-sm font-medium block mb-1 break-words">Description</label>
                    <textarea
                      className="border p-2 rounded-lg w-full h-24 min-w-0"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* CATEGORY */}
              <div className="bg-white/60 rounded-xl p-4 border min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold mb-3 break-words">Product Category</h3>

                <div className="border rounded-xl h-36 overflow-y-auto min-w-0">
                  <div className="p-2 space-y-1 min-w-0">
                    {availableCategories.map((category) => (
                      <div
                        key={category}
                        className={`p-2 rounded-lg cursor-pointer break-words min-w-0 ${
                          formData.category === category
                            ? "bg-blue-500/10 text-blue-600 border border-blue-200"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>

                {formData.category && (
                  <div className="mt-3 p-2 bg-blue-500/10 border border-blue-200 rounded-lg break-words min-w-0">
                    Selected: <strong>{formData.category}</strong>
                  </div>
                )}
              </div>

              {/* TAGS */}
              <div className="bg-white/60 rounded-xl p-4 border min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold break-words">Tags</h3>

                <div className="mt-3 space-y-2 min-w-0">
                  {availableTags.map((tag) => (
                    <label key={tag} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 min-w-0">
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="flex-shrink-0"
                      />
                      <span className="break-words min-w-0">{tag}</span>
                    </label>
                  ))}
                </div>

                {formData.tags.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-500/10 border border-blue-200 rounded-lg break-words min-w-0">
                    Selected: {formData.tags.join(", ")}
                  </div>
                )}
              </div>

              {/* VISIBILITY */}
              {formData.id && (
                <div className="bg-white/60 rounded-xl p-4 border min-w-0">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3 break-words">Visibility</h3>

                  <button
                    onClick={() => setFormData(prev => ({ ...prev, hidden: !prev.hidden }))}
                    className={`px-3 py-2 rounded-lg text-white min-w-0 break-words ${
                      formData.hidden ? "bg-yellow-500" : "bg-green-500"
                    }`}
                  >
                    {formData.hidden ? <FaEyeSlash /> : <FaEye />}
                    {formData.hidden ? " Hidden" : " Visible"}
                  </button>
                </div>
              )}

            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t bg-gray-50 min-w-0">
              <span className="text-sm flex-1 text-center sm:text-left break-words min-w-0">
                Do you want to add this product on sale?
              </span>

              <div className="flex gap-2 flex-wrap justify-center sm:justify-end min-w-0">

                {formData.id && (
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg min-w-0 break-words"
                    onClick={handleDeleteProduct}
                  >
                    Delete
                  </button>
                )}

                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg min-w-0 break-words"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg min-w-0 break-words"
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
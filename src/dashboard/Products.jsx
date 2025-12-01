// Products.jsx (Optimized - Deep)
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaUpload,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

/**
 * Products component - Deep optimized version
 * - Prevents horizontal scroll (uses min-w-0 and overflow-hidden consistently)
 * - Media handling uses object URLs + cleanup to avoid memory leaks
 * - Modal is constrained with max-h and scroll inside modal only
 * - Keeps UI similar to original but improves performance & safety
 */

export default function Products({
  products = [],
  setProducts = () => {},
  editingProduct,
  setEditingProduct,
}) {
  // local copy of form data used by modal
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

  // Keep refs to created objectURLs so we can revoke them
  const objectUrlRefs = useRef(new Map());

  // Some fixed lists (memoized)
  const availableCategories = useMemo(
    () => [
      "Carpenter",
      "Lighting",
      "Carpet",
      "Furniture",
      "Decoration",
      "Kitchen",
      "Bathroom",
      "Outdoor",
    ],
    []
  );

  const availableTags = useMemo(
    () => [
      "New Arrival",
      "Limited Edition",
      "Best Seller",
      "Low in Stock",
      "Out of Stock",
    ],
    []
  );

  // Initialize formData when editingProduct changes (supports create & edit)
  useEffect(() => {
    if (!editingProduct) {
      // reset
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
      return;
    }

    // If editingProduct is an object with fields, copy safely
    setFormData({
      id: editingProduct.id ?? null,
      name: editingProduct.name ?? "",
      price: editingProduct.price ?? "",
      stock: editingProduct.stock ?? "",
      description: editingProduct.description ?? "",
      tags: Array.isArray(editingProduct.tags)
        ? [...editingProduct.tags]
        : [],
      image: editingProduct.image ?? "",
      media: Array.isArray(editingProduct.media)
        ? // ensure media items have id + url
          editingProduct.media.map((m, idx) => ({
            id: m.id ?? `m-${Date.now()}-${idx}`,
            title: m.title ?? m.name ?? `Media ${idx + 1}`,
            type: m.type ?? "image",
            status: "ok",
            file: m.file ?? null,
            url: m.url ?? m.preview ?? m, // permissive
          }))
        : [],
      category: editingProduct.category ?? "",
      hidden: !!editingProduct.hidden,
    });
  }, [editingProduct]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      for (const url of objectUrlRefs.current.values()) {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // ignore
        }
      }
      objectUrlRefs.current.clear();
    };
  }, []);

  // Utility: toggle category
  const handleCategoryChange = (category) =>
    setFormData((prev) => ({ ...prev, category }));

  // Utility: toggle tag
  const handleTagToggle = (tag) =>
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));

  // Toggle product visibility in main list
  const toggleProductVisibility = (productId) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, hidden: !p.hidden } : p))
    );

  // Save product: create or update
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
      setProducts((prev) => prev.map((p) => (p.id === cleaned.id ? { ...p, ...cleaned } : p)));
    } else {
      const newProd = {
        ...cleaned,
        id: Date.now(),
        image: cleaned.image || "",
      };
      setProducts((prev) => [newProd, ...prev]);
    }

    // close modal
    setEditingProduct(null);
  };

  // Delete product from store when editing
  const handleDeleteProduct = () => {
    if (formData.id) {
      setProducts((prev) => prev.filter((p) => p.id !== formData.id));
    }
    setEditingProduct(null);
  };

  // Convert file to object URL for preview (faster than base64 and easier to revoke)
  const createPreviewUrl = (file) => {
    if (!file) return null;
    try {
      const url = URL.createObjectURL(file);
      objectUrlRefs.current.set(file, url);
      return url;
    } catch (e) {
      return null;
    }
  };

  // handle files dropped or selected
  const handleMediaFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const items = files.map((file, idx) => {
      const type = file.type && file.type.startsWith("video") ? "video" : "image";
      const url = createPreviewUrl(file) || "";
      return {
        id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 8)}`,
        title: file.name || `Upload-${idx + 1}`,
        type,
        status: "ok",
        file,
        url,
      };
    });

    setFormData((prev) => ({ ...prev, media: [...prev.media, ...items] }));
  };

  // Remove media item (and revoke object URL if created)
  const handleRemoveMedia = (id) => {
    setFormData((prev) => {
      const next = prev.media.filter((m) => {
        if (m.id === id && m.file) {
          // revoke object url if exists for that file
          const url = objectUrlRefs.current.get(m.file);
          if (url) {
            try {
              URL.revokeObjectURL(url);
            } catch (e) {}
            objectUrlRefs.current.delete(m.file);
          }
        }
        return m.id !== id;
      });
      return { ...prev, media: next };
    });
  };

  // Pick first media as image
  const pickFirstMediaAsImage = () =>
    setFormData((prev) => ({ ...prev, image: prev.media.length ? prev.media[0].url || "" : "" }));

  // Close modal and cleanup object URLs that belong to modal-only files
  const closeModal = () => {
    // Revoke any object URLs that belong to media files in the formData (the files are ephemeral)
    formData.media.forEach((m) => {
      if (m.file) {
        const url = objectUrlRefs.current.get(m.file);
        if (url) {
          try {
            URL.revokeObjectURL(url);
          } catch (e) {}
          objectUrlRefs.current.delete(m.file);
        }
      }
    });

    setEditingProduct(null);
  };

  // Render
  return (
    <div className="w-full px-2 sm:px-4 md:px-8 overflow-hidden max-w-full min-w-0">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-2 mb-4 mt-4 sm:mt-10 min-w-0 w-full max-w-full">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex-1 min-w-0 truncate pr-2">
          Our Products
        </h2>

        <button
          className="flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all text-sm flex-shrink-0 min-w-0"
          onClick={() => setEditingProduct({})}
          aria-label="Add product"
        >
          <FaPlus className="text-sm" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-full overflow-hidden min-w-0">
        {products.map((p) => (
          <article
            key={p.id}
            className="bg-white/80 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-xl p-3 border border-gray-200/60 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-200 relative min-w-0"
            aria-labelledby={`product-${p.id}`}
          >
            {/* Toggle visibility */}
            <button
              onClick={() => toggleProductVisibility(p.id)}
              className={`absolute bottom-2 right-2 p-2 rounded-full backdrop-blur-md border transition-all ${
                p.hidden
                  ? "bg-yellow-100 text-yellow-600 border-yellow-200"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
              aria-pressed={!!p.hidden}
              aria-label={p.hidden ? "Make visible" : "Hide product"}
            >
              {p.hidden ? <FaEyeSlash /> : <FaEye />}
            </button>

            {p.hidden && (
              <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-600 rounded border border-yellow-200">
                Hidden
              </div>
            )}

            {Array.isArray(p.tags) && p.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 min-w-0">
                {p.tags.map((tag, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 text-xs font-semibold bg-blue-500/10 text-blue-600 rounded border border-blue-200 truncate max-w-[80px]"
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
                loading="lazy"
              />
            ) : (
              <div className="w-full h-20 sm:h-32 rounded-lg mb-2 bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
                No image
              </div>
            )}

            <h3 id={`product-${p.id}`} className="font-semibold text-sm text-gray-900 truncate min-w-0">
              {p.name}
            </h3>
            <p className="text-xs text-gray-600 truncate min-w-0">Price: QAR {p.price}</p>
            <p className="text-xs text-gray-600 truncate min-w-0">Stock: {p.stock}</p>
            {p.category && <p className="text-xs text-gray-600 mt-1 truncate">Category: {p.category}</p>}

            <div className="mt-2 flex gap-2 min-w-0">
              <button
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm flex-1 justify-center min-w-0"
                onClick={() => setEditingProduct(p)}
                aria-label={`Edit ${p.name}`}
              >
                <FaEdit /> <span className="hidden xs:inline">Edit</span>
              </button>

              <button
                className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm flex-1 justify-center min-w-0"
                onClick={() => setProducts((prev) => prev.filter((prod) => prod.id !== p.id))}
                aria-label={`Delete ${p.name}`}
              >
                <FaTrash /> <span className="hidden xs:inline">Delete</span>
              </button>
            </div>
          </article>
        ))}

        {/* Add Card */}
        <div
          onClick={() => setEditingProduct({})}
          className="bg-white/80 backdrop-blur-lg shadow rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg border border-dashed border-gray-300 transition-all min-w-0"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setEditingProduct({});
          }}
        >
          <FaPlus className="text-2xl text-gray-400 mb-2" />
          <span className="text-gray-600 font-medium text-sm">Add Product</span>
        </div>
      </div>

      {/* Modal (editingProduct) */}
      {editingProduct && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start p-2 md:p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={formData.id ? "Edit product" : "Add product"}
        >
          <div
            className="bg-white/95 backdrop-blur-lg w-full max-w-full mx-2 sm:max-w-2xl md:max-w-3xl rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-gray-200/60 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-base sm:text-lg font-semibold truncate">
                {formData.id ? "Edit Product" : "Add Product"}
              </h2>

              <div className="flex items-center gap-2">
                {formData.id && (
                  <button
                    className="text-white bg-red-500/80 px-2 py-1 rounded-md text-sm"
                    onClick={handleDeleteProduct}
                  >
                    Delete
                  </button>
                )}
                <button
                  className="text-white text-xl w-8 h-8 flex items-center justify-center rounded-md bg-blue-600/80"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Upload */}
              <section className="bg-white/60 rounded-xl p-4 border">
                <h3 className="text-sm sm:text-lg font-semibold">Upload Images / Videos</h3>

                <label className="border-2 border-dashed p-4 rounded-xl flex flex-col items-center text-gray-500 cursor-pointer mt-3">
                  <FaUpload className="text-2xl mb-2" />
                  Upload from Files
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleMediaFiles(e.target.files)}
                    multiple
                    accept="image/*,video/*"
                  />
                </label>

                <div className="mt-4 space-y-2">
                  {formData.media.map((m) => (
                    <div
                      key={m.id}
                      className={`flex justify-between items-center p-3 rounded-lg border ${
                        m.status === "error" ? "bg-red-100/60 border-red-300" : "bg-blue-100/60 border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {m.type === "image" ? (
                          <img src={m.url} className="w-12 h-10 object-cover rounded-lg" alt={m.title} />
                        ) : (
                          <div className="w-12 h-10 flex items-center justify-center bg-gray-100 rounded-lg">VIDEO</div>
                        )}
                        <span className="truncate text-sm">{m.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className="text-gray-700 hover:text-blue-600 px-2 py-1 rounded"
                          onClick={() => setFormData((prev) => ({ ...prev, image: m.url }))}
                          title="Use as product image"
                        >
                          <FaCheck />
                        </button>

                        <button
                          className="text-gray-700 hover:text-red-600 px-2 py-1 rounded"
                          onClick={() => handleRemoveMedia(m.id)}
                          title="Remove media"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <button
                      className="px-3 py-2 rounded-lg bg-gray-100 border hover:bg-gray-200 transition-all"
                      onClick={pickFirstMediaAsImage}
                      disabled={formData.media.length === 0}
                    >
                      Use first as product image
                    </button>
                    <span className="text-xs text-gray-500 self-center">or click the upload area above</span>
                  </div>
                </div>
              </section>

              {/* Product Info */}
              <section className="bg-white/60 rounded-xl p-4 border">
                <h3 className="text-sm sm:text-lg font-semibold">Product Information</h3>

                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Product Title <span className="text-red-500">*</span></label>
                    <input
                      className="border p-2 rounded-lg w-full"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      aria-required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Product Price</label>
                      <input
                        className="border p-2 rounded-lg w-full"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-1">Stock Quantity</label>
                      <input
                        className="border p-2 rounded-lg w-full"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">Description</label>
                    <textarea
                      className="border p-2 rounded-lg w-full h-24"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
              </section>

              {/* Category */}
              <section className="bg-white/60 rounded-xl p-4 border">
                <h3 className="text-sm sm:text-lg font-semibold mb-3">Product Category</h3>

                <div className="border rounded-xl h-36 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {availableCategories.map((category) => (
                      <div
                        key={category}
                        className={`p-2 rounded-lg cursor-pointer ${formData.category === category ? "bg-blue-500/10 text-blue-600 border border-blue-200" : "bg-gray-50 hover:bg-gray-100"} break-words`}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>

                {formData.category && (
                  <div className="mt-3 p-2 bg-blue-500/10 border border-blue-200 rounded-lg">
                    Selected: <strong>{formData.category}</strong>
                  </div>
                )}
              </section>

              {/* Tags */}
              <section className="bg-white/60 rounded-xl p-4 border">
                <h3 className="text-sm sm:text-lg font-semibold">Tags</h3>

                <div className="mt-3 space-y-2">
                  {availableTags.map((tag) => (
                    <label key={tag} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>

                {formData.tags.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-500/10 border border-blue-200 rounded-lg">
                    Selected: {formData.tags.join(", ")}
                  </div>
                )}
              </section>

              {/* Visibility */}
              {formData.id && (
                <section className="bg-white/60 rounded-xl p-4 border">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3">Visibility</h3>

                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, hidden: !prev.hidden }))}
                    className={`px-3 py-2 rounded-lg text-white ${formData.hidden ? "bg-yellow-500" : "bg-green-500"}`}
                  >
                    {formData.hidden ? <FaEyeSlash className="inline mr-2" /> : <FaEye className="inline mr-2" />}
                    {formData.hidden ? " Hidden" : " Visible"}
                  </button>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t bg-gray-50">
              <span className="text-sm flex-1 text-center sm:text-left">Do you want to add this product on sale?</span>

              <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
                <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={closeModal}>Cancel</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={handleSave}>
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

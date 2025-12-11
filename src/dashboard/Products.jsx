import React, { useEffect, useMemo, useRef, useState } from "react";
import { addProduct, editProduct, getCompany, deleteProduct } from "../api";
import Cookies from "js-cookie";
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

// Define API_BASE_URL at the top of the file
const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

export default function Products({
  products = [],
  setProducts = () => {},
  editingProduct,
  companyId,
  setEditingProduct,
}) {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    description: "",
    tags: [],
    image: "",
    media: [],
    category_id: null,
    category_name: "",
    hidden: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const objectUrlRefs = useRef(new Map());

  // ✅ FIXED: Category mapping with IDs
  const categoryMap = {
    "Lights": "1",
    "Plumbing": "2", 
    "Swimming pool": "3",
    "carpentry": "4",
    "paints": "5",
    "Security System": "6",
    "Wallpaper": "7",
    "Gardening": "8",
    "Electric Gates": "9",
    "Marine Equipmemnt": "10",
    "Carpet Cleaning": "11",
    "Electrical Services": "12",
    "Water Tank": "13",
    "Upholstery": "14",
    "Air Conditioner": "15",
    "Doors & Windows": "16",
  };

  // ✅ FIXED: Updated categories with IDs
  const availableCategories = useMemo(
    () => [
      { id: "1", name: "Lights" },
      { id: "2", name: "Plumbing" },
      { id: "3", name: "Swimming pool" },
      { id: "4", name: "carpentry" },
      { id: "5", name: "paints" },
      { id: "6", name: "Security System" },
      { id: "7", name: "Wallpaper" },
      { id: "8", name: "Gardening" },
      { id: "9", name: "Electric Gates" },
      { id: "10", name: "Marine Equipmemnt" },
      { id: "11", name: "Carpet Cleaning" },
      { id: "12", name: "Electrical Services" },
      { id: "13", name: "Water Tank" },
      { id: "14", name: "Upholstery" },
      { id: "15", name: "Air Conditioner" },
      { id: "16", name: "Doors & Windows" },
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

  // ✅ Helper function to get category ID by name
  const getCategoryIdByName = (categoryName) => {
    return categoryMap[categoryName] || null;
  };

  // Function to refresh company data and notify other components
  const refreshCompanyData = async () => {
    if (!companyId) return;
    
    try {
      console.log("🔄 Refreshing company data...");
      const companyRes = await getCompany(companyId);
      
      const companyData = 
        companyRes?.data?.data?.company ||
        companyRes?.data?.company ||
        companyRes?.data;
      
      if (companyData && Array.isArray(companyData.products)) {
        // Update local state
        setProducts(companyData.products);
        console.log("✅ Products refreshed:", companyData.products.length);
        
        // Dispatch event to notify CompanyPage and ProductProfile
        window.dispatchEvent(new CustomEvent('productsUpdated', {
          detail: { 
            companyId, 
            products: companyData.products,
            timestamp: Date.now()
          }
        }));
        
        return companyData.products;
      }
    } catch (error) {
      console.error("❌ Failed to refresh company data:", error);
    }
    return null;
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (!companyId || !productId) {
      alert("Missing company ID or product ID!");
      return;
    }
    
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?\n\n" +
      "This action cannot be undone and will permanently remove the product from your catalogue."
    );
    
    if (!confirmDelete) return;
    
    setIsSubmitting(true);
    
    try {
      console.log(`🗑️ Deleting product ${productId} from company ${companyId}...`);
      
      // Call API to delete from server
      await deleteProduct(companyId, productId);
      
      // Update local state
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      
      // Close modal if this product was being edited
      if (editingProduct && editingProduct.id === productId) {
        setEditingProduct(null);
      }
      
      // Refresh company data
      await refreshCompanyData();
      
      alert("✅ Product deleted successfully!");
      
    } catch (err) {
      console.error("❌ Delete failed:", err);
      
      if (err.response?.status === 404) {
        alert("Product not found. It may have already been deleted.");
      } else {
        alert(
          err.response?.data?.message ||
          "Failed to delete product. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!editingProduct) {
      setFormData({
        id: null,
        name: "",
        price: "",
        stock: "",
        description: "",
        tags: [],
        image: "",
        media: [],
        category_id: null,
        category_name: "",
        hidden: false,
      });
      return;
    }

    setFormData({
      id: editingProduct.id ?? null,
      name: editingProduct.name ?? "",
      price: editingProduct.price ?? "",
      stock: editingProduct.stock ?? "",
      description: editingProduct.description ?? "",
      tags: Array.isArray(editingProduct.tags) ? [...editingProduct.tags] : [],
      image: editingProduct.image ?? "",
      media: Array.isArray(editingProduct.media)
        ? editingProduct.media.map((m, idx) => ({
            id: m.id ?? `m-${Date.now()}-${idx}`,
            title: m.title ?? m.name ?? `Media ${idx + 1}`,
            type: m.type ?? "image",
            status: "ok",
            file: m.file ?? null,
            url: m.url ?? m.preview ?? m,
            isExisting: !m.file, // ✅ ADDED: Flag to identify existing vs new media
          }))
        : [],
      category_id: editingProduct.category_id ?? null,
      category_name: editingProduct.category_name ?? "",
      hidden: !!editingProduct.hidden,
    });
  }, [editingProduct]);

  useEffect(() => {
    return () => {
      for (const url of objectUrlRefs.current.values()) {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }
      objectUrlRefs.current.clear();
    };
  }, []);

  const createPreviewUrl = (file) => {
    if (!file) return null;
    try {
      const url = URL.createObjectURL(file);
      objectUrlRefs.current.set(file, url);
      return url;
    } catch {
      return null;
    }
  };

  const handleMediaFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const items = Array.from(fileList).map((file, idx) => {
      const type = file.type.startsWith("video") ? "video" : "image";
      const url = createPreviewUrl(file);

      return {
        id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 8)}`,
        title: file.name,
        type,
        status: "ok",
        file,
        url,
        isExisting: false, // ✅ ADDED: New file
      };
    });

    setFormData((prev) => ({ ...prev, media: [...prev.media, ...items] }));
  };

  const handleRemoveMedia = (id) => {
    setFormData((prev) => {
      const next = prev.media.filter((m) => {
        if (m.id === id && m.file) {
          const url = objectUrlRefs.current.get(m.file);
          if (url) {
            try {
              URL.revokeObjectURL(url);
            } catch {}
            objectUrlRefs.current.delete(m.file);
          }
        }
        return m.id !== id;
      });

      return { ...prev, media: next };
    });
  };

  const pickFirstMediaAsImage = () =>
    setFormData((prev) => ({
      ...prev,
      image: prev.media.length ? prev.media[0].url : "",
    }));

  const closeModal = () => {
    formData.media.forEach((m) => {
      if (m.file) {
        const url = objectUrlRefs.current.get(m.file);
        if (url) {
          try {
            URL.revokeObjectURL(url);
          } catch {}
          objectUrlRefs.current.delete(m.file);
        }
      }
    });

    setEditingProduct(null);
    setIsSubmitting(false);
  };

  const toggleProductVisibility = (productId) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, hidden: !p.hidden } : p))
    );

  // ✅ FIXED: Improved getImageUrl function to handle JSON objects and construct proper URLs
  const getImageUrl = (path) => {
    if (!path) return "";
    
    console.log("🖼️ getImageUrl called with:", path, "type:", typeof path);
    
    // If path is a JSON object (like {"webp":"products/...", "avif":"products/..."})
    if (typeof path === 'object' && path !== null) {
      console.log("📦 Path is an object, extracting image path...");
      // Try to get webp first, then avif, then any first property
      const imagePath = path.webp || path.avif || path[Object.keys(path)[0]];
      if (!imagePath) {
        console.log("❌ No valid image path found in object");
        return "";
      }
      console.log("✅ Extracted image path from object:", imagePath);
      path = imagePath;
    }
    
    // If it's already a full URL
    if (path.startsWith("http")) {
      console.log("✅ Already a full URL:", path);
      return path;
    }
    
    // Construct the full URL
    const lang = Cookies.get("lang") || "en";
    let fullUrl = "";
    
    if (path.startsWith("/storage")) {
      fullUrl = `${API_BASE_URL}${path}`;
    } else if (path.startsWith("/")) {
      fullUrl = `${API_BASE_URL}/${lang}${path}`;
    } else if (path.startsWith("products/") || path.startsWith("storage/")) {
      fullUrl = `${API_BASE_URL}/${lang}/storage/${path}`;
    } else {
      fullUrl = `${API_BASE_URL}/${lang}/storage/${path}`;
    }
    
    console.log("🔗 Constructed URL:", fullUrl);
    return fullUrl;
  };

  // ✅ FIXED: Improved product image extraction logic to handle JSON objects
  const getProductImage = (product) => {
    console.log("🔍 Getting image for product:", product.name);
    console.log("📦 Product image data:", product.image);
    console.log("🎞️ Product albums:", product.albums);
    
    // First, check if product.image is a JSON object
    if (product.image && typeof product.image === 'object') {
      console.log("🎯 Image is an object, extracting path...");
      // Extract webp or avif path from the object
      const imagePath = product.image.webp || product.image.avif;
      if (imagePath) {
        console.log("✅ Extracted image path from object:", imagePath);
        return imagePath;
      }
    }
    
    // If product.image is a string, use it
    if (typeof product.image === 'string' && product.image.trim() !== "") {
      console.log("✅ Using string image:", product.image);
      return product.image;
    }
    
    // Fallback to albums array
    if (Array.isArray(product.albums) && product.albums.length > 0) {
      console.log("🔄 Falling back to albums...");
      // Check first album
      const firstAlbum = product.albums[0];
      
      // If first album is an object with webp/avif
      if (firstAlbum && typeof firstAlbum === 'object') {
        const albumPath = firstAlbum.webp || firstAlbum.avif || firstAlbum.url || firstAlbum.image || firstAlbum.path;
        if (albumPath) {
          console.log("✅ Using album path:", albumPath);
          return albumPath;
        }
      }
      
      // If first album is a string
      if (typeof firstAlbum === 'string' && firstAlbum.trim() !== "") {
        console.log("✅ Using album string:", firstAlbum);
        return firstAlbum;
      }
    }
    
    console.log("❌ No image found for product");
    return "";
  };

  // ✅ FIXED: handleSave function with correct FormData format
  const handleSave = async (e) => {
    // Prevent accidental form submit
    if (e?.preventDefault) e.preventDefault();

    if (!formData.name.trim()) {
      alert("Product name is required!");
      return;
    }

    if (!companyId) {
      alert("Company ID is missing.");
      return;
    }

    if (!formData.category_name) {
      alert("Please select a category!");
      return;
    }

    const categoryId = getCategoryIdByName(formData.category_name);
    if (!categoryId) {
      alert("Invalid category selected!");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // =============================
      // REQUIRED FIELDS
      // =============================
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", Number(formData.price) || 0);
      formDataToSend.append("quantity", Number(formData.stock) || 0);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("category_id", categoryId);
      formDataToSend.append("hidden", formData.hidden ? "1" : "0");

      // =============================
      // ✅ FIXED: Append tags as array special_mark[]
      // =============================
      if (formData.tags.length > 0) {
        formData.tags.forEach((tag) => {
          formDataToSend.append("special_mark[]", tag);
        });
      }

      // =============================
      // IMAGE HANDLING - FIXED
      // =============================
      // Get all image media
      const imageMedia = formData.media.filter((m) => m.type === "image");
      
      if (imageMedia.length === 0) {
        alert("Please upload at least one product image!");
        setIsSubmitting(false);
        return;
      }

      // =============================
      // ✅ FIXED: Append images as array albums[]
      // Remove separate "image" field as backend only needs albums[]
      // =============================
      imageMedia.forEach((media) => {
        if (media.file) {
          // New file upload
          formDataToSend.append("albums[]", media.file);
        } else if (media.url && media.isExisting) {
          // Existing media - send as string URL
          formDataToSend.append("albums[]", media.url);
        }
      });

      // =============================
      // DEBUG LOG
      // =============================
      console.log("📤 FormData being sent:");
      console.log("Company ID:", companyId);
      console.log("Product ID (for edit):", formData.id);
      console.log("Category:", formData.category_name, "(ID:", categoryId + ")");
      console.log("Tags:", formData.tags);
      console.log("Image media count:", imageMedia.length);

      // Log all FormData entries to verify format
      const sentFields = [];
      for (let [key, value] of formDataToSend.entries()) {
        sentFields.push(key);
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }
      console.log("All fields:", sentFields.join(", "));

      // =============================
      // API CALL
      // =============================
      let response;

      if (formData.id) {
        console.log("🔄 Editing existing product...");
        response = await editProduct(companyId, formData.id, formDataToSend);
        alert("✅ Product updated successfully!");
      } else {
        console.log("➕ Adding new product...");
        response = await addProduct(companyId, formDataToSend);
        alert("✅ Product added successfully!");
      }

      console.log("📥 API Response:", response?.data);

      // =============================
      // REFRESH DATA
      // =============================
      await refreshCompanyData();
      
      // Close modal
      setEditingProduct(null);
      
    } catch (err) {
      console.error("❌ Save failed:", err);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      // Show detailed error message
      if (err.response?.status === 422) {
        const errors = err.response.data?.errors;
        if (errors) {
          // Format error messages nicely
          const errorMessages = [];
          for (const [field, messages] of Object.entries(errors)) {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            }
          }
          
          if (errorMessages.length > 0) {
            alert(`Validation Errors:\n\n${errorMessages.join('\n')}\n\nPlease check your data.`);
          } else {
            alert("Validation error occurred. Please check all fields.");
          }
        } else {
          alert("Validation error. The server rejected the data format.");
        }
      } else if (err.response?.status === 500) {
        const message = err.response?.data?.message || "Unknown server error";
        
        if (message.includes('foreach') && message.includes('special_mark')) {
          alert(
            "Server Error: Tags format is incorrect.\n\n" +
            "The backend expects tags as an array but received a string.\n" +
            "Please contact backend developer to fix the special_mark parameter handling."
          );
        } else {
          alert(
            "Server error: " + message + "\n\n" +
            "Please contact backend developer."
          );
        }
      } else {
        alert(
          err.response?.data?.message ||
          "Failed to save product. Check console for details."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-8 overflow-hidden max-w-full min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 mt-4 sm:mt-10 min-w-0 w-full max-w-full">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex-1 min-w-0 truncate">
          Our Products ({products.length})
        </h2>

        <div className="flex items-center gap-2">
          {/* ✅ Refresh Button */}
          <button
            type="button"
            onClick={refreshCompanyData}
            className="flex items-center justify-center gap-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-all text-sm flex-shrink-0"
            title="Refresh products"
            disabled={isSubmitting}
          >
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">↻</span>
          </button>

          {/* ✅ Add Product Button */}
          <button
            type="button"
            className="flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg hover:scale-105 transition-all text-sm flex-shrink-0"
            onClick={() => setEditingProduct({})}
            disabled={isSubmitting}
          >
            <FaPlus className="text-sm" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* FIXED GRID (no scroll on iPhone SE) */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-full min-w-0">
        {products.map((p) => {
          const productImage = getProductImage(p);
          const imageUrl = productImage ? getImageUrl(productImage) : "";
          
          console.log(`🎯 Product: ${p.name}`);
          console.log(`   Raw image: ${JSON.stringify(p.image)}`);
          console.log(`   Processed image: ${productImage}`);
          console.log(`   Image URL: ${imageUrl}`);
          
          return (
            <article
              key={p.id}
              className="bg-white/80 backdrop-blur-lg shadow rounded-xl p-3 border border-gray-200/60 hover:shadow-lg transition-all relative min-w-0"
            >
              {/* Visibility toggle */}
              <button
                onClick={() => toggleProductVisibility(p.id)}
                className={`absolute bottom-2 right-2 p-2 rounded-full border ${
                  p.hidden
                    ? "bg-yellow-100 text-yellow-600 border-yellow-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
                disabled={isSubmitting}
              >
                {p.hidden ? <FaEyeSlash /> : <FaEye />}
              </button>

              {p.hidden && (
                <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-600 rounded border border-yellow-200">
                  Hidden
                </div>
              )}

              {p.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2 min-w-0">
                  {p.tags.map((tag, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 text-xs font-semibold bg-blue-500/10 text-blue-600 rounded border border-blue-200 truncate max-w-full sm:max-w-[80px]"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}

              {productImage ? (
                <img
                  src={imageUrl}
                  className="w-full h-20 sm:h-32 object-cover rounded-lg mb-2 border border-gray-200/60"
                  alt={p.name}
                  onError={(e) => {
                    console.error(`❌ Image failed to load for ${p.name}:`, imageUrl);
                    console.error("   Original image data:", p.image);
                    e.currentTarget.src = "/no-image.png";
                    e.currentTarget.onerror = null; // Prevent infinite loop
                  }}
                  onLoad={() => console.log(`✅ Image loaded for ${p.name}:`, imageUrl)}
                />
              ) : (
                <div className="w-full h-20 sm:h-32 rounded-lg mb-2 bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
                  No image
                </div>
              )}

              <h3 className="font-semibold text-sm text-gray-900 truncate">
                {p.name}
              </h3>
              <p className="text-xs text-gray-600 truncate">Price: QAR {p.price}</p>
              <p className="text-xs text-gray-600 truncate">Stock: {p.stock}</p>
              {p.category_name && (
                <p className="text-xs text-gray-600 mt-1 truncate">
                  Category: {p.category_name}
                </p>
              )}

              <div className="mt-2 flex gap-2">
                <button
                  className="flex items-center gap-1 text-blue-600 text-sm flex-1 justify-center"
                  onClick={() => setEditingProduct(p)}
                  disabled={isSubmitting}
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  className="flex items-center gap-1 text-red-600 text-sm flex-1 justify-center hover:text-red-800"
                  onClick={() => handleDeleteProduct(p.id)}
                  disabled={isSubmitting}
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </article>
          );
        })}

        {/* Add Card */}
        <div
          onClick={() => !isSubmitting && setEditingProduct({})}
          className={`bg-white/80 backdrop-blur-lg shadow rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg border border-dashed border-gray-300 transition-all min-w-0 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FaPlus className="text-2xl text-gray-400 mb-2" />
          <span className="text-gray-600 font-medium text-sm">Add Product</span>
        </div>
      </div>

      {/* MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start p-2 md:p-4 z-50">
          {/* ✅ CHANGED: Changed from div to form with onSubmit */}
          <form
            className="bg-white/95 backdrop-blur-lg w-full max-w-[100vw] mx-1 sm:mx-2 sm:max-w-2xl md:max-w-3xl rounded-xl shadow-xl border border-gray-200/60 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSave}
          >
            {/* Header */}
            <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center sticky top-0">
              <h2 className="text-base sm:text-lg font-semibold truncate">
                {formData.id ? "Edit Product" : "Add Product"}
              </h2>

              <div className="flex items-center gap-2">
                {formData.id && (
                  <button
                    type="button"
                    className="text-white bg-red-500/80 px-2 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
                    onClick={() => handleDeleteProduct(formData.id)}
                    disabled={isSubmitting}
                  >
                    Delete Product
                  </button>
                )}

                <button
                  type="button"
                  className="text-white text-xl w-8 h-8 flex items-center justify-center rounded-md bg-blue-600/80"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* MEDIA UPLOADS */}
              <section className="bg-white/60 rounded-xl p-4 border">
                <h3 className="text-sm sm:text-lg font-semibold">
                  Upload Images / Videos
                </h3>

                <label className={`border-2 border-dashed p-4 rounded-xl flex flex-col items-center cursor-pointer mt-3 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'text-gray-500'
                }`}>
                  <FaUpload className="text-2xl mb-2" />
                  Upload from Files
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => !isSubmitting && handleMediaFiles(e.target.files)}
                    multiple
                    accept="image/*,video/*"
                    disabled={isSubmitting}
                  />
                </label>

                <div className="mt-4 space-y-2">
                  {formData.media.map((m) => (
                    <div
                      key={m.id}
                      className={`flex justify-between items-center p-3 rounded-lg border ${
                        m.status === "error"
                          ? "bg-red-100/60 border-red-300"
                          : "bg-blue-100/60 border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {m.type === "image" ? (
                          <img
                            src={m.url}
                            className="w-12 h-10 object-cover rounded-lg"
                            alt={m.title}
                          />
                        ) : (
                          <div className="w-12 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                            VIDEO
                          </div>
                        )}
                        <span className="truncate text-sm">{m.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-gray-700 hover:text-blue-600 px-2 py-1 rounded"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              image: m.url,
                            }))
                          }
                          disabled={isSubmitting}
                        >
                          <FaCheck />
                        </button>

                        <button
                          type="button"
                          className="text-gray-700 hover:text-red-600 px-2 py-1 rounded"
                          onClick={() => handleRemoveMedia(m.id)}
                          disabled={isSubmitting}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-2 rounded-lg bg-gray-100 border hover:bg-gray-200 transition-all"
                      onClick={pickFirstMediaAsImage}
                      disabled={formData.media.length === 0 || isSubmitting}
                    >
                      Use first as product image
                    </button>

                    <span className="text-xs text-gray-500 self-center">
                      or click the upload area above
                    </span>
                  </div>
                </div>
              </section>

              {/* PRODUCT INFO */}
              <section className="bg-white/60 rounded-xl p-4 border">
                <h3 className="text-sm sm:text-lg font-semibold">
                  Product Information
                </h3>

                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Product Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="border p-2 rounded-lg w-full"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      aria-required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Product Price
                      </label>
                      <input
                        className="border p-2 rounded-lg w-full"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Stock Quantity
                      </label>
                      <input
                        className="border p-2 rounded-lg w-full"
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            stock: e.target.value,
                          }))
                        }
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Description
                    </label>
                    <textarea
                      className="border p-2 rounded-lg w-full h-24"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </section>

              {/* CATEGORY */}
              <section className="bg-white/60 rounded-xl p-4 border">
                <h3 className="text-sm sm:text-lg font-semibold mb-3">
                  Product Category
                </h3>

                <div className="border rounded-xl h-36 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {availableCategories.map((category) => (
                      <div
                        key={category.id}
                        className={`p-2 rounded-lg cursor-pointer ${
                          formData.category_name === category.name
                            ? "bg-blue-500/10 text-blue-600 border border-blue-200"
                            : "bg-gray-50 hover:bg-gray-100"
                        } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => !isSubmitting && setFormData((prev) => ({
                          ...prev,
                          category_id: category.id, // ✅ Store ID
                          category_name: category.name, // ✅ Store name for display
                        }))}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                </div>

                {formData.category_name && (
                  <div className="mt-3 p-2 bg-blue-500/10 border border-blue-200 rounded-lg">
                    Selected: <strong>{formData.category_name}</strong>
                    <div className="text-xs text-gray-500 mt-1">
                      (ID: {formData.category_id})
                    </div>
                  </div>
                )}
              </section>

              {/* TAGS */}
              <section className="bg-white/60 rounded-xl p-4 border">
                <h3 className="text-sm sm:text-lg font-semibold">Tags</h3>

                <div className="mt-3 space-y-2">
                  {availableTags.map((tag) => (
                    <label
                      key={tag}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                        isSubmitting ? 'cursor-not-allowed opacity-50' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag)}
                        onChange={() => !isSubmitting && setFormData((prev) => ({
                          ...prev,
                          tags: prev.tags.includes(tag)
                            ? prev.tags.filter((t) => t !== tag)
                            : [...prev.tags, tag],
                        }))}
                        disabled={isSubmitting}
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

              {/* VISIBILITY */}
              {formData.id && (
                <section className="bg-white/60 rounded-xl p-4 border">
                  <h3 className="text-sm sm:text-lg font-semibold mb-3">
                    Visibility
                  </h3>

                  <button
                    type="button"
                    onClick={() => !isSubmitting && setFormData((prev) => ({
                      ...prev,
                      hidden: !prev.hidden,
                    }))}
                    className={`px-3 py-2 rounded-lg text-white ${
                      formData.hidden ? "bg-yellow-500" : "bg-green-500"
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {formData.hidden ? (
                      <>
                        <FaEyeSlash className="inline mr-2" /> Hidden
                      </>
                    ) : (
                      <>
                        <FaEye className="inline mr-2" /> Visible
                      </>
                    )}
                  </button>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t bg-gray-50">
              <span className="text-sm flex-1 text-center sm:text-left">
                Do you want to add this product on sale?
              </span>

              <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                {/* ✅ CHANGED: Changed from onClick to type="submit" */}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {formData.id ? "Updating..." : "Adding..."}
                    </span>
                  ) : formData.id ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
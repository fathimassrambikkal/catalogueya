
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaPlus,
  
  FaCheck,
  FaTimes,
  
  FaEye,
  FaEyeSlash,
 
} from "react-icons/fa";
import { showToast } from "../utils/showToast";
import {
  getCompanyProducts,
  addProduct,
  editProduct,
  deleteProduct,
  changeProductStatus,
  getSpecialMarks,
  getImageUrl,
  getContacts,
  getCategories
} from "../companyDashboardApi";
import SendNotificationModal from "./SendNotificationModal";
import NotificationHistoryModal from "./NotificationHistoryModal";
import { useTranslation } from "react-i18next";
import { useFixedWords } from "../hooks/useFixedWords";

export default function Products({
  companyId,
  companyInfo = {},
}) {
  const [products, setProducts] = useState([]);
  // ... rest of state stays same ...
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [availableTags, setAvailableTags] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [contacts, setContacts] = useState([]);
const [deleteProductId, setDeleteProductId] = useState(null);
  const [productType, setProductType] = useState("product"); // 'product' | 'service'

const { i18n } = useTranslation();
const isRTL = i18n.dir() === "rtl";
const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};
  const [formData, setFormData] = useState({
    id: null,
    type: "product", // 'product' | 'service'
    name: "",
    name_ar: "",
    price: "",
    quantity: "",
    description: "",
    description_ar: "",
    tags: [], // special_mark[] IDs
    existingTags: [],
    media: [], // albums[] files
    category_ids: [],
    status: "active",
  });

  const objectUrlRefs = useRef(new Map());

  const [categories, setCategories] = useState([]);

  // Fetch Products, Tags, Categories and Contacts
  useEffect(() => {
    fetchData();
    fetchTags();
    fetchContacts();
    fetchCategories();
  }, [productType]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.data?.data) {
        setCategories(res.data.data);
      } else if (Array.isArray(res.data)) {
        setCategories(res.data);
      }
    } catch (e) {
      console.error("Error fetching categories", e);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await getContacts();
      if (res.data?.data) {
        setContacts(res.data.data);
      } else if (Array.isArray(res.data)) {
        setContacts(res.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getCompanyProducts(productType === "service" ? "service" : null);
      // response: { data: { products: [...] }, message: "..." }
      if (res.data?.data) {
        setProducts(Array.isArray(res.data.data) ? res.data.data : (res.data.data.products || []));
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await getSpecialMarks();
      // response structure expected to be list of tags with id/name

      const shouldFilter = (tag) => {
        const name = tag.name?.toLowerCase() || "";
        return !name.includes('sale') &&
          !name.includes('limited stock') &&
          !name.includes('out of stock') &&
          !name.includes('out in stock');
      };

      if (res.data?.data) {
        const filtered = res.data.data.filter(shouldFilter);
        setAvailableTags(filtered);
      } else if (Array.isArray(res.data)) {
        const filtered = res.data.filter(shouldFilter);
        setAvailableTags(filtered);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Setup form when editing
  useEffect(() => {
    if (!editingProduct) {
      setFormData({
        id: null,
        type: "product",
        name: "",
        name_ar: "",
        price: "",
        quantity: "",
        description: "",
        description_ar: "",
        tags: [],
        image: null,
        media: [],
        category_ids: [],
        status: "active",
      });
      return;
    }

    // Populate form
    let parsedTags = [];
    if (editingProduct.special_marks) {
      try {
        const rawTags = typeof editingProduct.special_marks === 'string'
          ? JSON.parse(editingProduct.special_marks)
          : editingProduct.special_marks;

        if (Array.isArray(rawTags)) {
          parsedTags = rawTags.map(t => (typeof t === 'object' && t !== null) ? String(t.id) : String(t));
        }
      } catch (e) {
        console.error("Error parsing tags", e);
      }
    }

    // Parse image
    let displayImage = "";
    try {
      if (editingProduct.image && typeof editingProduct.image === 'string') {
        const imgObj = JSON.parse(editingProduct.image);
        displayImage = imgObj.webp || imgObj.avif || "";
      } else if (typeof editingProduct.image === 'object') {
        displayImage = editingProduct.image?.webp || "";
      }
    } catch (e) { }

    // Parse albums
    let displayAlbum = [];
    try {
      const albumsData = editingProduct.albums;
      if (albumsData) {
        const albumArr = typeof albumsData === 'string' ? JSON.parse(albumsData) : albumsData;
        if (Array.isArray(albumArr)) {
          displayAlbum = albumArr.map(a => ({
            url: getImageUrl(a.webp || a.avif || a),
            isExisting: true
          }));
        }
      }
    } catch (e) { console.error("Error parsing albums", e); }

    // Unified display: Show main image as the first item in existing media if it exists
    const fullMediaList = [];
    if (displayImage) {
      fullMediaList.push({
        id: 'main',
        url: getImageUrl(displayImage),
        isExisting: true,
        isMain: true
      });
    }

    // Then add other album images
    displayAlbum.forEach((a, idx) => {
      // Don't duplicate if displayImage is already the first album item
      if (a.url !== getImageUrl(displayImage)) {
        fullMediaList.push({ ...a, id: `ext-${idx}` });
      }
    });

    setFormData({
      id: editingProduct.id,
      type: editingProduct.type || "product",
      name: editingProduct.name_en || editingProduct.name || "",
      name_ar: editingProduct.name_ar || "",
      price: editingProduct.price || "",
      quantity: editingProduct.quantity || "",
      description: editingProduct.description_en || editingProduct.description || "",
      description_ar: editingProduct.description_ar || "",
      tags: parsedTags || [],
      media: [], // New files
      existingMedia: fullMediaList, // Existing files urls
      category_ids: editingProduct.categories?.map(c => String(c.id)) || (editingProduct.category_id ? [String(editingProduct.category_id)] : []),
      status: editingProduct.status || "active",
    });
  }, [editingProduct]);

  useEffect(() => {
    return () => {
      for (const url of objectUrlRefs.current.values()) {
        try {
          URL.revokeObjectURL(url);
        } catch { }
      }
      objectUrlRefs.current.clear();
    };
  }, []);

  const createPreviewUrl = (file) => {
    if (!file || !(file instanceof Blob || file instanceof File)) return null;
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
      const url = createPreviewUrl(file);
      return {
        id: `${Date.now()}-${idx}`,
        file,
        url,
        isNew: true
      };
    });

    setFormData((prev) => ({ ...prev, media: [...prev.media, ...items] }));
  };

  const handleRemoveMedia = (id, isExisting) => {
    if (isExisting) {
      setFormData(prev => ({
        ...prev,
        existingMedia: prev.existingMedia.filter(m => m.id !== id)
      }));
      return;
    }

    setFormData((prev) => {
      const next = prev.media.filter((m) => {
        if (m.id === id && m.file) {
          const url = objectUrlRefs.current.get(m.file);
          if (url) {
            try {
              URL.revokeObjectURL(url);
            } catch { }
            objectUrlRefs.current.delete(m.file);
          }
        }
        return m.id !== id;
      });
      return { ...prev, media: next };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        previewImage: createPreviewUrl(file)
      }));
    }
  };

  const closeModal = () => {
    // Cleanup blobs
    formData.media.forEach((m) => {
      if (m.file) {
        const url = objectUrlRefs.current.get(m.file);
        if (url) URL.revokeObjectURL(url);
      }
    });
    setEditingProduct(null);
  };

  const toggleProductVisibility = async (productId) => {
    try {
      await changeProductStatus(productId);
      fetchData();
    } catch (error) {
      console.error("Error toggling status", error);
      alert("Failed to change status");
    }
  };

  const handleDelete = async () => {
  if (!deleteProductId) return;

  try {
    await deleteProduct(deleteProductId);
    setProducts(prev => prev.filter(p => p.id !== deleteProductId));
    setDeleteProductId(null);
    showToast("Product deleted successfully", { type: "success" });
  } catch (error) {
    console.error("Error deleting product", error);
    showToast("Failed to delete product", { type: "error" });
  }
};

  const handleSave = async () => {
    if (isSubmitting) return;

    const isService = formData.type === "service";
    const requiresQty = !isService;

    if (!formData.name.trim() || !formData.price || (requiresQty && !formData.quantity) || formData.category_ids.length === 0) {
      showToast(fw.required_fields || "Please fill required fields", { type: 'error' });
      return;
    }

    if (formData.media.length === 0 && (!formData.existingMedia || formData.existingMedia.length === 0)) {
      showToast("Please upload at least one image", { type: 'error' });
      return;
    }

    const payload = new FormData();
    const isEdit = !!formData.id;

    // ALWAYS include required fields
    payload.append("name", formData.name);
    payload.append("price", formData.price);
    payload.append("type", formData.type);
    if (!isService) {
      payload.append("quantity", formData.quantity);
    }
    if (formData.category_ids.length > 0) {
      payload.append("category_id", formData.category_ids[0]);
    }

    if (isEdit) {
      // Send optional fields ONLY if changed
      if (formData.name_ar !== (editingProduct.name_ar || "")) {
        payload.append("name_ar", formData.name_ar);
      }

      const oldDesc = editingProduct.description_en || editingProduct.description || "";
      if (formData.description !== oldDesc) {
        payload.append("description", formData.description);
      }

      if (formData.description_ar !== (editingProduct.description_ar || "")) {
        payload.append("description_ar", formData.description_ar);
      }

      // Tags comparison
      const oldTags = typeof editingProduct.special_marks === 'string' ? JSON.parse(editingProduct.special_marks) : (editingProduct.special_marks || []);
      const tagsChanged = JSON.stringify([...formData.tags].sort()) !== JSON.stringify([...oldTags].map(String).sort());

      if (tagsChanged) {
        formData.tags.forEach(tagId => payload.append("special_mark[]", tagId));
      }

      // New Albums
      if (formData.media.length > 0) {
        formData.media.forEach((m) => {
          if (m.file) payload.append("albums[]", m.file);
        });
      }
    } else {
      // ADD MODE: Send everything
      if (formData.name_ar) payload.append("name_ar", formData.name_ar);
      if (formData.description) payload.append("description", formData.description);
      if (formData.description_ar) payload.append("description_ar", formData.description_ar);

      if (!isService) {
        formData.tags.forEach(tagId => payload.append("special_mark[]", tagId));
      }

      formData.media.forEach((m) => {
        if (m.file) payload.append("albums[]", m.file);
      });
    }

    try {
      setIsSubmitting(true);
      if (formData.id) {
        await editProduct(formData.id, payload);
      } else {
        await addProduct(payload);
      }
      closeModal();
      showToast(formData.id ? "Product updated successfully" : "Product added successfully", { type: 'success' });
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error saving product", error);

      // Extract backend validation errors
      const errorData = error.response?.data?.errors;
      if (errorData) {
        const firstKey = Object.keys(errorData)[0];
        const message = errorData[firstKey][0];
        showToast(`${firstKey}: ${message}`, { type: 'error' });
      } else {
        showToast("Failed to save product. Please try again.", { type: 'error' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== NEW: View Mode State ===== */
  const [viewMode, setViewMode] = useState("all"); // 'all' or 'tags'

  const getProductImage = (p) => {
    if (!p.image) return null;
    try {
      let path = "";
      if (typeof p.image === 'string') {
        const imgObj = JSON.parse(p.image);
        path = imgObj.webp || imgObj.avif || p.image;
      } else if (typeof p.image === 'object') {
        path = p.image.webp || p.image.avif || "";
      }
      return getImageUrl(path);
    } catch (e) {
      return getImageUrl(p.image);
    }
  }

  // Helper to check if a product has a specific tag ID
  const productHasTag = (product, tagId) => {
    try {
      if (!product.special_marks) return false;
      const marks = typeof product.special_marks === 'string'
        ? JSON.parse(product.special_marks)
        : product.special_marks;

      if (!Array.isArray(marks)) return false;

      return marks.some(m => {
        if (typeof m === 'object') return String(m.id) === String(tagId);
        return String(m) === String(tagId);
      });
    } catch (e) { return false; }
  };

  // Render Single Product Card
  const renderProductCard = (p) => {
    const isHidden = p.status === 'inactive' || p.status === 'hidden' || p.status === '0' || p.status === 0;
    const imgSrc = getProductImage(p);

  let tags = [];

try {
  if (p.special_marks) {
    const tagIds =
      typeof p.special_marks === "string"
        ? JSON.parse(p.special_marks)
        : p.special_marks;

    if (Array.isArray(tagIds)) {
      tags = tagIds
        .map((tid) => {
          let name = "";

          // If API sends object
          if (typeof tid === "object" && tid !== null) {
            name = tid.name || tid.name_en || tid.title || "";
          } 
          // If API sends id
          else {
            const foundTag = availableTags.find(
              (t) => String(t.id) === String(tid)
            );
            name = foundTag?.name || "";
          }

          if (!name) return null;

          // convert to fixed_words key format
          const key = name.toLowerCase().replace(/\s+/g, "_");

          // ONLY show if exists in fixed_words
          if (fw[key]) {
            return fw[key];
          }

          return null;
        })
        .filter(Boolean);
    }
  }
} catch (e) {
  console.error("Tag parsing error:", e);
}

   return (
  <article
    key={p.id}
    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all flex flex-col h-full"
  >
    {/* Image Section - 2/3 of card */}
    <div className="relative w-full aspect-[4/3] bg-gray-50 flex-shrink-0 overflow-hidden">
      {imgSrc ? (
        <img
          src={imgSrc}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={isRTL ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-200 text-xs">
          {fw.no_image || "No image"}
        </div>
      )}

      {/* Minimal Status Tags */}
      <div className="absolute top-2 left-2 flex flex-wrap gap-1 items-center pointer-events-none">
        {tags.map((tag, i) => (
          <span key={i} className="px-1.5 py-0.5 text-[8px] font-medium bg-white/80 backdrop-blur-sm text-gray-700 rounded-full border border-gray-200/50">
            {tag}
          </span>
        ))}
        {isHidden && (
          <span className="px-1.5 py-0.5 text-[8px] font-medium bg-white/80 backdrop-blur-sm text-gray-500 rounded-full border border-gray-200/50 flex items-center gap-0.5">
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            {fw.hidden || "Hidden"}
          </span>
        )}
      </div>
    </div>

    {/* Content Section - Ultra compact */}
    <div className="p-2 flex-grow flex flex-col">
   <h3 className="font-medium text-xs text-gray-900 line-clamp-1 mb-0.5">
  {isRTL
    ? (p.name_ar || p.name_en || p.name)
    : (p.name_en || p.name_ar || p.name)}
</h3>
      
      <div className="flex items-center justify-between text-[10px] mb-1.5">
        <span className="font-medium text-gray-900">{fw.qar} {p.price}</span>
        <span className="text-gray-400">{fw.quantity || "Stock"}:{p.quantity}</span>
      </div>

      {/* Actions - Minimal */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-1.5">
        <button
          onClick={() => setEditingProduct(p)}
          className="text-[10px] text-blue-500 hover:text-blue-600 font-medium px-1 py-0.5 rounded-md hover:bg-blue-50/50 transition-colors"
        >
          {fw.edit || "Edit"}
        </button>
        
        <button
          onClick={() => setDeleteProductId(p.id)}
          className="text-[10px] text-red-400 hover:text-red-500 font-medium px-1 py-0.5 rounded-md hover:bg-red-50/50 transition-colors"
        >
          {fw.delete || "Delete"}
        </button>
        
        <button
          onClick={() => toggleProductVisibility(p.id)}
          className={`p-1 rounded-full transition-colors ${
            isHidden 
              ? "text-gray-400 hover:text-gray-500" 
              : "text-gray-300 hover:text-gray-400"
          }`}
        >
          {isHidden ? <FaEyeSlash className="text-[10px]" /> : <FaEye className="text-[10px]" />}
        </button>
      </div>
    </div>
  </article>
);
};

return (
     <div className="w-full overflow-hidden max-w-full min-w-0  p-4 ">
      {/* COMPANY HEADER */}

{/* Header */}
<div className="w-full  min-w-0 mt-4 sm:mt-6 mb-6">
  
  <div className="
    flex 
    flex-col 
    xs:flex-row 
    sm:flex-row
    items-stretch 
    sm:items-center 
    justify-between 
    gap-3 
    w-full
  ">
    
    {/* Title */}
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate sm:w-auto">
          {productType === "service" ? (fw.our_services || "Our Services") : (fw.our_products || "Our Products")} ({products.length})
    </h2>

        {/* Tabs for Product/Service - Premium Card Style */}
        <div className="flex bg-white border border-gray-200/50 rounded-2xl p-1 shrink-0 mx-auto sm:mx-0 shadow-sm">
          {["product", "service"].map((t) => (
            <button
              key={t}
              onClick={() => setProductType(t)}
              className={`px-8 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${productType === t
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-[1.02]"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"
                }`}
            >
              {t === "product" ? (fw.products || "Products") : (fw.services || "Services")}
            </button>
          ))}
        </div>
{/* right content */}
<div className="
      flex 
       
      flex-row 
       
      items-stretch 
      sm:items-center 
      gap-2 
      w-full 
      sm:w-auto
    ">
      
      {/* View Mode Filter */}
      <select
        value={viewMode}
        onChange={(e) => setViewMode(e.target.value)}
        className="
          bg-white 
          border 
          border-gray-200 
          text-gray-700 
          text-[11px] md:text-sm
          font-bold 
          rounded-lg 
          focus:ring-blue-500 
          focus:border-blue-500 
          outline-none
        p-2
          w-1/2
          sm:w-auto
          min-w-0
        "
      >
       <option value="all">{fw.all_products}</option>
<option value="back_in_stock">{fw.back_in_stock || "Back in Stock"}</option>
     {availableTags.map(tag => {
  const key = tag.name?.toLowerCase().replace(/\s+/g, "_");

  return (
    <option key={tag.id} value={String(tag.id)}>
      {fw[key] || tag.name}
    </option>
  );
})}
      </select>

      {/* Add Product Button */}
      <button
        onClick={() => setEditingProduct({})}
        className="
          flex 
          items-center 
          justify-center 
          gap-1.5 
        p-2
          text-[11px] md:text-sm
          font-medium 
          tracking-tight
          bg-blue-500 
          text-white 
          rounded-lg 
          shadow-lg
          hover:bg-blue-600 
          hover:shadow-lg 
          hover:scale-[1.02]
          active:scale-[0.98]
          transition-all 
          duration-200
          w-1/2
          sm:w-auto
          whitespace-nowrap
        "
      >
        <FaPlus className="text-sm shrink-0" />
        <span className="truncate">{fw.add_product}</span>
      </button>

    </div>
    </div>
  </div>

{loading ? (
  <div className="w-full pb-8">
    
    {/* Grid Skeleton */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 w-full animate-pulse">
      
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
        >
          {/* Image Skeleton */}
          <div className="aspect-[4/3] bg-gray-200 w-full" />

          {/* Content */}
          <div className="p-2 space-y-2">
            
            {/* Title */}
            <div className="h-3 w-3/4 bg-gray-200 rounded" />

            {/* Price + Stock */}
            <div className="flex justify-between">
              <div className="h-3 w-1/3 bg-gray-200 rounded" />
              <div className="h-3 w-1/4 bg-gray-200 rounded" />
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 pt-2 flex justify-between">
              <div className="h-3 w-1/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/4 bg-gray-200 rounded" />
              <div className="h-3 w-3 bg-gray-200 rounded-full" />
            </div>

          </div>
        </div>
      ))}

    </div>
  </div>
) : (
    /* CONTENT AREA */
    <div className="w-full pb-8">
        {viewMode === 'back_in_stock' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px bg-white flex-1"></div>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{fw.low_in_stock || "Low Stock"}</span>
              <div className="h-px bg-white flex-1"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {products.filter(p => (Number(p.quantity) || 0) <= 5).map(p => renderProductCard(p))}
            </div>
            {products.filter(p => (Number(p.quantity) || 0) <= 5).length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400">{fw.no_products_found || "No products found"}</p>
              </div>
            )}
          </div>
        ) : viewMode === 'all' ? (
        /* GRID: ALL PRODUCTS */
       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 w-full">
          {products.map(p => renderProductCard(p))}

            {/* Add Card */}
            <div
              onClick={() => setEditingProduct({})}
              className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all min-h-[180px]"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2 text-gray-300">
                <FaPlus className="text-xs" />
              </div>
              <span className="text-gray-400 text-[10px] font-medium">{fw.add_product}</span>
            </div>
          </div>
        ) : (
            /* LIST: SHOW JUST THE SELECTED TAG */
          <div className="space-y-6">
              {availableTags
                .filter(tag => String(tag.id) === String(viewMode))
                .map(tag => {
                  const tagProducts = products.filter(p => productHasTag(p, tag.id));
                  if (tagProducts.length === 0) {
                    return (
                      <div key={tag.id} className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-400">{fw.no_products_found || "No products found"} "{tag.name}"</p>
                      </div>
                    );
                  }

                  return (
                    <div key={tag.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* Divider Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{tag.name}</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                      </div>

                      {/* Products Grid for this Tag */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {tagProducts.map(p => renderProductCard(p))}
                      </div>
                    </div>
                  );
                })}
          </div>
        )}
    </div>
  )}

  {/* MODAL  */}
  {editingProduct && (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center p-3 z-[1000]">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-sm font-medium text-gray-900">
            {formData.id
  ? (fw.edit_product || "Edit Product")
  : (fw.add_product || "New Product")}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-500 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
            onClick={closeModal}
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

          {/* Product / Service Toggle */}
          <div className="px-4 pt-3 shrink-0">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {["product", "service"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFormData(prev => ({ ...prev, type: t, tags: [], quantity: "" }))}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${formData.type === t
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {t === "product" ? (fw.product || "Product") : (fw.service || "Service")}
                </button>
              ))}
            </div>
          </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

          {/* SECTION: Upload Images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{fw.images || "Images"}</h3>
              <span className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">  {fw.main_first}
</span>
            </div>

            <div className="flex gap-2 items-start overflow-x-auto pb-2 scrollbar-none">
              <label
                htmlFor="album-upload"
                className="shrink-0 w-16 h-16 border border-dashed border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <div className="w-5 h-5 rounded bg-white flex items-center justify-center mb-0.5">
                  <FaPlus className="text-[8px] text-gray-400" />
                </div>
                <span className="text-[7px] text-gray-400">{fw.add || "Add"}</span>
                <input id="album-upload" type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleMediaFiles(e.target.files)} />
              </label>

              {/* Previews */}
              {formData.media.map(m => (
                <div key={m.id} className="shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                  <img src={m.url} className="w-full h-full object-cover" />
                  <button className="absolute top-0.5 right-0.5 bg-gray-900/50 text-white w-4 h-4 rounded-full flex items-center justify-center text-[6px] backdrop-blur-sm hover:bg-gray-900/70 transition-colors"
                    onClick={() => handleRemoveMedia(m.id, false)}><FaTimes /></button>
                </div>
              ))}

              {formData.existingMedia?.map(m => (
                <div key={m.id} className="shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 opacity-70">
                  <img src={m.url} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: Product Information */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{fw.product_details || "Details"}</h3>

            <div className="space-y-2">
              <input
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-gray-200 transition-all text-xs text-gray-900 placeholder-gray-400"
                placeholder={fw.name || "Product name"}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

              <div className={`grid gap-2 ${formData.type === "service" ? "grid-cols-1" : "grid-cols-2"}`}>
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-gray-200 transition-all text-xs text-gray-900 placeholder-gray-400"
                  placeholder={fw.price || "Price"}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                {formData.type !== "service" && (
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-gray-200 transition-all text-xs text-gray-900 placeholder-gray-400"
                    placeholder={fw.quantity || "Stock"}
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  />
                )}
            </div>

            <textarea
              rows="3"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:bg-white focus:border-gray-200 transition-all text-xs text-gray-900 placeholder-gray-400 resize-none"
              placeholder={fw.description || "Description"}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
{/* SECTION: Category */}
<div className="space-y-2">
  <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
   {fw.category}
  </h3>

  <div className="relative">
    <select
      value={formData.category_ids[0] || ""}
      onChange={(e) => {
        const val = e.target.value;
        setFormData({ ...formData, category_ids: val ? [val] : [] });
      }}
      className="
        w-full
        px-3
        pr-8
        py-2
        bg-gray-50
        border
        border-gray-100
        rounded-lg
        outline-none
        focus:bg-white
        focus:border-gray-200
        transition-all
        text-xs
        text-gray-900
        appearance-none
        cursor-pointer
      "
    >
      <option value="">{fw.select_category || "Select category"}</option>
      {categories.map((cat) => (
        <option key={cat.id} value={String(cat.id)}>
          {cat.title}
        </option>
      ))}
    </select>

    {/* Arrow */}
    <div className="
      pointer-events-none
      absolute
      right-2
      top-1/2
      -translate-y-1/2
      text-gray-400
    ">
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 9l6 6 6-6"
        />
      </svg>
    </div>
  </div>
</div>

            {/* SECTION: Tags — hidden for service */}
            {formData.type !== "service" && (
<div className="space-y-2">
  <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
    {fw.product_highlights}
  </h3>

  <div className="flex flex-wrap gap-2">
{availableTags.map(tag => {
  const tid = String(tag.id);
  const isActive = formData.tags.includes(tid);

  // convert tag name to fixed_words key
  const key = tag.name?.toLowerCase().replace(/\s+/g, "_");

  return (
    <button
      key={tag.id}
      onClick={() => {
        const exists = formData.tags.includes(tid);
        const newTags = exists
          ? formData.tags.filter(t => t !== tid)
          : [...formData.tags, tid];

        setFormData({ ...formData, tags: newTags });
      }}
      className={`
        flex items-center gap-1.5
        px-2.5 py-1
        rounded-full
        text-[10px]
        font-medium
        border
        transition-all
        duration-200
        ${
          isActive
            ? "bg-blue-50 text-blue-600 border-blue-200"
            : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"
        }
      `}
    >
      <span
        className={`
          w-3 h-3
          rounded-full
          border
          flex items-center justify-center
          ${
            isActive
              ? "bg-blue-500 border-blue-500"
              : "border-gray-300"
          }
        `}
      >
        {isActive && <FaCheck className="text-white text-[7px]" />}
      </span>

      {fw[key] || tag.name}
    </button>
  );
})}
  </div>
</div>
            )}

        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex gap-2 shrink-0">
          <button 
            onClick={closeModal}
            className="flex-1 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {fw.cancel || "Cancel"}
          </button>
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className={`flex-[2] py-2 rounded-lg text-xs font-medium text-white transition-colors flex items-center justify-center gap-1.5 ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 border-1.5 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{fw.save || "Saving"}</span>
              </>
            ) : (
              <>
                <FaCheck className="text-[10px]" />
                {formData.id ? (fw.update || "Update") : (fw.save || "Save")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )}
  {/* DELETE CONFIRM MODAL */}
{deleteProductId && (
  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center p-3 z-[1100]">
    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-5 animate-in fade-in zoom-in duration-300">
      
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        {fw.delete_product || "Delete Product?"}
      </h3>

      <p className="text-xs text-gray-500 mb-4">
        {fw.delete_warning || "This action cannot be undone."}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => setDeleteProductId(null)}
          className="flex-1 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100"
        >
          {fw.cancel || "Cancel"}
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
        >
         {fw.delete || "Delete"}
        </button>
      </div>
    </div>
  </div>
)}
  {/* History Modal */}
  <NotificationHistoryModal
    isOpen={showHistoryModal}
    onClose={() => setShowHistoryModal(false)}
  />
  
  {/* NOTIFICATION MODAL */}
  <SendNotificationModal
    isOpen={showNotificationModal}
    onClose={() => setShowNotificationModal(false)}
    products={products}
    availableTags={availableTags}
    customers={contacts}
  />
</div>
);
}

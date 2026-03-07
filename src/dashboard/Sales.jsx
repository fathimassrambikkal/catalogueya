import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FaPlus,
  FaTimes,
  FaBell,
  FaShoppingBag,
  FaTags,
  FaStar,
  FaBullhorn,
  FaCrown,
  FaCartArrowDown,
  FaCartPlus,

  FaCalendarAlt,
  FaPercent,
  FaHistory
} from "./SvgIcons";

import {
  getHighlightProducts,
  getCompanyProducts,
  getImageUrl,
  updateSalesProduct,
  deleteSalesProduct,
  getHighlightsTabs,
  deleteHighlightFromProduct
} from "../companyDashboardApi";

import AddToHighlightsModalSales from "./AddToHighlightsModalSales";
import NotifyHighlightsModalSales from "./NotifyHighlightsModalSales";
import Notifications from "./Notifications";

import { showToast } from "../utils/showToast";
import { useFixedWords } from "../hooks/useFixedWords";
import { useTranslation } from "react-i18next";

const HIGHLIGHT_TYPES = [
  { id: "sales", label: "SALES", icon: FaTags, color: "from-blue-500 to-blue-600" },
  { id: "new_arrivals", label: "NEW ARRIVAL", icon: FaStar, color: "from-blue-400 to-blue-500" },
  { id: "limited_edition", label: "LIMITED EDITION", icon: FaCrown, color: "from-blue-600 to-blue-700" },
  { id: "best_seller", label: "BEST SELLER", icon: FaBullhorn, color: "from-blue-500 to-blue-600" },
  { id: "low_in_stock", label: "LOW IN STOCK", icon: FaCartArrowDown, color: "from-blue-400 to-blue-500" },
  { id: "back_in_stock", label: "BACK IN STOCK", icon: FaCartPlus, color: "from-blue-600 to-blue-700" },
];

export default function Sales({ companyId, companyInfo, user, setActiveTab, setTargetConversationId }) {
  const [selectedType, setSelectedType] = useState("sales");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list");
  const [isSending, setIsSending] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountData, setDiscountData] = useState({ discount: '', from: '', to: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [tabMap, setTabMap] = useState({});
  const [deleteProductId, setDeleteProductId] = useState(null);
  const currentUserId = companyId || localStorage.getItem("company_id") || "13";
const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};

const { i18n } = useTranslation();
const isRTL = i18n.dir() === "rtl";
  // Fetch mapping of Tab keys to their correct IDs 
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const res = await getHighlightsTabs();
        const tabs = res.data?.special_marks || [];
        const map = {};
        tabs.forEach(t => {
          if (t.key) {
            map[t.key] = t.id;
          }
        });
        setTabMap(map);
      } catch (err) {
        console.error("Failed to load generic highlights tabs", err);
      }
    };
    fetchTabs();
  }, []);

  const fetchProducts = useCallback(async (type) => {
    try {
      setLoading(true);
      if (type === 'back_in_stock') {
        const res = await getCompanyProducts();
        let data = [];
        if (res.data?.data) {
          data = Array.isArray(res.data.data) ? res.data.data : (res.data.data.products || []);
        } else if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data?.products) {
          data = res.data.products;
        }
        const lowStockProducts = data.filter(p => (parseInt(p.quantity) || 0) <= 5);
        setProducts(lowStockProducts);
      } else {
        const res = await getHighlightProducts(type, currentUserId);
        let data = [];
        if (res.data?.data) {
          data = Array.isArray(res.data.data) ? res.data.data : (res.data.data.products || []);
        } else if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data?.products) {
          data = res.data.products;
        }
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching highlight products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchProducts(selectedType);
  }, [selectedType, fetchProducts]);

  const handleFinalSalesAdd = async () => {
    try {
      setIsSending(true);
      await updateSalesProduct(editingProduct.id, {
        type: selectedType,
        discount: discountData.discount,
        discount_from: discountData.from,
        discount_to: discountData.to
      });
      showToast(fw.update || "Updated successfully", { type: "success" });
      setShowDiscountModal(false);
      setEditingProduct(null);
      setView("list");
      fetchProducts(selectedType);
    } catch (error) {
      console.error(error);
      showToast("Error", { type: "error" });
    } finally {
      setIsSending(false);
    }
  };

  const handleEditClick = (p) => {
    setEditingProduct(p);
    setDiscountData({
      discount: p.discount || "",
      from: p.discount_from || "",
      to: p.discount_to || ""
    });
    setShowDiscountModal(true);
  };

  const handleDeleteClick = (id) => {
  setDeleteProductId(id);
};
const handleDelete = async () => {
  if (!deleteProductId) return;

  try {
    setIsSending(true);

    if (selectedType === "sales") {
      await deleteSalesProduct(deleteProductId);
    } else {
      const tabId = tabMap[selectedType];

      if (!tabId) {
        throw new Error("Invalid tab ID mapping for: " + selectedType);
      }

      await deleteHighlightFromProduct(deleteProductId, [tabId]);
    }

    showToast(fw.delete || "Removed successfully", { type: "success" });

    setDeleteProductId(null);
    fetchProducts(selectedType);

  } catch (error) {
    console.error(error);
    showToast("Error", { type: "error" });
  } finally {
    setIsSending(false);
  }
};
  const renderProductCard = (p) => {
    const imgSrc = getImageUrl(p.image);
    const SelectedIcon = HIGHLIGHT_TYPES.find(t => t.id === selectedType)?.icon || FaShoppingBag;
    
return (
  <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all flex flex-col h-full">
    {/* Image Section - 2/3 of card */}
    <div className="relative w-full aspect-[4/3] bg- flex-shrink-0 overflow-hidden">
      {imgSrc ? (
        <img
          src={imgSrc}
          className="w-full h-full object-cover"
          alt={isRTL ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-200 text-xs">
          <SelectedIcon className="w-7 h-7 text-blue-300" />
        </div>
      )}

      {/* Minimal Status Tags */}
      <div className="absolute top-2 left-2 flex flex-wrap gap-1 items-center pointer-events-none">
        {p.discount && (
          <span className="px-1.5 py-0.5 text-[8px] font-medium bg-blue-600 text-white  rounded-full border border-gray-200/50">
            {p.discount}% OFF
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
      
      {/* Price Section */}
      <div className="leading-tight mb-1.5">
        <p className="font-bold text-blue-600 text-[clamp(0.7rem,2vw,1rem)]">
          QAR {Number(p.price).toFixed(2)}
        </p>

        {p.original_price && (
          <p className="text-gray-400 line-through text-[clamp(0.6rem,1.5vw,0.75rem)]">
            QAR {Number(p.original_price).toFixed(2)}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between text-[10px] mb-1.5">
        {selectedType === "sales" && (p.discount_from || p.discount_to) && (
           <div className="flex items-center gap-1 text-[8px] sm:text-[10px] md:text-[11px] text-gray-500 pt-1">
              <FaCalendarAlt className="w-3 h-3 text-blue-400" />
              <span>
                {p.discount_from || '---'} — {p.discount_to || '---'}
              </span>
            </div>
        )}
      </div>

        




      {/* Actions - Minimal */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-1.5">
        {selectedType === "sales" ? (
          <button
            onClick={() => handleEditClick(p)}
            className="text-[10px] text-blue-500 hover:text-blue-600 font-medium px-1 py-0.5 rounded-md hover:bg-blue-50/50 transition-colors"
          >
            {fw.edit || "Edit"}
          </button>
        ) : (
          <div />
        )}
        
        <button
          onClick={() => handleDeleteClick(p.id)}
          className="text-[10px] text-red-400 hover:text-red-500 font-medium px-1 py-0.5 rounded-md hover:bg-red-50/50 transition-colors"
        >
          {fw.delete || "Delete"}
        </button>
        
       
      </div>
    </div>
  </article>
);
  };

  return (
    <div className="min-h-screen pt-[clamp(1rem,2vw,1.5rem)] px-[clamp(0.75rem,2vw,1.5rem)] sm:px-[clamp(1rem,3vw,2rem)] lg:px-[clamp(1.5rem,4vw,2.5rem)] bg-white">
      <div className="max-w-[clamp(1000px,90vw,1920px)] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-[clamp(1rem,2.5vw,1.5rem)]">
          <h1 className=" text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mt-20 md:mt-4">{fw.product_highlights || "Product Highlights"}</h1>
        </div>

        {/* Category Tabs */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {HIGHLIGHT_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <button
                  key={type.id}
                  onClick={() => { setSelectedType(type.id); setView("list"); }}
                  className={`
                    relative px-[clamp(0.9rem,1.4vw,0.625rem)] py-[clamp(0.3rem,1.4vw,0.25rem)] rounded-full text-[clamp(0.675rem,1.2vw,0.75rem)] font-medium transition-all duration-200
                    ${isSelected 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-[#f8f8fc] text-gray-600 hover:bg-[#e8e8ed]'
                    }
                  `}
                >
                  <div className="flex items-center gap-1">
                    <Icon className={`w-[clamp(0.75rem,1.2vw,0.875rem)] h-[clamp(0.75rem,1.2vw,0.875rem)] ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                   <span>{fw[type.id] || type.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-[clamp(0.875rem,2vw,1.25rem)]">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className=" ">
              <span className="text-[clamp(0.75rem,1.2vw,0.875rem)] font-medium text-gray-700">
                {products.length} {products.length === 1 ? fw.product || "Product" : fw.products || "Products"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setView("add")}
              className=" sm:flex-initial px-[clamp(0.625rem,1.5vw,0.875rem)] py-[clamp(0.25rem,0.875vw,0.375rem)] bg-blue-600 rounded-xl text-[clamp(0.6rem,1.2vw,0.875rem)] font-medium text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FaPlus className="w-[clamp(0.875rem,1.2vw,1rem)] h-[clamp(1.1rem,1.2vw,1rem)]" />
              <span>{fw.add_highlights || "Add Highlights"}</span>
            </button>

            <button
              onClick={() => setView("notify")}
              className="flex-1 sm:flex-initial px-[clamp(0.625rem,1.5vw,0.875rem)] py-[clamp(0.25rem,0.875vw,0.375rem)] bg-white/80 backdrop-blur-sm rounded-xl text-[clamp(0.75rem,1.2vw,0.875rem)] font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 border border-blue-100/50 flex items-center justify-center gap-2"
            >
              <FaBell className="w-[clamp(0.875rem,1.2vw,1rem)] h-[clamp(1.1rem,1.2vw,1rem)] text-blue-500" />
              <span>{fw.notify || "Notify"}</span>
            </button>

            <button
              onClick={() => setView("history")}
              className="flex-1 sm:flex-initial px-[clamp(0.625rem,1.5vw,0.875rem)] py-[clamp(0.25rem,0.875vw,0.375rem)] bg-white/80 backdrop-blur-sm rounded-xl text-[clamp(0.75rem,1.2vw,0.875rem)] font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 border border-blue-100/50 flex items-center justify-center gap-2"
            >
              <FaHistory className="w-[clamp(0.875rem,1.2vw,1rem)] h-[clamp(1.1rem,1.2vw,1rem)] text-blue-500" />
              <span>{fw.history || "History"}</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl border border-blue-100/50 shadow-xl shadow-blue-500/5 p-[clamp(0.875rem,2vw,1.25rem)]">
          {/* Section Title */}
          <div className="flex items-center gap-2 mb-[clamp(0.875rem,2vw,1.25rem)]">
            <div className="w-1 h-[clamp(1rem,2vw,1.25rem)] bg-blue-600 rounded-full" />
            <h2 className="text-[clamp(0.75rem,1.2vw,0.875rem)] font-medium text-gray-500 uppercase tracking-wider">
              {selectedType.replace(/_/g, " ")} {fw.products || "Products"}
            </h2>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[clamp(0.5rem,1.5vw,0.875rem)]">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 animate-pulse">
                  <div className="aspect-square bg-blue-100/50 rounded-xl mb-3" />
                  <div className="h-3 bg-blue-100/50 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-blue-100/50 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[clamp(0.5rem,1.5vw,0.875rem)]">
              {products.map(p => (
                <React.Fragment key={p.id}>
                  {renderProductCard(p)}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[clamp(2rem,6vw,4rem)] text-gray-400">
              <div className="w-[clamp(2.5rem,5vw,4rem)] h-[clamp(2.5rem,5vw,4rem)] bg-blue-50/50 rounded-2xl flex items-center justify-center mb-4">
                <FaShoppingBag className="w-[clamp(1.25rem,2.5vw,1.75rem)] h-[clamp(1.25rem,2.5vw,1.75rem)] text-blue-300" />
              </div>
              <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] font-medium"> {fw.no_products_found || "No products found"}</p>
              <p className="text-[clamp(0.625rem,1vw,0.75rem)] mt-1">{fw.add_products_to_get_started || "Add products to get started"}</p>
            </div>
          )}
        </div>
      </div>

      {/* History Modal */}
      {view === "history" && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white backdrop-blur-xl rounded-3xl w-full max-w-[clamp(300px,90vw,1280px)] max-h-[80vh] flex flex-col shadow-2xl border border-blue-100/50 ">
            <div className="p-[clamp(0.875rem,2vw,1.25rem)] border-b border-blue-100/50 flex justify-between items-center">
              <h3 className="text-[clamp(0.875rem,2vw,1.125rem)] font-semibold text-gray-900">{fw.history || "History"}</h3>
              <button 
                onClick={() => setView('list')} 
                className="w-[clamp(1.5rem,3vw,2rem)] h-[clamp(1.5rem,3vw,2rem)] rounded-full bg-gray-200/30 hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto  ">
              <Notifications 
                setActiveTab={setActiveTab} 
                setTargetConversationId={setTargetConversationId} 
                initialTab={selectedType} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-[clamp(280px,90vw,448px)] p-[clamp(0.875rem,2vw,1.25rem)] shadow-2xl border border-blue-100/50">
            <div className="flex justify-between items-center mb-[clamp(0.875rem,2vw,1.25rem)]">
              <h3 className="text-[clamp(0.875rem,2vw,1.125rem)] font-semibold text-gray-900">
                {editingProduct
  ? fw.edit || "Edit"
  : fw.add_highlights || "Add"}
              </h3>
              <button
                onClick={() => { setShowDiscountModal(false); setEditingProduct(null); }}
                className="w-[clamp(1.5rem,3vw,2rem)] h-[clamp(1.5rem,3vw,2rem)] rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[clamp(0.625rem,1vw,0.75rem)] font-medium text-gray-500 mb-1.5">
                  {fw.discount || "Discount"}
                </label>
                <div className="relative">
                  <FaPercent className="absolute left-3 top-1/2 -translate-y-1/2 w-[clamp(0.75rem,1.2vw,0.875rem)] h-[clamp(0.75rem,1.2vw,0.875rem)] text-gray-400" />
                  <input
                    type="number"
                    placeholder="0"
                    value={discountData.discount}
                    onChange={e => setDiscountData({ ...discountData, discount: e.target.value })}
                    className="w-full pl-9 pr-3 py-[clamp(0.375rem,1vw,0.5rem)] bg-white/80 border border-blue-100 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 text-[clamp(0.75rem,1.2vw,0.875rem)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[clamp(0.625rem,1vw,0.75rem)] font-medium text-gray-500 mb-1.5">{fw.from || "From"}</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-[clamp(0.75rem,1.2vw,0.875rem)] h-[clamp(0.75rem,1.2vw,0.875rem)] text-gray-400" />
                    <input
                      type="date"
                      value={discountData.from}
                      onChange={e => setDiscountData({ ...discountData, from: e.target.value })}
                      className="w-full pl-9 pr-3 py-[clamp(0.375rem,1vw,0.5rem)] bg-white/80 border border-blue-100 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 text-[clamp(0.75rem,1.2vw,0.875rem)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[clamp(0.625rem,1vw,0.75rem)] font-medium text-gray-500 mb-1.5">{fw.to || "To"}</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-[clamp(0.75rem,1.2vw,0.875rem)] h-[clamp(0.75rem,1.2vw,0.875rem)] text-gray-400" />
                    <input
                      type="date"
                      value={discountData.to}
                      onChange={e => setDiscountData({ ...discountData, to: e.target.value })}
                      className="w-full pl-9 pr-3 py-[clamp(0.375rem,1vw,0.5rem)] bg-white/80 border border-blue-100 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 text-[clamp(0.75rem,1.2vw,0.875rem)]"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinalSalesAdd}
                disabled={isSending}
                className="w-full py-[clamp(0.375rem,1.5vw,0.625rem)] bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-[clamp(0.75rem,1.2vw,0.875rem)]"
              >
                {isSending ? "..." : fw.save || "Save"}
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
      {/* Add Modal */}
      {view === "add" && (
        <AddToHighlightsModalSales
          selectedType={selectedType}
          companyId={companyId}
          onClose={() => setView("list")}
          onSuccess={() => fetchProducts(selectedType)}
        />
      )}

      {/* Notify Modal */}
      {view === "notify" && (
        <NotifyHighlightsModalSales
          selectedType={selectedType}
          products={products}
          onClose={() => setView("list")}
        />
      )}
    </div>
    
  );
}
import React, { useEffect, useState } from "react";
import {
 
  FaCheckCircle,
  FaTag
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  getCompanyProducts,
  getHighlightProducts,
  getImageUrl,
  addSalesProduct,
  updateSalesProduct,
  getHighlightsTabs,
  addHighlightToProduct,
} from "../companyDashboardApi";
import { FaTimes } from "./SvgIcons";
import { showToast } from "../utils/showToast";
import { useFixedWords } from "../hooks/useFixedWords";
export default function AddToHighlightsModalSales({
  selectedType,
  companyId,
  onClose,
  onSuccess
}) {
  const [allProducts, setAllProducts] = useState([]);
  const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};

const { i18n } = useTranslation();
const isRTL = i18n.dir() === "rtl";
  const [highlightProducts, setHighlightProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const isSalesType = selectedType === "sales";
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [discountData, setDiscountData] = useState({
    discount: "",
    from: "",
    to: ""
  });
  const [tabId, setTabId] = useState(null);

  // Fetch tabs to match ID
  const fetchTabs = async () => {
    try {
      const res = await getHighlightsTabs();
      const tabs = res.data?.special_marks || [];
      const currentTab = tabs.find(t => t.key === selectedType);
      if (currentTab) setTabId(currentTab.id);
    } catch (err) {
      console.error("Error fetching tabs:", err);
    }
  };

  const currentUserId =
    companyId || localStorage.getItem("company_id") || "13";

  // 🔹 Fetch All Products
  const fetchAllProducts = async () => {
    try {
      const res = await getCompanyProducts();
      const data =
        res.data?.data?.products ||
        res.data?.data ||
        res.data?.products ||
        res.data ||
        [];
      setAllProducts(data);
    } catch (err) {
      console.error(err);
      setAllProducts([]);
    }
  };

  // 🔹 Fetch Already Highlighted (Compare with selectedType)
  const fetchHighlighted = async () => {
    try {
      if (selectedType === 'back_in_stock') {
        setHighlightProducts([]);
        return;
      }
      const res = await getHighlightProducts(selectedType, currentUserId);
      const data =
        res.data?.data?.products ||
        res.data?.data ||
        res.data?.products ||
        res.data ||
        [];
      setHighlightProducts(data);
    } catch (err) {
      console.error(err);
      setHighlightProducts([]);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchHighlighted();
    fetchTabs();
  }, [selectedType]);

  // 🔹 Confirm Add
  const handleConfirm = () => {
    if (selectedIds.length === 0) {
      showToast(fw.select_one_product || "Select at least one product", { type: "error" });
      return;
    }

   setDiscountData({ discount: "", from: "", to: "" });
setShowDiscountModal(true);
  };

  // 🔹 Final Save
  const handleFinalSave = async () => {
    try {
      setIsSending(true);

      if (isSalesType) {
        if (editingProduct) {
          const res = await updateSalesProduct(editingProduct.id, {
            type: selectedType,
            discount: discountData.discount,
            discount_from: discountData.from,
            discount_to: discountData.to
          });
          showToast(
  res?.data?.message ||
  fw.updated_successfully ||
  "Updated successfully",
  { type: "success" }
);
        } else {
          let lastRes;
          for (const pid of selectedIds) {
            lastRes = await addSalesProduct(pid, {
              type: selectedType,
              discount: discountData.discount,
              discount_from: discountData.from,
              discount_to: discountData.to
            });
          }
          showToast(
  lastRes?.data?.message ?? fw.added_to_sales_successfully,
  { type: "success" }
);
        }
      } else {
        // Non-Sales regular highlight save
        if (!tabId) {
          showToast(fw.invalid_tab_selected, { type: "error" });
          return;
        }
        let lastRes;
        for (const pid of selectedIds) {
          lastRes = await addHighlightToProduct(pid, [tabId]);
        }
        showToast(
  lastRes?.data?.message ||
  fw.added_to_highlights_successfully ||
  `Added to ${selectedType.replace(/_/g, " ")} successfully`,
  { type: "success" }
);
      }

      setShowDiscountModal(false);
      setSelectedIds([]);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      let errorMsg =
  fw.failed_add_highlight ||
  fw.failed_send_notification ||
  "Failed to add highlight";
      if (err.response?.data?.errors) {
        errorMsg = Object.values(err.response.data.errors).flat().join('\n');
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      showToast(errorMsg, { type: "error" });
    } finally {
      setIsSending(false);
    }
  };

  
   return (
  <>
    {/* MAIN MODAL */}
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-[98vw] sm:max-w-[95vw] md:max-w-[90vw] h-[95vh] sm:h-[90vh] flex flex-col shadow-xl overflow-hidden relative border border-gray-100">

        {/* HEADER */}
        <div className="p-3 sm:p-4 md:p-5 border-b border-gray-100 flex justify-between items-center">
             <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 capitalize">
               {fw.add || "Add"} {fw[selectedType] ?? selectedType.replace(/_/g, " ")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 sm:p-2 rounded-lg transition-colors"
          >
            <FaTimes size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">              {allProducts.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                const isAlreadyIn = highlightProducts.some(
                  (hp) => hp.id === p.id
                );

                return (
                  <div
                    key={p.id}
                    onClick={() =>
                      !isAlreadyIn &&
                      setSelectedIds((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== p.id)
                          : [...prev, p.id]
                      )
                    }
                    className={`relative rounded-lg border p-1.5 sm:p-2 cursor-pointer transition-all duration-200 ${
                      isAlreadyIn
                        ? "opacity-40 cursor-not-allowed border-gray-100 bg-gray-50/30"
                        : isSelected
                        ? "border-blue-600 bg-blue-50/30 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <div className="aspect-square bg-gray-50 rounded-md overflow-hidden mb-1.5 sm:mb-2">
                      <img
                        src={getImageUrl(p.image)}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    
                    {/* Label with requested style */}
                    {isAlreadyIn && (
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[8px] font-medium bg-white/80 backdrop-blur-sm text-gray-700 rounded-full border border-gray-200/50">
                        {fw.added || "Added"}
                      </div>
                    )}

                    {isSelected && !isAlreadyIn && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <FaCheckCircle size={8} className="text-white" />
                      </div>
                    )}

                    <div className="space-y-0.5">
                     <p className="text-[10px] sm:text-xs font-medium text-gray-900 truncate">
  {isRTL
    ? (p.name_ar || p.name_en || p.name)
    : (p.name_en || p.name_ar || p.name)}
</p>
                      <p className="text-[9px] sm:text-[10px] font-semibold text-blue-600">
                        {fw.qar || "QAR"} {p.price}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION - FIXED */}
        {selectedIds.length > 0 && (
          <div className="sticky bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
            <div className="flex items-center justify-between gap-3 sm:gap-4 max-w-7xl mx-auto">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase">
                  {fw.items_selected|| "Items selected"}

                </span>
                <span className="text-sm sm:text-base font-semibold text-blue-600">
                  {selectedIds.length}
                </span>
              </div>
              <button
                onClick={handleConfirm}
                disabled={isSending}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (fw.processing || "Processing...") : (fw.add_highlights || "Add to Highlight")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* DISCOUNT MODAL */}
    {showDiscountModal && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-3 sm:p-4">
        <div className=" relative  bg-white rounded-xl w-full max-w-[95%] sm:max-w-md mx-auto p-4 sm:p-6 shadow-xl border border-gray-100">
      <button
  onClick={() => {
    setShowDiscountModal(false);
    setEditingProduct(null);
  }}
  className="
    absolute 
    top-4 
   ltr:right-4 
rtl:left-4
    w-8 
    h-8 
    flex 
    items-center 
    justify-center 
    rounded-full 
    bg-gray-100/80 
    backdrop-blur-md 
    text-gray-500 
    hover:text-gray-800 
    hover:bg-gray-200 
    active:scale-90
    transition-all 
    duration-200
  "
>
  <FaTimes className="w-3.5 h-3.5" />
</button>
          
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-5">
            {fw.product_highlights || "Highlight Details"}
          </h3>

             <div className="space-y-4 sm:space-y-5">
{isSalesType && (
  <div>
    <label className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase flex items-center gap-1.5 mb-1.5">
      <FaTag size={10} /> {fw.discount || "Discount"} %
    </label>
    <input
      type="number"
      value={discountData.discount}
      onChange={(e) =>
        setDiscountData({
          ...discountData,
          discount: e.target.value
        })
      }
      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm bg-gray-50 rounded-lg border border-gray-100 focus:border-gray-200 focus:outline-none"
      placeholder={fw.enter_discount || "0"}
    />
  </div>
)}

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-[8px] sm:text-[10px] font-medium text-gray-400 uppercase mb-1 block">
                  {fw.from || "From"}
                </label>
                <input
                  type="date"
                  value={discountData.from}
                  onChange={(e) =>
                    setDiscountData({
                      ...discountData,
                      from: e.target.value
                    })
                  }
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs bg-gray-50 rounded-lg border border-gray-100 focus:border-gray-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[8px] sm:text-[10px] font-medium text-gray-400 uppercase mb-1 block">
                  {fw.to || "To"}
                </label>
                <input
                  type="date"
                  value={discountData.to}
                  onChange={(e) =>
                    setDiscountData({
                      ...discountData,
                      to: e.target.value
                    })
                  }
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs bg-gray-50 rounded-lg border border-gray-100 focus:border-gray-200 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleFinalSave}
              disabled={isSending}
              className="w-full py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSending ? (fw.saving || "Saving...") : (fw.save || "Save")}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
      
}

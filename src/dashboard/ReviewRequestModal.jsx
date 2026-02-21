import React, { useState, useEffect, useMemo } from 'react';
import {
    FaCheck,
    FaTimes,
    FaStar,
    FaBox,
    FaConciergeBell,
    FaSearch,
    FaShoppingBag,
    FaChevronRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl, sendReviewRequest, getCompanyProducts, getCategories } from '../companyDashboardApi';
import { toast } from 'react-hot-toast';

const ReviewRequestModal = ({
    isOpen,
    onClose,
    customerId,
    customerName
}) => {
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null); // { id: 13, type: 'product' } or { name: 'Category', type: 'service' }

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            setInitialLoading(true);
            const [prodRes, catRes] = await Promise.all([
                getCompanyProducts(),
                getCategories()
            ]);

            // Robustly extract product list (Handling nested path prodRes.data.data.products)
            let fetchedProducts = [];
            const pData = prodRes.data;

            if (Array.isArray(pData?.data?.products)) {
                fetchedProducts = pData.data.products;
            } else if (Array.isArray(pData?.data)) {
                fetchedProducts = pData.data;
            } else if (Array.isArray(pData?.products)) {
                fetchedProducts = pData.products;
            } else if (Array.isArray(pData)) {
                fetchedProducts = pData;
            }
            setProducts(fetchedProducts);

            // Robustly extract category list
            let allCategories = [];
            const cData = catRes.data;

            if (Array.isArray(cData?.data?.categories)) {
                allCategories = cData.data.categories;
            } else if (Array.isArray(cData?.data)) {
                allCategories = cData.data;
            } else if (Array.isArray(cData?.categories)) {
                allCategories = cData.categories;
            } else if (Array.isArray(cData)) {
                allCategories = cData;
            }

            // For Services: get category names from products that actually exist in the inventory
            const productCategoryIds = Array.isArray(fetchedProducts)
                ? [...new Set(fetchedProducts.map(p => p.category_id))]
                : [];

            const activeCategories = allCategories.filter(cat =>
                productCategoryIds.includes(cat.id) || productCategoryIds.includes(String(cat.id))
            );

            setCategories(activeCategories);
        } catch (err) {
            console.error("Error fetching review request data:", err);
            toast.error("Failed to load items");
        } finally {
            setInitialLoading(false);
        }
    };

    const filteredItems = useMemo(() => {
        const list = activeTab === 'products' ? products : categories;
        const safeList = Array.isArray(list) ? list : [];

        if (!searchTerm) return safeList;

        return safeList.filter(item => {
            const name = activeTab === 'products' ? (item.name || item.name_en) : (item.name_en || item.name);
            return name?.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [activeTab, products, categories, searchTerm]);

    const handleSubmit = async () => {
        if (!selectedItem) {
            toast.error("Please select a product or service");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                customer_id: customerId,
            };

            if (selectedItem.type === 'product') {
                payload.product_id = selectedItem.id;
            } else {
                payload.service_name = selectedItem.name;
            }

            await sendReviewRequest(payload);
            toast.success("Review request sent successfully!");
            onClose();
            setSelectedItem(null);
        } catch (err) {
            console.error("Error sending review request:", err);
            toast.error("Failed to send review request");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-[2100] animate-in fade-in duration-300">
        <div
            className="bg-white w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-500 rounded-xl"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Minimal Header */}
            <div className="px-6 pt-6 pb-3 shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold text-gray-900">
                        Review Request
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors"
                    >
                        ×
                    </button>
                </div>

          {/* Pill Tabs */}
<div className="flex gap-1 mb-4 p-0.5 bg-gray-50 rounded-xl">
    <button
        onClick={() => { setActiveTab('products'); setSelectedItem(null); }}
        className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all ${
            activeTab === 'products' 
                ? 'bg-white text-blue-500 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
        }`}
    >
        Products
    </button>
    <button
        onClick={() => { setActiveTab('service'); setSelectedItem(null); }}
        className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all ${
            activeTab === 'service' 
                ? 'bg-white text-blue-500 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
        }`}
    >
        Service
    </button>
</div>
                {/* Minimal Search */}
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none text-xs focus:border-blue-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Clean List */}
            <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
                {initialLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-xs">Loading items...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-300 text-xs">No {activeTab} found</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredItems.map((item) => {
                            const isSelected = selectedItem?.type === activeTab && String(selectedItem?.id) === String(item.id);
                            const name = activeTab === 'products'
                                ? (item.name || item.name_en || item.name_ar || "Unnamed Product")
                                : (item.title || item.title_en || item.name_en || item.name || item.category_name_en || "Unnamed Service");

                            const image = activeTab === 'products' ? item.image : (item.icon || item.image || item.title_image);

                            return (
                                <div
                                    key={`${activeTab}-${item.id}`}
                                    onClick={() => setSelectedItem({
                                        id: item.id,
                                        name: name,
                                        type: activeTab
                                    })}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${isSelected 
                                        ? 'bg-blue-50' 
                                        : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-50 shrink-0">
                                        {image ? (
                                            <img src={getImageUrl(image)} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-50"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-xs font-medium truncate ${isSelected ? 'text-blue-500' : 'text-gray-700'}`}>
                                            {name}
                                        </h4>
                                        {activeTab === 'products' && (
                                            <p className="text-[10px] text-blue-500 mt-0.5">QAR {item.price}</p>
                                        )}
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border transition-colors ${isSelected 
                                        ? 'border-blue-500 bg-blue-500' 
                                        : 'border-gray-200'
                                    }`}>
                                        {isSelected && (
                                            <div className="w-full h-full flex items-center justify-center text-white text-[8px]">
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Minimal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 shrink-0">
                <button
                    onClick={handleSubmit}
                    disabled={loading || !selectedItem}
                    className="w-full py-2.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:hover:bg-blue-500"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                    ) : (
                        'Send Review Request'
                    )}
                </button>
            </div>
        </div>
    </div>
);
};

export default ReviewRequestModal;

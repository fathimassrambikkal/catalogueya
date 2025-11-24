import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaEdit } from "react-icons/fa";

export default function Sales({ products }) {
  const [saleProducts, setSaleProducts] = useState([]);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);

  const [bulkFromDate, setBulkFromDate] = useState("");
  const [bulkToDate, setBulkToDate] = useState("");

  // Initialize saleProducts from products props
  useEffect(() => {
    setSaleProducts(
      products.map((p) => ({
        ...p,
        rate: p.rate || 0,
        fromDate: p.fromDate || "",
        toDate: p.toDate || "",
      }))
    );
  }, [products]);

  // Calculate sale status and discounted price
  const getSaleInfo = (product) => {
    const now = new Date();
    const fromDate = product.fromDate ? new Date(product.fromDate) : null;
    const toDate = product.toDate ? new Date(product.toDate) : null;
    
    let status = "not-active";
    let discountedPrice = product.price;
    
    if (product.rate > 0 && fromDate && toDate) {
      if (now >= fromDate && now <= toDate) {
        status = "active";
        discountedPrice = product.price - (product.price * product.rate / 100);
      } else if (now < fromDate) {
        status = "upcoming";
      } else if (now > toDate) {
        status = "ended";
      }
    }
    
    return { status, discountedPrice };
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "upcoming":
        return "Upcoming";
      case "ended":
        return "Ended";
      default:
        return "No Sale";
    }
  };

  // Handle rate change for bulk sale modal
  const handleRateChange = (id, value) => {
    setSaleProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, rate: Number(value) } : p
      )
    );
  };

  // Publish bulk sale
  const handlePublishSales = () => {
    if (!bulkFromDate || !bulkToDate) {
      alert("Please select both start and end dates");
      return;
    }
    
    if (new Date(bulkFromDate) >= new Date(bulkToDate)) {
      alert("End date must be after start date");
      return;
    }

    setSaleProducts((prev) =>
      prev.map((p) => ({ 
        ...p, 
        fromDate: bulkFromDate, 
        toDate: bulkToDate 
      }))
    );
    console.log("Published Sales:", saleProducts);
    setShowStartModal(false);
  };

  // Open edit modal for a single product
  const handleEditProduct = (product) => {
    setSelectedEditProduct({ ...product }); // clone product
    setShowEditModal(true);
  };

  // Publish single product edit
  const handlePublishEdit = () => {
    if (selectedEditProduct.fromDate && selectedEditProduct.toDate) {
      if (new Date(selectedEditProduct.fromDate) >= new Date(selectedEditProduct.toDate)) {
        alert("End date must be after start date");
        return;
      }
    }

    setSaleProducts((prev) =>
      prev.map((p) =>
        p.id === selectedEditProduct.id ? { ...selectedEditProduct } : p
      )
    );
    setShowEditModal(false);
    setSelectedEditProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sales</h1>
        <button
          onClick={() => setShowStartModal(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg font-medium
            shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)] 
            hover:scale-105 transition-all duration-200"
        >
          <FaPlus /> Start Sale
        </button>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {saleProducts.map((item) => {
          const { status, discountedPrice } = getSaleInfo(item);
          
          return (
            <div
              key={item.id}
              className="rounded-2xl cursor-pointer transition-all duration-200
                bg-white/80 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
                hover:border-blue-200/60 hover:scale-[1.02] overflow-hidden"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100/60 flex items-center justify-center text-gray-400 backdrop-blur-sm">
                  No Image
                </div>
              )}
              
              {/* Sale Status Badge */}
              <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(status)}`}>
                {getStatusText(status)}
              </span>
              
              {item.tag && (
                <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded
                  shadow-[2px_2px_5px_rgba(59,130,246,0.3)]">
                  {item.tag}
                </span>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-sm truncate text-gray-900">{item.name}</h3>
                
                {/* Price Display */}
                <div className="mt-2">
                  {status === "active" ? (
                    <>
                      <p className="text-red-600 text-sm font-bold">
                        {item.rate}% OFF
                      </p>
                      <p className="text-gray-800 font-bold">
                        QAR {discountedPrice.toFixed(2)}
                      </p>
                      <p className="text-gray-500 text-sm line-through">
                        QAR {item.price}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-800 font-bold">QAR {item.price}</p>
                  )}
                </div>

                {/* Sale Dates */}
                {item.rate > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    {item.fromDate && (
                      <p>From: {formatDate(item.fromDate)}</p>
                    )}
                    {item.toDate && (
                      <p>To: {formatDate(item.toDate)}</p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleEditProduct(item)}
                  className="mt-3 bg-blue-500 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1 w-full justify-center transition-all duration-200
                    shadow-[2px_2px_5px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_8px_rgba(59,130,246,0.4)]"
                >
                  <FaEdit size={12} /> Edit Sale
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Sale Card */}
        <div
          className="rounded-2xl cursor-pointer transition-all duration-200 h-40 flex flex-col items-center justify-center
            bg-white/60 backdrop-blur-lg border border-dashed border-gray-300/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
            hover:border-blue-200/60 hover:scale-[1.02]"
          onClick={() => setShowStartModal(true)}
        >
          <FaPlus className="text-3xl text-gray-400 mb-2" />
          <span className="text-gray-500">Add Sale</span>
        </div>
      </div>

      {/* Start Sale Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl w-full max-w-5xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] relative border border-gray-200/60">
            <button
              className="absolute top-4 right-6 text-gray-800 hover:text-red-500 transition-colors p-2 rounded-xl
                bg-white/80 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
              onClick={() => setShowStartModal(false)}
            >
              <FaTimes size={18} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200/60 pb-4">
              Start Sale
            </h2>

            <div className="grid grid-cols-3 gap-4 h-72 overflow-y-auto p-2">
              {saleProducts.map((item) => {
                const { status } = getSaleInfo(item);
                return (
                  <div
                    key={item.id}
                    className="rounded-xl overflow-hidden relative border border-gray-200/60 p-2
                      bg-white/80 backdrop-blur-lg
                      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
                  >
                    {item.tag && (
                      <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded font-semibold
                        shadow-[1px_1px_3px_rgba(59,130,246,0.3)]">
                        {item.tag}
                      </span>
                    )}
                    <span className={`absolute top-1 right-1 px-1 py-0.5 text-xs rounded ${getStatusBadge(status)}`}>
                      {getStatusText(status)}
                    </span>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-32 w-full object-cover rounded-lg"
                    />
                    <div className="p-2 text-sm flex flex-col gap-1">
                      <p className="font-medium truncate text-gray-900">{item.name}</p>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-red-600 font-bold">{item.rate}%</span>
                        <span className="font-bold text-gray-800">
                          QAR {item.price}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-700">Rate:</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.rate}
                          onChange={(e) =>
                            handleRateChange(item.id, e.target.value)
                          }
                          className="border border-gray-300/60 rounded px-2 py-1 w-16 text-xs bg-white/80 backdrop-blur-sm
                            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* "Is this product in sale?" Text */}
            <div className="mt-6 mb-4">
              <p className="text-lg font-semibold text-gray-700 text-center">
                Is this product in sale?
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
              <div>
                <label className="font-medium text-gray-700">From Date</label>
                <input
                  type="date"
                  className="border border-gray-300/60 p-2 rounded-lg w-full mt-1 bg-white/80 backdrop-blur-sm
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={bulkFromDate}
                  onChange={(e) => setBulkFromDate(e.target.value)}
                />
              </div>
              <div>
                <label className="font-medium text-gray-700">To Date</label>
                <input
                  type="date"
                  className="border border-gray-300/60 p-2 rounded-lg w-full mt-1 bg-white/80 backdrop-blur-sm
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={bulkToDate}
                  onChange={(e) => setBulkToDate(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handlePublishSales}
              className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold
                shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)] 
                hover:scale-105 transition-all duration-200"
            >
              Publish Sales
            </button>
          </div>
        </div>
      )}

      {/* Edit Sale Modal */}
      {showEditModal && selectedEditProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl w-full max-w-lg p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] relative border border-gray-200/60">
            <button
              className="absolute top-4 right-6 text-gray-800 hover:text-red-500 transition-colors p-2 rounded-xl
                bg-white/80 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
              onClick={() => setShowEditModal(false)}
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200/60 pb-4">
              Edit Sale
            </h2>

            <div className="border border-gray-200/60 rounded-xl shadow overflow-hidden mb-4 relative
              bg-white/80 backdrop-blur-lg">
              {selectedEditProduct.tag && (
                <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded font-semibold
                  shadow-[1px_1px_3px_rgba(59,130,246,0.3)]">
                  {selectedEditProduct.tag}
                </span>
              )}
              <img
                src={selectedEditProduct.image}
                className="h-48 w-full object-cover"
                alt={selectedEditProduct.name}
              />
              <div className="p-4">
                <p className="font-medium text-gray-900">{selectedEditProduct.name}</p>
                <p className="text-red-600 font-bold text-sm">
                  {selectedEditProduct.rate}% Sale
                </p>
              </div>
            </div>

            {/* Edit Inputs */}
            <div className="space-y-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
              <div>
                <label className="font-medium block mb-2 text-gray-700">Sale Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="border border-gray-300/60 p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={selectedEditProduct.rate}
                  onChange={(e) =>
                    setSelectedEditProduct({
                      ...selectedEditProduct,
                      rate: Number(e.target.value),
                    })
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium block mb-2 text-gray-700">From Date</label>
                  <input
                    type="date"
                    className="border border-gray-300/60 p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm
                      focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={selectedEditProduct.fromDate || ""}
                    onChange={(e) =>
                      setSelectedEditProduct({
                        ...selectedEditProduct,
                        fromDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="font-medium block mb-2 text-gray-700">To Date</label>
                  <input
                    type="date"
                    className="border border-gray-300/60 p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm
                      focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={selectedEditProduct.toDate || ""}
                    onChange={(e) =>
                      setSelectedEditProduct({
                        ...selectedEditProduct,
                        toDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedEditProduct.rate === 0}
                  onChange={(e) =>
                    setSelectedEditProduct({
                      ...selectedEditProduct,
                      rate: e.target.checked ? 0 : selectedEditProduct.rate,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-gray-700">End Sale (set rate to 0%)</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold
                  shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)] 
                  hover:scale-105 transition-all duration-200"
                onClick={handlePublishEdit}
              >
                Publish Changes
              </button>
              <button
                className="bg-gray-400/60 px-6 py-3 rounded-lg font-semibold backdrop-blur-sm
                  shadow-[3px_3px_10px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_15px_rgba(0,0,0,0.15)] 
                  hover:scale-105 transition-all duration-200"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
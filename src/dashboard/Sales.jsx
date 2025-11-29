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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-2 sm:p-4 md:p-6 overflow-x-hidden min-w-0">
      {/* Header - Always flex row - KEEPING ORIGINAL BUTTON SIZE */}
      <div className="flex flex-row items-center justify-between gap-3 mb-6 min-w-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex-1 min-w-0 truncate ml-12 md:0">Sales</h1>
        <button
          onClick={() => setShowStartModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-3 sm:px-4 md:px-5 py-2 rounded-lg font-medium text-sm min-w-0 flex-shrink-0
            shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)] 
            hover:scale-105 transition-all duration-200 whitespace-nowrap"
        >
          <FaPlus className="flex-shrink-0 text-xs sm:text-sm" /> 
          <span className="truncate">Start Sale</span>
        </button>
      </div>

      {/* Product Cards - Fixed for 300px */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 min-w-0">
        {saleProducts.map((item) => {
          const { status, discountedPrice } = getSaleInfo(item);
          
          return (
            <div
              key={item.id}
              className="rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 min-w-0 overflow-hidden
                bg-white/80 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
                hover:border-blue-200/60 hover:scale-[1.02]"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-28 sm:h-32 md:h-36 object-cover min-w-0"
                />
              ) : (
                <div className="w-full h-28 sm:h-32 md:h-36 bg-gray-100/60 flex items-center justify-center text-gray-400 backdrop-blur-sm text-xs min-w-0">
                  No Image
                </div>
              )}
              
              {/* Sale Status Badge */}
              <span className={`absolute top-1 left-1 px-1.5 py-0.5 text-[10px] xs:text-xs font-semibold rounded ${getStatusBadge(status)} min-w-0 truncate max-w-[60px] xs:max-w-[70px]`}>
                {getStatusText(status)}
              </span>
              
              {item.tag && (
                <span className="absolute top-1 right-1 bg-blue-500 text-white px-1.5 py-0.5 text-[10px] xs:text-xs font-semibold rounded min-w-0 max-w-[60px] xs:max-w-[70px] truncate
                  shadow-[1px_1px_4px_rgba(59,130,246,0.3)]">
                  {item.tag}
                </span>
              )}

              <div className="p-2 sm:p-3 min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm truncate text-gray-900 min-w-0">{item.name}</h3>
                
                {/* Price Display */}
                <div className="mt-1 sm:mt-2 min-w-0">
                  {status === "active" ? (
                    <>
                      <p className="text-red-600 text-xs sm:text-sm font-bold min-w-0">
                        {item.rate}% OFF
                      </p>
                      <p className="text-gray-800 font-bold text-xs sm:text-sm min-w-0">
                        QAR {discountedPrice.toFixed(2)}
                      </p>
                      <p className="text-gray-500 text-[10px] sm:text-xs line-through min-w-0">
                        QAR {item.price}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-800 font-bold text-xs sm:text-sm min-w-0">QAR {item.price}</p>
                  )}
                </div>

                {/* Sale Dates */}
                {item.rate > 0 && (
                  <div className="mt-1 text-[10px] xs:text-xs text-gray-600 space-y-0.5 min-w-0">
                    {item.fromDate && (
                      <p className="truncate min-w-0">From: {formatDate(item.fromDate)}</p>
                    )}
                    {item.toDate && (
                      <p className="truncate min-w-0">To: {formatDate(item.toDate)}</p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleEditProduct(item)}
                  className="mt-2 bg-blue-500 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1 w-full justify-center transition-all duration-200 min-w-0
                    shadow-[2px_2px_5px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_8px_rgba(59,130,246,0.4)]"
                >
                  <FaEdit className="flex-shrink-0 text-xs" /> 
                  <span className="truncate">Edit Sale</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Sale Card */}
        <div
          className="rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 h-28 sm:h-32 md:h-36 flex flex-col items-center justify-center min-w-0
            bg-white/60 backdrop-blur-lg border border-dashed border-gray-300/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
            hover:border-blue-200/60 hover:scale-[1.02]"
          onClick={() => setShowStartModal(true)}
        >
          <FaPlus className="text-xl sm:text-2xl text-gray-400 mb-1 flex-shrink-0" />
          <span className="text-gray-500 text-xs sm:text-sm min-w-0 text-center px-1">Add Sale</span>
        </div>
      </div>

      {/* Start Sale Modal - Fixed for 300px */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start p-1 sm:p-3 md:p-4 overflow-auto z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-lg sm:rounded-xl w-full max-w-[calc(100vw-8px)] sm:max-w-2xl md:max-w-4xl p-2 sm:p-4 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] relative border border-gray-200/60 my-auto mx-1 min-w-0">
            <button
              className="absolute top-1 right-1 sm:top-3 sm:right-3 md:top-4 md:right-4 text-gray-800 hover:text-red-500 transition-colors p-1.5 sm:p-2 rounded-lg flex-shrink-0
                bg-white/80 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
              onClick={() => setShowStartModal(false)}
            >
              <FaTimes className="text-sm sm:text-base flex-shrink-0" />
            </button>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-4 md:mb-6 border-b border-gray-200/60 pb-2 sm:pb-3 min-w-0 truncate pr-8">
              Start Sale
            </h2>

            {/* Responsive Product Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 max-h-48 sm:max-h-56 md:max-h-64 overflow-y-auto p-1 min-w-0">
              {saleProducts.map((item) => {
                const { status } = getSaleInfo(item);
                return (
                  <div
                    key={item.id}
                    className="rounded-lg overflow-hidden relative border border-gray-200/60 p-1 sm:p-1.5 min-w-0
                      bg-white/80 backdrop-blur-lg
                      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
                  >
                    {item.tag && (
                      <span className="absolute top-0.5 left-0.5 bg-blue-500 text-white text-[9px] xs:text-[10px] px-1 py-0.5 rounded font-semibold
                        shadow-[1px_1px_3px_rgba(59,130,246,0.3)] truncate max-w-[50px] xs:max-w-[55px] min-w-0">
                        {item.tag}
                      </span>
                    )}
                    <span className={`absolute top-0.5 right-0.5 px-1 py-0.5 text-[9px] xs:text-[10px] rounded ${getStatusBadge(status)} truncate max-w-[50px] xs:max-w-[55px] min-w-0`}>
                      {getStatusText(status)}
                    </span>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 sm:h-18 md:h-20 w-full object-cover rounded min-w-0"
                    />
                    <div className="p-1 text-[10px] xs:text-xs flex flex-col gap-0.5 min-w-0">
                      <p className="font-medium truncate text-gray-900 min-w-0">{item.name}</p>
                      <div className="flex justify-between text-[10px] mt-0.5 min-w-0">
                        <span className="text-red-600 font-bold min-w-0">{item.rate}%</span>
                        <span className="font-bold text-gray-800 min-w-0">
                          QAR {item.price}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 min-w-0">
                        <label className="text-[10px] font-medium text-gray-700 min-w-0">Rate:</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.rate}
                          onChange={(e) =>
                            handleRateChange(item.id, e.target.value)
                          }
                          className="border border-gray-300/60 rounded px-1 py-0.5 w-8 xs:w-9 sm:w-10 text-[10px] bg-white/80 backdrop-blur-sm min-w-0
                            focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* "Is this product in sale?" Text */}
            <div className="mt-2 sm:mt-3 md:mt-4 mb-1 sm:mb-2 min-w-0">
              <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 text-center min-w-0 px-1">
                Is this product in sale?
              </p>
            </div>

            <div className="mt-2 sm:mt-3 grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-lg border border-gray-200/60 min-w-0
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
              <div className="min-w-0">
                <label className="font-medium text-gray-700 text-xs sm:text-sm min-w-0">From Date</label>
                <input
                  type="date"
                  className="border border-gray-300/60 p-1.5 sm:p-2 rounded-lg w-full mt-1 bg-white/80 backdrop-blur-sm text-xs sm:text-sm min-w-0
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={bulkFromDate}
                  onChange={(e) => setBulkFromDate(e.target.value)}
                />
              </div>
              <div className="min-w-0">
                <label className="font-medium text-gray-700 text-xs sm:text-sm min-w-0">To Date</label>
                <input
                  type="date"
                  className="border border-gray-300/60 p-1.5 sm:p-2 rounded-lg w-full mt-1 bg-white/80 backdrop-blur-sm text-xs sm:text-sm min-w-0
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={bulkToDate}
                  onChange={(e) => setBulkToDate(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handlePublishSales}
              className="mt-2 sm:mt-3 md:mt-4 bg-blue-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base w-full min-w-0
                shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)] 
                hover:scale-105 transition-all duration-200"
            >
              Publish Sales
            </button>
          </div>
        </div>
      )}

      {/* Edit Sale Modal - Fixed for 300px */}
      {showEditModal && selectedEditProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start p-1 sm:p-3 md:p-4 overflow-auto z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-lg sm:rounded-xl w-full max-w-[calc(100vw-8px)] sm:max-w-sm md:max-w-md p-2 sm:p-4 md:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] relative border border-gray-200/60 my-auto mx-1 min-w-0">
            <button
              className="absolute top-1 right-1 sm:top-3 sm:right-3 md:top-4 md:right-4 text-gray-800 hover:text-red-500 transition-colors p-1.5 sm:p-2 rounded-lg flex-shrink-0
                bg-white/80 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
              onClick={() => setShowEditModal(false)}
            >
              <FaTimes className="text-sm sm:text-base flex-shrink-0" />
            </button>

            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 border-b border-gray-200/60 pb-2 sm:pb-3 min-w-0 truncate pr-8">
              Edit Sale
            </h2>

            <div className="border border-gray-200/60 rounded-lg shadow overflow-hidden mb-2 sm:mb-3 relative min-w-0
              bg-white/80 backdrop-blur-lg">
              {selectedEditProduct.tag && (
                <span className="absolute top-1 left-1 bg-blue-500 text-white px-1.5 py-0.5 text-[10px] xs:text-xs rounded font-semibold min-w-0 max-w-[80px] truncate
                  shadow-[1px_1px_3px_rgba(59,130,246,0.3)]">
                  {selectedEditProduct.tag}
                </span>
              )}
              <img
                src={selectedEditProduct.image}
                className="h-20 sm:h-24 md:h-28 w-full object-cover min-w-0"
                alt={selectedEditProduct.name}
              />
              <div className="p-1.5 sm:p-2 md:p-3 min-w-0">
                <p className="font-medium text-gray-900 text-xs sm:text-sm truncate min-w-0">{selectedEditProduct.name}</p>
                <p className="text-red-600 font-bold text-[10px] xs:text-xs min-w-0">
                  {selectedEditProduct.rate}% Sale
                </p>
              </div>
            </div>

            {/* Edit Inputs */}
            <div className="space-y-2 sm:space-y-3 bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 md:p-3 rounded-lg border border-gray-200/60 min-w-0
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
              <div className="min-w-0">
                <label className="font-medium block mb-1 sm:mb-2 text-gray-700 text-xs sm:text-sm min-w-0">Sale Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="border border-gray-300/60 p-1.5 sm:p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm text-xs sm:text-sm min-w-0
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
              
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 min-w-0">
                <div className="min-w-0">
                  <label className="font-medium block mb-1 sm:mb-2 text-gray-700 text-xs sm:text-sm min-w-0">From Date</label>
                  <input
                    type="date"
                    className="border border-gray-300/60 p-1.5 sm:p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm text-xs sm:text-sm min-w-0
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
                <div className="min-w-0">
                  <label className="font-medium block mb-1 sm:mb-2 text-gray-700 text-xs sm:text-sm min-w-0">To Date</label>
                  <input
                    type="date"
                    className="border border-gray-300/60 p-1.5 sm:p-2 rounded-lg w-full bg-white/80 backdrop-blur-sm text-xs sm:text-sm min-w-0
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
              
              <div className="flex items-center gap-2 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedEditProduct.rate === 0}
                  onChange={(e) =>
                    setSelectedEditProduct({
                      ...selectedEditProduct,
                      rate: e.target.checked ? 0 : selectedEditProduct.rate,
                    })
                  }
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20 flex-shrink-0"
                />
                <span className="text-xs sm:text-sm text-gray-700 min-w-0">End Sale (set rate to 0%)</span>
              </div>
            </div>

            <div className="mt-2 sm:mt-3 md:mt-4 flex gap-2 sm:gap-3 md:gap-4 flex-col sm:flex-row min-w-0">
              <button
                className="bg-blue-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base flex-1 min-w-0
                  shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)] 
                  hover:scale-105 transition-all duration-200"
                onClick={handlePublishEdit}
              >
                Publish Changes
              </button>
              <button
                className="bg-gray-400/60 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-semibold backdrop-blur-sm text-xs sm:text-sm md:text-base flex-1 min-w-0
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
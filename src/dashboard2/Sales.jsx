import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaTimes, FaEdit } from "react-icons/fa";
import { addSalesProduct } from "../api";


export default function Sales({ products }) {
  const [saleProducts, setSaleProducts] = useState([]);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);

  const [bulkFromDate, setBulkFromDate] = useState("");
  const [bulkToDate, setBulkToDate] = useState("");

  /** Load products into saleProducts */
  useEffect(() => {
    if (!products) return;
    setSaleProducts(
      products.map((p) => ({
        ...p,
        rate: p.rate ?? 0,
        fromDate: p.fromDate ?? "",
        toDate: p.toDate ?? "",
      }))
    );
  }, [products]);


  const saveSaleToApi = async (product) => {
  if (!product.rate || !product.fromDate || !product.toDate) return;

  try {
    await addSalesProduct(product.id, {
      discount: product.rate,
      discount_from: product.fromDate,
      discount_to: product.toDate,
    });

    console.log("✅ Sale saved for product:", product.id);
  } catch (err) {
    console.error("❌ Sale API failed:", err);
    alert(`Failed to save sale for ${product.name}`);
  }
};


  /** Helpers */
  const getSaleInfo = useCallback((product) => {
    const today = new Date();
    const from = product.fromDate ? new Date(product.fromDate) : null;
    const to = product.toDate ? new Date(product.toDate) : null;

    let status = "not-active";
    let discountedPrice = product.price;

    if (product.rate > 0 && from && to) {
      if (today >= from && today <= to) {
        status = "active";
        discountedPrice = product.price - (product.price * product.rate) / 100;
      } else if (today < from) {
        status = "upcoming";
      } else if (today > to) {
        status = "ended";
      }
    }

    return { status, discountedPrice };
  }, []);

  const formatDate = (d) =>
    !d ? "" : new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const statusColor = {
    active: "bg-green-100 text-green-800",
    upcoming: "bg-blue-100 text-blue-800",
    ended: "bg-red-100 text-red-800",
    "not-active": "bg-gray-100 text-gray-800",
  };

  const statusText = {
    active: "Active",
    upcoming: "Upcoming",
    ended: "Ended",
    "not-active": "No Sale",
  };

  const handleRateChange = (id, value) => {
    setSaleProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rate: Number(value) } : p))
    );
  };

  /** Publish bulk sale */
 const handlePublishSales = async () => {
  if (!bulkFromDate || !bulkToDate)
    return alert("Select both dates");

  if (new Date(bulkFromDate) >= new Date(bulkToDate))
    return alert("End date must be after start date");

  // 🔥 SAVE TO API
  for (const product of saleProducts) {
    if (product.rate > 0) {
      await saveSaleToApi({
        ...product,
        fromDate: bulkFromDate,
        toDate: bulkToDate,
      });
    }
  }

  // 🔄 Update UI
  setSaleProducts((prev) =>
    prev.map((p) => ({
      ...p,
      fromDate: bulkFromDate,
      toDate: bulkToDate,
    }))
  );

  setShowStartModal(false);
};


  /** Open edit modal */
  const handleEditProduct = (product) => {
    setSelectedEditProduct({ ...product });
    setShowEditModal(true);
  };

  /** Publish edit */
  const handlePublishEdit = async () => {
  const p = selectedEditProduct;

  if (p.fromDate && p.toDate) {
    if (new Date(p.fromDate) >= new Date(p.toDate)) {
      return alert("End date must be after start date");
    }
  }

  // 🔥 SAVE TO API
  await saveSaleToApi(p);

  // 🔄 Update UI
  setSaleProducts((prev) =>
    prev.map((item) =>
      item.id === p.id ? { ...p } : item
    )
  );

  setShowEditModal(false);
  setSelectedEditProduct(null);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-2 sm:p-4 md:p-6 overflow-x-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 ml-12">Sales</h1>

        <button
          onClick={() => setShowStartModal(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-all"
        >
          <FaPlus className="text-sm" />
          Start Sale
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {saleProducts.map((item) => {
          const { status, discountedPrice } = getSaleInfo(item);

          return (
            <div
              key={item.id}
              className="rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200 shadow hover:scale-[1.02] transition-all relative"
            >
              {/* Image */}
              {item.image ? (
                <img src={item.image} className="w-full h-32 object-cover" alt="" />
              ) : (
                <div className="w-full h-32 flex items-center justify-center text-gray-400 bg-gray-100">
                  No image
                </div>
              )}

              {/* Status */}
              <span
                className={`absolute top-1 left-1 px-2 py-0.5 text-[10px] font-semibold rounded ${statusColor[status]}`}
              >
                {statusText[status]}
              </span>

              {/* TAG */}
              {item.tag && (
                <span className="absolute top-1 right-1 bg-blue-500 text-white px-2 py-0.5 text-[10px] rounded">
                  {item.tag}
                </span>
              )}

              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{item.name}</h3>

                {/* Price */}
                <div className="mt-2">
                  {status === "active" ? (
                    <>
                      <p className="text-red-600 text-xs font-bold">{item.rate}% OFF</p>
                      <p className="font-bold text-sm">QAR {discountedPrice.toFixed(2)}</p>
                      <p className="text-gray-500 text-xs line-through">QAR {item.price}</p>
                    </>
                  ) : (
                    <p className="font-bold text-sm">QAR {item.price}</p>
                  )}
                </div>

                {/* Dates */}
                {item.rate > 0 && (
                  <div className="text-[10px] text-gray-600 mt-1">
                    {item.fromDate && <p>From: {formatDate(item.fromDate)}</p>}
                    {item.toDate && <p>To: {formatDate(item.toDate)}</p>}
                  </div>
                )}

                <button
                  onClick={() => handleEditProduct(item)}
                  className="mt-3 bg-blue-500 text-white text-xs px-3 py-2 rounded-lg w-full flex items-center justify-center gap-1 hover:bg-blue-600"
                >
                  <FaEdit className="text-xs" />
                  Edit Sale
                </button>
              </div>
            </div>
          );
        })}

        {/* ADD SALE CARD */}
        <div
          onClick={() => setShowStartModal(true)}
          className="rounded-xl border border-dashed border-gray-300 bg-white/60 flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition-all"
        >
          <FaPlus className="text-2xl text-gray-400 mb-1" />
          <span className="text-gray-500 text-sm">Add Sale</span>
        </div>
      </div>

      {/* START SALE MODAL */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start p-4 overflow-auto z-50">
          <div className="bg-white/90 backdrop-blur-lg border rounded-xl p-4 max-w-3xl w-full relative">

            <button
              onClick={() => setShowStartModal(false)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow"
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-bold mb-4">Start Sale</h2>

            {/* PRODUCTS LIST INSIDE MODAL */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto mb-4">
              {saleProducts.map((item) => {
                const { status } = getSaleInfo(item);

                return (
                  <div
                    key={item.id}
                    className="border rounded-lg p-2 relative bg-white shadow"
                  >
                    <span className={`absolute top-1 right-1 px-2 py-0.5 text-[9px] rounded ${statusColor[status]}`}>
                      {statusText[status]}
                    </span>

                    <img src={item.image} className="w-full h-20 object-cover rounded" />

                    <p className="text-xs font-semibold mt-1 truncate">{item.name}</p>

                    <div className="flex items-center gap-1 text-xs mt-1">
                      <label>Rate:</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="border rounded px-1 py-0.5 w-12 text-[10px]"
                        value={item.rate}
                        onChange={(e) => handleRateChange(item.id, e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DATE SELECT */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-sm font-medium">From Date</label>
                <input
                  type="date"
                  className="border p-2 rounded-lg w-full mt-1"
                  value={bulkFromDate}
                  onChange={(e) => setBulkFromDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">To Date</label>
                <input
                  type="date"
                  className="border p-2 rounded-lg w-full mt-1"
                  value={bulkToDate}
                  onChange={(e) => setBulkToDate(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handlePublishSales}
              className="bg-blue-500 text-white w-full py-2 rounded-lg font-semibold hover:bg-blue-600"
            >
              Publish Sales
            </button>
          </div>
        </div>
      )}

      {/* EDIT SALE MODAL */}
      {showEditModal && selectedEditProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start p-4 overflow-auto z-50">
          <div className="bg-white/90 backdrop-blur-lg border rounded-xl p-4 max-w-sm w-full relative">

            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow"
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-bold mb-4">Edit Sale</h2>

            <img
              src={selectedEditProduct.image}
              className="w-full h-24 object-cover rounded mb-2"
              alt=""
            />

            <p className="font-medium">{selectedEditProduct.name}</p>

            {/* RATE */}
            <div className="mt-3">
              <label>Sale Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="border p-2 rounded w-full mt-1"
                value={selectedEditProduct.rate}
                onChange={(e) =>
                  setSelectedEditProduct({
                    ...selectedEditProduct,
                    rate: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* DATES */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label>From</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full mt-1"
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
                <label>To</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full mt-1"
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

            {/* END SALE CHECKBOX */}
            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={selectedEditProduct.rate === 0}
                onChange={(e) =>
                  setSelectedEditProduct({
                    ...selectedEditProduct,
                    rate: e.target.checked ? 0 : selectedEditProduct.rate,
                  })
                }
              />
              <span>End sale (set rate to 0%)</span>
            </div>

            {/* BUTTONS */}
            <button
              onClick={handlePublishEdit}
              className="bg-blue-500 text-white w-full py-2 rounded-lg mt-4"
            >
              Publish Changes
            </button>

            <button
              onClick={() => setShowEditModal(false)}
              className="bg-gray-300 text-gray-800 w-full py-2 rounded-lg mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

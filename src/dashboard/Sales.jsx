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
    setSaleProducts((prev) =>
      prev.map((p) => ({ ...p, fromDate: bulkFromDate, toDate: bulkToDate }))
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
    setSaleProducts((prev) =>
      prev.map((p) =>
        p.id === selectedEditProduct.id ? { ...selectedEditProduct } : p
      )
    );
    setShowEditModal(false);
    setSelectedEditProduct(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Sales</h2>
        <button
          onClick={() => setShowStartModal(true)}
          className="bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md font-medium flex items-center gap-1"
        >
          <FaPlus /> Start Sale
        </button>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {saleProducts.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition relative"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            {item.tag && (
              <span className="absolute top-2 left-2 bg-blue-700 text-white px-2 py-1 text-xs font-semibold rounded">
                {item.tag}
              </span>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-sm truncate">{item.name}</h3>
              <p className="text-gray-600 text-sm">Price: QAR {item.price}</p>
              {item.oldPrice && (
                <p className="text-gray-600 text-sm line-through">
                  QAR {item.oldPrice}
                </p>
              )}
              <p className="text-red-600 text-sm font-bold">{item.rate}% Sale</p>

              <button
                onClick={() => handleEditProduct(item)}
                className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
              >
                <FaEdit size={12} /> Edit
              </button>
            </div>
          </div>
        ))}

        {/* Add Sale Card */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
          onClick={() => setShowStartModal(true)}
        >
          <FaPlus className="text-3xl text-gray-400 mb-2" />
          <span className="text-gray-500">Add Sale</span>
        </div>
      </div>

      {/* Start Sale Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm p-4 z-50 overflow-auto">
          <div className="bg-[#d2d4ce] rounded-lg w-full max-w-5xl p-6 shadow-2xl relative">
            <button
              className="absolute top-4 right-6 text-gray-800"
              onClick={() => setShowStartModal(false)}
            >
              <FaTimes size={22} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Start Sale
            </h2>

            <div className="grid grid-cols-3 gap-4 h-72 overflow-y-auto p-2">
              {saleProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow overflow-hidden relative border p-2"
                >
                  {item.tag && (
                    <span className="absolute top-1 left-1 bg-blue-700 text-white text-xs px-1 py-0.5 rounded font-semibold">
                      {item.tag}
                    </span>
                  )}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-2 text-sm flex flex-col gap-1">
                    <p className="font-medium truncate">{item.name}</p>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-red-600 font-bold">{item.rate}%</span>
                      {item.oldPrice && (
                        <span className="line-through text-gray-500">
                          QAR {item.oldPrice}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-gray-800 text-sm">
                      QAR {item.price}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <label className="text-xs font-medium">Rate:</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={item.rate}
                        onChange={(e) =>
                          handleRateChange(item.id, e.target.value)
                        }
                        className="border rounded px-1 w-16 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow">
              <div>
                <label className="font-medium">From</label>
                <input
                  type="date"
                  className="border p-2 rounded ml-2"
                  value={bulkFromDate}
                  onChange={(e) => setBulkFromDate(e.target.value)}
                />
              </div>
              <div>
                <label className="font-medium">To</label>
                <input
                  type="date"
                  className="border p-2 rounded ml-2"
                  value={bulkToDate}
                  onChange={(e) => setBulkToDate(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handlePublishSales}
              className="mt-6 bg-blue-700 text-white px-6 py-2 rounded shadow font-semibold"
            >
              Publish Sales
            </button>
          </div>
        </div>
      )}

      {/* Edit Sale Modal */}
      {showEditModal && selectedEditProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm p-4 z-50">
          <div className="bg-[#d2d4ce] rounded-lg w-full max-w-lg p-6 shadow-2xl relative">
            <button
              className="absolute top-4 right-6 text-gray-800"
              onClick={() => setShowEditModal(false)}
            >
              <FaTimes size={22} />
            </button>

            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Edit Sale
            </h2>

            <div className="bg-white border rounded-lg shadow overflow-hidden mb-4 relative">
              {selectedEditProduct.tag && (
                <span className="absolute top-2 left-2 bg-blue-700 text-white px-2 py-1 text-xs rounded font-semibold">
                  {selectedEditProduct.tag}
                </span>
              )}
              <img
                src={selectedEditProduct.image}
                className="h-48 w-full object-cover"
              />
              <div className="p-2 text-sm">
                <p className="font-medium">{selectedEditProduct.name}</p>
                <p className="text-red-600 font-bold text-sm">
                  {selectedEditProduct.rate}% Sale
                </p>
              </div>
            </div>

            {/* Edit Inputs */}
            <div className="grid grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow">
              <div>
                <label className="font-medium">Sale Rate</label>
                <input
                  type="number"
                  className="border p-2 rounded w-24 ml-2"
                  value={selectedEditProduct.rate}
                  onChange={(e) =>
                    setSelectedEditProduct({
                      ...selectedEditProduct,
                      rate: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="font-medium">From</label>
                <input
                  type="date"
                  className="border p-2 rounded ml-2"
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
                <label className="font-medium">To</label>
                <input
                  type="date"
                  className="border p-2 rounded ml-2"
                  value={selectedEditProduct.toDate || ""}
                  onChange={(e) =>
                    setSelectedEditProduct({
                      ...selectedEditProduct,
                      toDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
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
                <span>End Sale</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                className="bg-blue-700 text-white px-6 py-2 rounded shadow font-semibold"
                onClick={handlePublishEdit}
              >
                Publish Changes
              </button>
              <button
                className="bg-gray-400 px-6 py-2 rounded shadow"
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

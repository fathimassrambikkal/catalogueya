import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaUpload } from "react-icons/fa";
import Cover from "./Cover";

export default function Products({ products, setProducts, editingProduct, setEditingProduct }) {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    description: "",
    tag: "",
    image: "",
    media: [],
  });

 
  useEffect(() => {
    if (!editingProduct) return;

    if (editingProduct.id) {
 
      setFormData({
        id: editingProduct.id,
        name: editingProduct.name || "",
        price: editingProduct.price || "",
        stock: editingProduct.stock || "",
        description: editingProduct.description || "",
        tag: editingProduct.tag || "",
        image: editingProduct.image || "",
        media: editingProduct.media ? [...editingProduct.media] : [],
      });
    } else {
      // Adding new product
      setFormData({
        id: null,
        name: "",
        price: "",
        stock: "",
        description: "",
        tag: "",
        image: "",
        media: [],
      });
    }
  }, [editingProduct]);

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
      // Update existing product
      setProducts((prev) =>
        prev.map((p) => (p.id === cleaned.id ? { ...p, ...cleaned } : p))
      );
    } else {
      // Add new product
      const newProd = { ...cleaned, id: Date.now(), image: cleaned.image || "" };
      setProducts((prev) => [...prev, newProd]);
    }

    setEditingProduct(null); // close modal
  };

  const handleDeleteProduct = () => {
    if (formData.id) {
      setProducts((prev) => prev.filter((p) => p.id !== formData.id));
    }
    setEditingProduct(null);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleMediaFiles = async (files) => {
    if (!files || files.length === 0) return;

    const newItems = await Promise.all(
      Array.from(files).map(async (file, idx) => {
        const type = file.type.startsWith("video") ? "video" : "image";
        const url = await fileToBase64(file);
        return {
          id: Date.now() + Math.random() + idx,
          title: file.name || `Upload ${idx + 1}`,
          type,
          status: "ok",
          file,
          url,
        };
      })
    );

    setFormData((prev) => ({ ...prev, media: [...prev.media, ...newItems] }));
  };

  const handleRemoveMedia = (id) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m.id !== id),
    }));
  };

  const pickFirstMediaAsImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: prev.media.length ? prev.media[0].url || "" : "",
    }));
  };

  return (
    <div className="w-full px-4 md:px-8 ">
      {/* <Cover  /> */}

      {/* Header with Top-right Add Button */}
      <div className="flex items-center justify-between mb-6 mt-10">
        <h2 className="text-lg font-semibold text-gray-700">Our Products</h2>
        <button
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-md"
          onClick={() => setEditingProduct({})} // Open modal for new product
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white shadow-sm rounded-xl p-4 border hover:shadow-md transition">
            {p.tag && (
              <div className="inline-block mb-2 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-md">
                {p.tag}
              </div>
            )}
            {p.image ? (
              <img src={p.image} className="w-full h-32 object-cover rounded-md mb-3" alt={p.name} />
            ) : (
              <div className="w-full h-32 rounded-md mb-3 bg-gray-50 border flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
            <h3 className="font-semibold text-[17px]">{p.name}</h3>
            <p className="text-sm text-gray-600">Price: QAR {p.price}</p>
            <p className="text-sm text-gray-600">Stock: {p.stock}</p>

            <div className="mt-3 flex gap-3">
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800" onClick={() => setEditingProduct(p)}>
                <FaEdit /> Edit
              </button>
              <button className="flex items-center gap-2 text-red-600 hover:text-red-800" onClick={() => setProducts((prev) => prev.filter((prod) => prod.id !== p.id))}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        {/* Add Product Card */}
        <div
          className="bg-white shadow-sm rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-md border border-dashed border-gray-300 transition"
          onClick={() => setEditingProduct({})}
        >
          <FaPlus className="text-3xl text-gray-400 mb-2" />
          <span className="text-gray-600 font-medium">Add Product</span>
        </div>
      </div>

      {/* Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start py-10 overflow-auto z-50">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-blue-800 text-white px-6 py-4 flex justify-between">
              <h2 className="text-lg font-semibold">{formData.id ? "Edit Product" : "Add Product"}</h2>
              <button className="text-white text-xl" onClick={() => setEditingProduct(null)}>×</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Upload Area */}
              <div className="bg-white border rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Upload Images / Videos</h3>
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center text-gray-500 cursor-pointer hover:bg-gray-50">
                  <FaUpload className="text-2xl mb-2" />
                  <span>Upload from Files</span>
                  <input type="file" className="hidden" onChange={(e) => handleMediaFiles(e.target.files)} multiple accept="image/*,video/*" />
                </label>

                <div className="mt-4 space-y-3">
                  {formData.media.map((m) => (
                    <div key={m.id} className={`flex justify-between items-center p-3 rounded-md border ${m.status === "error" ? "bg-red-100 border-red-300" : "bg-blue-100 border-blue-300"}`}>
                      <div className="flex items-center gap-3">
                        {m.type === "image" ? (
                          <img src={m.url} alt={m.title} className="w-12 h-8 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-8 flex items-center justify-center bg-gray-100 rounded text-xs">VIDEO</div>
                        )}
                        <span className="truncate max-w-xs">{m.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {m.status === "ok" ? <FaCheck className="text-green-600" /> : <FaTimes className="text-red-600" />}
                        <button className="text-gray-700" onClick={() => handleRemoveMedia(m.id)}><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-2">
                    <button type="button" className="px-3 py-1 rounded bg-gray-100 border text-sm" onClick={pickFirstMediaAsImage} disabled={formData.media.length === 0}>
                      Use first media as product image
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-white border rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-semibold">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="font-medium mb-1 block">Product Title <span className="text-red-500">*</span></label>
                    <input className="border p-2 rounded-md w-full" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="font-medium mb-1 block">Product Price (QAR)</label>
                    <input className="border p-2 rounded-md w-full" type="number" value={formData.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-medium mb-1 block">Product Description</label>
                    <textarea className="border p-2 rounded-md w-full h-24" value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Tags & Stock */}
              <div className="bg-white border rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-semibold">Product Tags & Stock</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="font-medium mb-1 block">Special Mark</label>
                    <select className="border p-2 rounded-md w-full" value={formData.tag} onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}>
                      <option value="">Choose from the list</option>
                      <option value="New Arrival">New Arrival</option>
                      <option value="Limited Edition">Limited Edition</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Low in Stock">Low in Stock</option>
                      <option value="Out in Stock">Out in Stock</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-medium mb-1 block">Number of Current Stock</label>
                    <input className="border p-2 rounded-md w-full" type="number" value={formData.stock} onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-4 px-6 py-4 bg-gray-50 border-t">
              <button className="px-6 py-2 rounded-md bg-gray-300" onClick={handleDeleteProduct}>Delete</button>
              <button className="px-6 py-2 rounded-md bg-blue-700 text-white" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

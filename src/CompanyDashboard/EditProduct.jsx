import React from "react";

const EditProduct = ({ product, setEditingProduct }) => {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Edit Product</h2>
        <button
          onClick={() => setEditingProduct(null)}
          className="text-gray-600 hover:text-black"
        >
          Back
        </button>
      </div>

      {/* GENERAL INFO */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">General Information</h3>

        <div className="flex flex-col gap-3">
          <input
            className="border rounded-md p-3"
            defaultValue={product.name}
            placeholder="Product Name"
          />

          <textarea
            className="border rounded-md p-3 h-32"
            placeholder="Description"
          ></textarea>
        </div>
      </div>

      {/* PRICING */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Pricing</h3>

        <input
          className="border rounded-md p-3 w-44"
          defaultValue={product.price}
        />
      </div>

      {/* SAVE BUTTON */}
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
        Save Product
      </button>
    </div>
  );
};

export default EditProduct;

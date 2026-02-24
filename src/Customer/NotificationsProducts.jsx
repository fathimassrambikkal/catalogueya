import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

/**
 * URL param (type) → backend API type
 */
const CATEGORY_TO_API_TYPE = {
  best_sellers: "best_seller",
  limited_stocks: "limited_edition",
  low_in_stock: "low_in_stock",
  out_of_stock: "out_of_stock",
  on_sales: "sales",
  new_arrivals: "new_arrivel",
};

const NotificationsProducts = () => {
  const { type, companyId } = useParams();
  const apiType = CATEGORY_TO_API_TYPE[type];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    if (!apiType || !companyId) {
      setError("Invalid product category or company ID");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(
          `${BASE_URL}/en/api/company/products/${apiType}/${companyId}`,
          { 
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            }
          }
        );

        const text = await res.text();

        if (!res.ok || text.startsWith("<!DOCTYPE") || text.startsWith("<")) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        let jsonData;
        try {
          jsonData = JSON.parse(text);
        } catch (parseError) {
          throw new Error("Invalid JSON response from API");
        }

        // Handle response formats
        if (Array.isArray(jsonData)) {
          setProducts(jsonData);
        } else if (jsonData?.data) {
          setProducts(Array.isArray(jsonData.data) ? jsonData.data : [jsonData.data]);
        } else {
          setProducts([]);
        }

        // Fetch company name
        if (companyId) {
          try {
            const companyRes = await fetch(
              `${BASE_URL}/en/api/companies/${companyId}`,
              { signal: controller.signal }
            );
            if (companyRes.ok) {
              const companyData = await companyRes.json();
              setCompanyName(companyData?.name || companyData?.data?.name || "");
            }
          } catch (companyErr) {
            console.log("Could not fetch company info:", companyErr);
          }
        }

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setError(err.message || "Failed to load products.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [type, companyId, apiType]);

  const getPageTitle = (type) => {
    const titles = {
      best_sellers: "Best Sellers",
      limited_stocks: "Limited Stocks",
      low_in_stock: "Low Stock",
      out_of_stock: "Out of Stock",
      on_sales: "On Sale",
      new_arrivals: "New Arrivals",
    };
    return titles[type] || "Products";
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount || discount <= 0) return null;
    const originalPrice = parseFloat(price);
    return (originalPrice * (1 - discount / 100)).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Products</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pageTitle = getPageTitle(type);

return (
  <div className="min-h-screen mt-14 ">
    <div className="max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">

      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-4">
              {pageTitle}
            </h1>
            {companyName && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Company: <span className="font-medium">{companyName}</span>
              </p>
            )}
          </div>

        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl text-gray-400">📦</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900">
            No Products Found
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4">
          {products.map((product) => {
            let image = null;
            try {
              image =
                typeof product.image === "string"
                  ? JSON.parse(product.image)
                  : product.image;
            } catch {
              image = product.image;
            }

            const imgUrl =
              image?.webp || image?.avif
                ? `${BASE_URL}/${image.webp || image.avif}`
                : null;

            const discountedPrice = calculateDiscountedPrice(
              product.price,
              product.discount
            );

            const quantity = parseInt(product.quantity) || 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition"
              >
                {/* Smaller Image for Desktop */}
                <div className="relative aspect-square bg-gray-100 md:aspect-[4/3] lg:aspect-[1/1]">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={product.name_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">
                      📦
                    </div>
                  )}

                  {product.discount > 0 && (
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] sm:text-[10px] font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-2 space-y-1">
                  <h3 className="text-[12px] sm:text-sm font-semibold text-gray-900 truncate">
                    {product.name_en}
                  </h3>

                  <div className="flex items-center gap-1.5">
                    {discountedPrice ? (
                      <>
                        <span className="text-[12px] sm:text-sm font-bold text-gray-900">
                          ₹{discountedPrice}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                          ₹{product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-[12px] sm:text-sm font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  {/* Rating Left - Stock Right */}
                  <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-gray-500">
                    <div>
                      {product.rating && (
                        <span>
                          {parseFloat(product.rating).toFixed(1)} (
                          {product.number_of_reviews || 0})
                        </span>
                      )}
                    </div>
                    <div>
                      Stock: {quantity}
                    </div>
                  </div>

                  {product.sales_count > 0 && (
                    <div className="text-[10px] sm:text-[11px] text-gray-400">
                      Sold: {product.sales_count}
                    </div>
                  )}

                  {product.discount_from && product.discount_to && (
                    <div className="pt-1 border-t text-[9px] text-gray-400">
                      {new Date(product.discount_from).toLocaleDateString()} -{" "}
                      {new Date(product.discount_to).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);
};

export default NotificationsProducts;
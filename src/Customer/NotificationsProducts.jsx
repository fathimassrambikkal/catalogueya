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
    <div className="min-h-screen  mt-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
              {companyName && (
                <p className="text-gray-600 mt-2">
                  Company: <span className="font-semibold">{companyName}</span>
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-400">📦</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              No {pageTitle.toLowerCase()} for this company.
            </p>
            <Link
              to="/notifications"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Notifications
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              // Parse image from backend
              let image = null;
              try {
                image = typeof product.image === "string"
                  ? JSON.parse(product.image)
                  : product.image;
              } catch {
                image = product.image;
              }

              const imgUrl = image?.webp || image?.avif
                ? `${BASE_URL}/${image.webp || image.avif}`
                : null;

              // Calculate discounted price
              const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
              
              // Get quantity
              const quantity = parseInt(product.quantity) || 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={product.name_en}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex flex-col items-center justify-center">
                              <span class="text-3xl text-gray-300 mb-2">📦</span>
                              <span class="text-gray-400 text-sm">${product.name_en?.substring(0, 15) || 'Product'}</span>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <span className="text-3xl text-gray-300 mb-2">📦</span>
                        <span className="text-gray-400 text-sm">{product.name_en?.substring(0, 15) || 'Product'}</span>
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {product.discount && product.discount > 0 && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {product.name_en}
                    </h3>
                    
                    {product.name_ar && (
                      <p className="text-sm text-gray-500 truncate mb-3">{product.name_ar}</p>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      {discountedPrice ? (
                        <>
                          <span className="text-lg font-bold text-gray-900">₹{discountedPrice}</span>
                          <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                      )}
                    </div>
                    
                    {/* Stock Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>Stock: {quantity}</span>
                      {product.sales_count > 0 && (
                        <span>Sold: {product.sales_count}</span>
                      )}
                    </div>
                    
                    {/* Views & Rating */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Views: {product.number_of_viewers || 0}</span>
                      {product.rating && (
                        <span>
                          Rating: {parseFloat(product.rating).toFixed(1)} ({product.number_of_reviews || 0})
                        </span>
                      )}
                    </div>
                    
                    {/* Discount Period */}
                    {product.discount_from && product.discount_to && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Sale: {new Date(product.discount_from).toLocaleDateString()} - {new Date(product.discount_to).toLocaleDateString()}
                        </p>
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
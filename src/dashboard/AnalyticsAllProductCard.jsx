import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFixedWords } from "../hooks/useFixedWords";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "../companyDashboardApi";
import AnalyticsGraph from "./AnalyticsGraph";
import { useEffect, useRef } from "react";

// Helper to safely parse image string
const parseImageString = (imgStr) => {
  if (!imgStr) return null;
  try {
    if (imgStr.startsWith('"') || imgStr.startsWith('{')) {
      let parsed = JSON.parse(imgStr);
      if (typeof parsed === 'string' && (parsed.startsWith('{') || parsed.startsWith('"'))) {
        parsed = JSON.parse(parsed);
      }
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed.webp || parsed.avif || parsed.url || null;
      }
      return parsed;
    }
    return imgStr;
  } catch (e) {
    console.error("Error parsing image string", e);
    return imgStr;
  }
};
function AnalyticsAllProductCard({
  range,
  data = [],
  page,
  lastPage,
  setPage,
  onProductClick
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'graph'
  const [sortBy, setSortBy] = useState('views');
  const [sortOrder, setSortOrder] = useState('desc');
  const loaderRef = useRef(null);
 

const { i18n } = useTranslation();
const isRTL = i18n.language === "ar";
  const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};
  // Process and Sort
  const processedProducts = React.useMemo(() => {
    let items = data.map(p => ({
      id: p.id,
      name: p.name_en || p.name || "Product",
      image: getImageUrl(parseImageString(p.image)),
      addedOn: p.added_at ? new Date(p.added_at).toLocaleDateString() : "--",
      views: p.views || 0,
      sold: p.sold || 0,
      fav: p.favoured || p.fav || 0,
      shares: p.shares || 0,
    }));

    // Sort
    items.sort((a, b) => {
      const valA = a[sortBy] || 0;
      const valB = b[sortBy] || 0;
      if (sortOrder === 'asc') return valA - valB;
      return valB - valA;
    });

    return items;
  }, [data, sortBy, sortOrder]);

 

  const handleSortBy = (e) => {
    setSortBy(e.target.value.toLowerCase());
   setPage(1);
  };

  const handleOrderChange = (order) => {
    setSortOrder(order);
    setPage(1);
  };

  /* Custom Tooltip for Graph */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] min-w-[150px]">
          <p className="font-bold text-gray-900 text-xs mb-2 truncate max-w-[200px]">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-[10px] mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-gray-500 capitalize">{entry.name}:</span>
              <span className="font-bold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };


  useEffect(() => {
  if (window.innerWidth >= 640) return; // desktop ignore

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && page < lastPage) {
        setPage((prev) => prev + 1);
      }
    },
    { threshold: 1 }
  );

  if (loaderRef.current) {
    observer.observe(loaderRef.current);
  }

  return () => observer.disconnect();
}, [page, lastPage]);


return (
  <div className="w-full bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden flex flex-col mt-4 xs:mt-6 sm:mt-8">

    {/* Header */}
    <div className="px-3 xs:px-4 sm:px-6 md:px-8 py-4 xs:py-5 sm:py-6 md:py-7 flex flex-col lg:flex-row lg:items-end justify-between gap-4 xs:gap-5 sm:gap-6 md:gap-8 border-b border-gray-100">
      
      {/* Title Section */}
      <div className="space-y-1 xs:space-y-1.5 sm:space-y-2">
        <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
          {fw.products_analytics || "Product's Analytics"}
        </h3>
        <p className="text-[10px] xs:text-xs sm:text-sm text-blue-500">
         {fw.your_top_product || "Your Top Product"}
        </p>
        <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-400">
          {typeof range === "string" ? range : "Custom Range"}
        </p>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 w-full lg:w-auto">

        {/* Sort Order Buttons */}
        <div className="flex rounded-lg xs:rounded-xl border border-gray-200 bg-gray-50 p-0.5 xs:p-1 text-[9px] xs:text-[10px] sm:text-xs font-medium">
          <button
            onClick={() => handleOrderChange('desc')}
            className={`px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-md xs:rounded-lg transition whitespace-nowrap ${
              sortOrder === 'desc'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {fw.highest || "Highest"}
          </button>
          <button
            onClick={() => handleOrderChange('asc')}
            className={`px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-md xs:rounded-lg transition whitespace-nowrap ${
              sortOrder === 'asc'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {fw.lowest || "Lowest"}
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 text-[9px] xs:text-[10px] sm:text-xs text-gray-500">
          <span className="hidden xs:inline">{fw.view || "View"}</span>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 xs:px-3 py-1.5 xs:py-2 outline-none focus:ring-0 text-gray-700 text-[9px] xs:text-[10px] sm:text-xs w-auto"
          >
            <option value="table">{fw.table || "Table"}</option>
            <option value="graph">{fw.graph || "graph"} </option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 text-[9px] xs:text-[10px] sm:text-xs text-gray-500">
          <span className="hidden xs:inline">Sort By</span>
          <select
            value={sortBy}
            onChange={handleSortBy}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 xs:px-3 py-1.5 xs:py-2 outline-none focus:ring-0 text-gray-700 text-[9px] xs:text-[10px] sm:text-xs w-auto"
          >
           <option value="views">{fw.views || "Views"}</option>
          <option value="sold">{fw.sold || "sold"}</option>
          <option value="fav">{fw.favourite || "Favourite"}</option>
          <option value="shares">{fw.shares || "Shares"}</option>
          </select>
        </div>

      </div>
    </div>

    {/* Content */}
    <div className="flex-1 w-full overflow-x-hidden">
      {viewMode === 'table' ? (
        <div className="w-full">
          <table
  dir={isRTL ? "rtl" : "ltr"}
  className="w-full border-collapse table-auto text-left"
>
            
            {/* Desktop Header */}
            <thead className="hidden sm:table-header-group bg-gray-50 border-b border-gray-100">
              <tr className="text-[10px] xs:text-xs uppercase tracking-wide text-gray-400">
                <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 w-8 xs:w-10 sm:w-12  "></th>
                <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4">{fw.product || "Product"}</th>
                <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-right">{fw.views || "Views"}</th>
                <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-right">{fw.sold || "sold"}</th>
                <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-right">{fw.favourite || "Favourite"}</th>
                <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-right">{fw.shares || "Shares"}</th>
                <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-right">{fw.details|| "details"}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {processedProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 xs:py-12 sm:py-16 text-gray-400 text-[10px] xs:text-xs">
                    {fw.no_products_found || "No products found"}
                  </td>
                </tr>
              ) : (
                processedProducts.map((p, index) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/60 transition"
                  >
                    {/* Rank */}
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4 sm:py-5 text-center text-[10px] xs:text-xs sm:text-sm text-gray-400 w-8 xs:w-10 sm:w-12">
                   {index + 1}.
                    </td>

                    {/* Product */}
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4 sm:py-5">
                      <div
  className={`flex items-center gap-3 ${
    isRTL ? "flex-row-reverse justify-start text-right" : "justify-start"
  }`}
>
                        <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-[200px]">
                          {p.name}
                        </span>
                      </div>

                      {/* Mobile Stats Grid - Shows on very small screens */}
                      <div className="grid grid-cols-2 gap-1 xs:gap-1.5 mt-2 xs:mt-3 sm:hidden text-[8px] xs:text-[10px] text-gray-500">
                        <div className="flex items-center gap-1 bg-gray-50/80 px-2 py-1 rounded">
                          <span className="font-medium text-gray-700">{fw.views || "Views"}</span> {p.views}
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50/80 px-2 py-1 rounded">
                          <span className="font-medium text-gray-700">{fw.sold || "sold"}</span> {p.sold}
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50/80 px-2 py-1 rounded">
                          <span className="font-medium text-gray-700">{fw.favourite || "Favourite"}</span> {p.fav}
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50/80 px-2 py-1 rounded">
                          <span className="font-medium text-gray-700">{fw.shares || "Shares"}</span> {p.shares}
                        </div>
                      </div>
                    </td>

                    {/* Desktop Stats Columns */}
                    <td className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4 sm:py-5 text-right text-gray-700 font-medium text-[11px] xs:text-xs sm:text-sm">
                      {p.views}
                    </td>
                    <td className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4 sm:py-5 text-right text-gray-700 font-medium text-[11px] xs:text-xs sm:text-sm">
                      {p.sold}
                    </td>
                    <td className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4 sm:py-5 text-right text-gray-700 font-medium text-[11px] xs:text-xs sm:text-sm">
                      {p.fav}
                    </td>
                    <td className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4 sm:py-5 text-right text-gray-700 font-medium text-[11px] xs:text-xs sm:text-sm">
                      {p.shares}
                    </td>

                    {/* More Details Link */}
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4 sm:py-5 text-right">
                      <button
                        onClick={() => onProductClick(p)}
                        className="text-[9px] xs:text-[10px] sm:text-xs text-blue-500 hover:text-blue-600 transition underline whitespace-nowrap"
                      >
                       {fw.view|| "view"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <AnalyticsGraph data={processedProducts} />
      )}
    </div>

{viewMode === "table" && lastPage > 1 && (
  <div className="hidden sm:flex px-3 xs:px-4 sm:px-6 md:px-8 py-3 xs:py-4 sm:py-5 border-t border-gray-100 justify-center gap-2">
<div className="hidden sm:flex justify-center py-6">
  <div className="flex items-center gap-6 px-6 py-3 rounded-full backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">

    {/* Previous */}
    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white/60 disabled:opacity-30 transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>

    {/* Page Indicator */}
    <span className="text-sm font-medium text-gray-800 tracking-wide">
      {page} / {lastPage}
    </span>

    {/* Next */}
    <button
      disabled={page === lastPage}
      onClick={() => setPage(page + 1)}
      className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white/60 disabled:opacity-30 transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>

  </div>
</div>

  </div>
)}


{/* Mobile Infinite Scroll Loader */}
<div ref={loaderRef} className="sm:hidden h-16 flex items-center justify-center">
  {page < lastPage && (
    <div className="text-xs text-gray-400 animate-pulse">
      Loading more...
    </div>
  )}
</div>
  </div>
);
}

export default AnalyticsAllProductCard;

import React, { useState } from "react";

function Notifications() {
  const [activeView, setActiveView] = useState("main");

  const notifications = [
    { id: 1, name: "Promotions", preview: "You have a new msg", unread: 3, type: "promotions" },
    { id: 2, name: "Low in Stocks", preview: "You have a new msg", unread: 3, type: "lowStock" }
  ];

  const promotions = [
    { id: 1, title: "Product Name", discount: "40%", originalPrice: "QAR 90", salePrice: "QAR 35", description: "Dicribution" },
    { id: 2, title: "Mashatil Discovery", description: "every plants store", price: "QAR 90" },
    { id: 3, title: "Product Name", discount: "40%", originalPrice: "QAR 90", salePrice: "QAR 35", description: "Dicribution" }
  ];

  const lowStockItems = [
    { id: 1, name: "Product Name", stock: "2 items left", discount: "40%", originalPrice: "QAR 90", salePrice: "QAR 35" },
    { id: 2, name: "Product Name", stock: "15 items left", price: "QAR 90" },
    { id: 3, name: "Product Name", stock: "10 items left", discount: "40%", originalPrice: "QAR 90", salePrice: "QAR 35" }
  ];

  /* --------------------------- MAIN VIEW --------------------------- */
  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 w-full overflow-x-hidden">
      <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Notifications</h1>

      <div className="space-y-3 w-full">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => setActiveView(n.type)}
            className="flex items-center p-4 sm:p-6 rounded-xl cursor-pointer transition-all duration-200 
            bg-white/80 backdrop-blur-lg border border-gray-200/60 
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08)]
            hover:border-blue-200/60 hover:scale-[1.02] w-full overflow-hidden"
          >
            <div className="relative flex-shrink-0 mr-3 sm:mr-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 
              rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {n.unread}
              </div>
              {n.unread > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{n.name}</h3>
              <p className="text-gray-600 text-sm truncate">{n.preview}</p>
            </div>

            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );

  /* --------------------------- PROMOTIONS --------------------------- */
  const renderPromotions = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 w-full overflow-x-hidden">
      <div className="w-full">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => setActiveView("main")}
            className="mr-3 p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200 
            bg-white/80 border border-gray-200/60 shadow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Promotions</h1>
        </div>

        {/* Banner */}
        <div className="p-4 sm:p-6 mb-6 bg-white/80 border border-gray-200/60 rounded-xl shadow">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">NEW ARRIVAL</h2>
          <p className="text-gray-600">Latest offers and discounts</p>
        </div>

        <div className="space-y-4">
          {promotions.map((promo) => (
            <div key={promo.id} className="p-4 sm:p-6 rounded-xl bg-white/80 border border-gray-200/60 shadow overflow-hidden">

              <div className="flex items-start gap-4 w-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 border rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400">
                  Img
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{promo.title}</h3>
                    {promo.discount && (
                      <span className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-1 rounded-full whitespace-nowrap">
                        {promo.discount} OFF
                      </span>
                    )}
                  </div>

                  {promo.description && (
                    <p className="text-gray-600 text-sm mb-3 break-words">{promo.description}</p>
                  )}

                  <div className="flex items-center gap-3">
                    {promo.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">{promo.originalPrice}</span>
                    )}
                    <span className="font-bold text-gray-900">{promo.salePrice || promo.price}</span>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* --------------------------- LOW STOCK --------------------------- */
  const renderLowStock = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 w-full overflow-x-hidden">
      <div className="w-full">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => setActiveView("main")}
            className="mr-3 p-2 rounded-xl text-gray-600 hover:text-blue-500 bg-white/80 border border-gray-200/60 shadow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Low In Stock</h1>
        </div>

        <div className="p-4 sm:p-6 mb-6 bg-white/80 border border-gray-200/60 rounded-xl shadow">
          <p className="text-gray-600 text-base">Items that need your attention</p>
        </div>

        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 rounded-xl bg-white/80 border border-gray-200/60 shadow overflow-hidden">

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-50 border border-red-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400">
                  Img
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base truncate">{item.name}</h3>
                  <p className="text-red-500 text-sm font-medium mb-2">{item.stock}</p>

                  {item.discount && (
                    <span className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-1 rounded-full inline-block mb-2">
                      {item.discount} OFF
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    {item.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {item.originalPrice}
                      </span>
                    )}
                    <span className="font-bold text-gray-900">{item.salePrice || item.price}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );

  /* --------------------------- SWITCH VIEW --------------------------- */
  return activeView === "promotions"
    ? renderPromotions()
    : activeView === "lowStock"
    ? renderLowStock()
    : renderMainView();
}

export default Notifications;

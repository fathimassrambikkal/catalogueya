import React, { useState } from 'react'

function Notifications() {
  const [activeView, setActiveView] = useState('main'); // 'main', 'promotions', 'lowStock'

  const notifications = [
    {
      id: 1,
      name: 'Promotions',
      preview: 'You have a new msg',
      unread: 3,
      type: 'promotions'
    },
    {
      id: 2,
      name: 'Low in Stocks',
      preview: 'You have a new msg',
      unread: 3,
      type: 'lowStock'
    }
  ];

  const promotions = [
    {
      id: 1,
      title: 'Product Name',
      discount: '40%',
      originalPrice: 'QAR 90',
      salePrice: 'QAR 35',
      description: 'Dicribution'
    },
    {
      id: 2,
      title: 'Mashatil Discovery',
      description: 'every plants store',
      price: 'QAR 90'
    },
    {
      id: 3,
      title: 'Product Name',
      discount: '40%',
      originalPrice: 'QAR 90',
      salePrice: 'QAR 35',
      description: 'Dicribution'
    }
  ];

  const lowStockItems = [
    {
      id: 1,
      name: 'Product Name',
      stock: '2 items left',
      discount: '40%',
      originalPrice: 'QAR 90',
      salePrice: 'QAR 35'
    },
    {
      id: 2,
      name: 'Product Name',
      stock: '15 items left',
      price: 'QAR 90'
    },
    {
      id: 3,
      name: 'Product Name',
      stock: '10 items left',
      discount: '40%',
      originalPrice: 'QAR 90',
      salePrice: 'QAR 35'
    }
  ];

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Notifications</h1>
      
      <div className="space-y-4 max-w-2xl mx-auto">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            onClick={() => setActiveView(notification.type)}
            className="flex items-center p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
              hover:border-blue-200/60 hover:scale-[1.02]"
          >
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white font-semibold text-sm">
                  {notification.unread}
                </span>
              </div>
              {notification.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{notification.name}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{notification.preview}</p>
            </div>
            <div className="text-blue-500">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPromotions = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setActiveView('main')}
            className="mr-4 p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Promotions</h1>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl mb-6
          bg-white/80 backdrop-blur-lg border border-gray-200/60
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">NEW ARRIVAL</h2>
          <p className="text-gray-600 text-sm sm:text-base">Latest offers and discounts</p>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {promotions.map((promo) => (
            <div key={promo.id} className="p-4 sm:p-6 rounded-2xl
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
              <div className="flex items-start space-x-4 sm:space-x-6">
                {/* Product Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0
                  bg-gray-100/80 border border-gray-200/60
                  shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
                  <span className="text-gray-500 text-xs">Image</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{promo.title}</h3>
                    {promo.discount && (
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg ml-2 flex-shrink-0">
                        {promo.discount} OFF
                      </span>
                    )}
                  </div>
                  
                  {promo.description && (
                    <p className="text-gray-600 text-sm sm:text-base mb-2 sm:mb-3 line-clamp-2">{promo.description}</p>
                  )}
                  
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {promo.originalPrice && (
                      <span className="text-gray-400 line-through text-sm sm:text-base">
                        {promo.originalPrice}
                      </span>
                    )}
                    <span className="font-bold text-gray-900 text-base sm:text-lg">
                      {promo.salePrice || promo.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLowStock = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setActiveView('main')}
            className="mr-4 p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Low In Stock</h1>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl mb-6
          bg-white/80 backdrop-blur-lg border border-gray-200/60
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
          <p className="text-gray-600 text-sm sm:text-base">Items that need your attention</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {lowStockItems.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 rounded-2xl border-l-4 border-red-400
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
              <div className="flex items-start space-x-4 sm:space-x-6">
                {/* Product Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0
                  bg-red-50/80 border border-red-200/60
                  shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
                  <span className="text-gray-500 text-xs">Image</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">{item.name}</h3>
                  <p className="text-red-500 text-sm sm:text-base font-medium mb-2 sm:mb-3">{item.stock}</p>
                  
                  {item.discount && (
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm px-3 py-1 rounded-full shadow-lg mb-2 sm:mb-3 inline-block">
                      {item.discount} OFF
                    </span>
                  )}
                  
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {item.originalPrice && (
                      <span className="text-gray-400 line-through text-sm sm:text-base">
                        {item.originalPrice}
                      </span>
                    )}
                    <span className="font-bold text-gray-900 text-base sm:text-lg">
                      {item.salePrice || item.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render appropriate view based on activeView state
  switch (activeView) {
    case 'promotions':
      return renderPromotions();
    case 'lowStock':
      return renderLowStock();
    default:
      return renderMainView();
  }
}

export default Notifications;
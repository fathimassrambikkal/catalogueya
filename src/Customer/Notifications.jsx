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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 w-full">
      <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Notifications</h1>
      
      <div className="space-y-3 w-full">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            onClick={() => setActiveView(notification.type)}
            className="flex items-center p-4 sm:p-6 rounded-xl cursor-pointer transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
              hover:border-blue-200/60 hover:scale-[1.02] w-full"
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                <span className="text-white font-semibold text-sm">
                  {notification.unread}
                </span>
              </div>
              {notification.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
              )}
            </div>
            <div className="flex-1 min-w-0 mr-2">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{notification.name}</h3>
              <p className="text-gray-600 text-sm truncate">{notification.preview}</p>
            </div>
            <div className="text-blue-500 flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPromotions = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 w-full">
      <div className="w-full">
        <div className="flex items-center mb-4 sm:mb-6">
          <button 
            onClick={() => setActiveView('main')}
            className="mr-3 p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Promotions</h1>
        </div>

        <div className="p-4 sm:p-6 rounded-xl mb-4 sm:mb-6
          bg-white/80 backdrop-blur-lg border border-gray-200/60
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">NEW ARRIVAL</h2>
          <p className="text-gray-600 text-base">Latest offers and discounts</p>
        </div>
        
        <div className="space-y-4">
          {promotions.map((promo) => (
            <div key={promo.id} className="p-4 sm:p-6 rounded-xl
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
              <div className="flex items-start gap-4 w-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg bg-gray-100/80 border border-gray-200/60 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Img</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{promo.title}</h3>
                    {promo.discount && (
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-3 py-1 rounded-full shadow-lg flex-shrink-0 whitespace-nowrap">
                        {promo.discount} OFF
                      </span>
                    )}
                  </div>
                  
                  {promo.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{promo.description}</p>
                  )}
                  
                  <div className="flex items-center gap-3">
                    {promo.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {promo.originalPrice}
                      </span>
                    )}
                    <span className="font-bold text-gray-900 text-base">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 w-full">
      <div className="w-full">
        <div className="flex items-center mb-4 sm:mb-6">
          <button 
            onClick={() => setActiveView('main')}
            className="mr-3 p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Low In Stock</h1>
        </div>

        <div className="p-4 sm:p-6 rounded-xl mb-4 sm:mb-6
          bg-white/80 backdrop-blur-lg border border-gray-200/60
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
          <p className="text-gray-600 text-base">Items that need your attention</p>
        </div>

        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 rounded-xl border-l-4 border-red-400
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
              <div className="flex items-start gap-4 w-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg bg-red-50/80 border border-red-200/60 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Img</span>
                </div>
                                  
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base mb-2 truncate">{item.name}</h3>
                  <p className="text-red-500 text-sm font-medium mb-3">{item.stock}</p>
                  
                  {item.discount && (
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-3 py-1 rounded-full shadow-lg mb-3 inline-block">
                      {item.discount} OFF
                    </span>
                  )}
                  
                  <div className="flex items-center gap-3">
                    {item.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {item.originalPrice}
                      </span>
                    )}
                    <span className="font-bold text-gray-900 text-base">
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
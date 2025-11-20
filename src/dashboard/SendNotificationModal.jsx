import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FaTag, FaRocket, FaCrown, FaExclamationTriangle } from 'react-icons/fa';
const SendNotificationModal = ({ 
  showNotificationModal, 
  setShowNotificationModal,
  products,
  loyalCustomers 
}) => {
  const [notificationStep, setNotificationStep] = useState(1);
  const [selectedNotificationType, setSelectedNotificationType] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  // Filter products based on notification type - WITH NULL CHECK
  const getFilteredProducts = () => {
    if (!products) return [];
    if (!selectedNotificationType) return products;

    switch (selectedNotificationType) {
      case 'Product Sale':
        return products.filter(product => 
          product.tags?.includes('Sale') || 
          product.discountPrice
        );
      case 'New Arrivals':
        return products.filter(product => 
          product.tags?.includes('New Arrival')
        );
      case 'Limited Editions':
        return products.filter(product => 
          product.tags?.includes('Limited Edition')
        );
      case 'Low in Stock':
        return products.filter(product => 
          product.tags?.includes('Low in Stock') || 
          (product.stock && product.stock < 10)
        );
      default:
        return products;
    }
  };

  const filteredProducts = getFilteredProducts();

  const handleNotificationNext = () => {
    if (notificationStep < 3) {
      setNotificationStep(notificationStep + 1);
    }
  };

  const handleNotificationBack = () => {
    if (notificationStep > 1) {
      setNotificationStep(notificationStep - 1);
    }
  };

  const handleCloseNotification = () => {
    setShowNotificationModal(false);
    setNotificationStep(1);
    setSelectedNotificationType('');
    setSelectedProducts([]);
    setSelectedCustomers([]);
  };

  const handleSendNotification = () => {
    // Handle sending notification logic here
    console.log('Sending notification:', {
      customers: selectedCustomers,
      type: selectedNotificationType,
      products: selectedProducts
    });
    handleCloseNotification();
  };

  const handleNotificationTypeSelect = (type) => {
    setSelectedNotificationType(type);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomers(prev => {
      const isSelected = prev.some(c => c.id === customer.id);
      if (isSelected) {
        return prev.filter(c => c.id !== customer.id);
      } else {
        return [...prev, customer];
      }
    });
  };

  const handleProductSelect = (product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleSelectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts([...filteredProducts]);
    }
  };

  const handleSelectAllCustomers = () => {
    if (selectedCustomers.length === loyalCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers([...loyalCustomers]);
    }
  };

  const isCustomerSelected = (customer) => {
    return selectedCustomers.some(c => c.id === customer.id);
  };

  const isProductSelected = (product) => {
    return selectedProducts.some(p => p.id === product.id);
  };

  const getTagStyle = (tag) => {
    switch (tag) {
      case 'New Arrival':
        return 'bg-green-100 text-green-800';
      case 'Limited Edition':
        return 'bg-purple-100 text-purple-800';
      case 'Best Seller':
        return 'bg-orange-100 text-orange-800';
      case 'Low in Stock':
        return 'bg-red-100 text-red-800';
      case 'Out in Stock':
        return 'bg-gray-100 text-gray-800';
      case 'Sale':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Get step 3 title based on selected notification type
  const getStep3Title = () => {
    switch (selectedNotificationType) {
      case 'Product Sale':
        return 'Select products on Sale';
      case 'New Arrivals':
        return 'Select New Arrival products';
      case 'Limited Editions':
        return 'Select Limited Edition products';
      case 'Low in Stock':
        return 'Select Low in Stock products';
      default:
        return `Select products for ${selectedNotificationType}`;
    }
  };

  // Get empty state message based on selected notification type
  const getEmptyStateMessage = () => {
    switch (selectedNotificationType) {
      case 'Product Sale':
        return 'No products on sale available. Add products with sale tags.';
      case 'New Arrivals':
        return 'No new arrival products available. Add products with "New Arrival" tags.';
      case 'Limited Editions':
        return 'No limited edition products available. Add products with "Limited Edition" tags.';
      case 'Low in Stock':
        return 'No low stock products available. Add products with "Low in Stock" tags or low stock quantities.';
      default:
        return `No products available for ${selectedNotificationType}.`;
    }
  };

  return (
    <>
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b relative">
              <button
                onClick={handleCloseNotification}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
              {/* Stepper */}
              <div className="flex justify-center items-center gap-4 mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step <= notificationStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-1 mx-2 ${
                        step < notificationStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-4 text-center">Send Notification</h2>
            </div>

            {/* Step 1: Select Customers */}
            {notificationStep === 1 && (
              <div className="p-6">
                {/* Select All Button */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">
                    {selectedCustomers.length} customer(s) selected
                  </span>
                  <button
                    onClick={handleSelectAllCustomers}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    {selectedCustomers.length === loyalCustomers.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  {loyalCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isCustomerSelected(customer)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Selection Checkbox */}
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isCustomerSelected(customer)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {isCustomerSelected(customer) && (
                            <FaCheck className="text-white text-xs" />
                          )}
                        </div>
                        
                        <div>
                          <div className="font-semibold text-gray-800">{customer.name}</div>
                          <div className="text-gray-600 text-sm">{customer.phone}</div>
                          {customer.orders > 0 && (
                            <div className="text-green-600 text-xs font-medium">
                              {customer.orders} orders
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {customer.orders > 0 && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                            {customer.orders}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseNotification}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNotificationNext}
                    disabled={selectedCustomers.length === 0}
                    className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                      selectedCustomers.length > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          {/* Step 2: Select Notification Type */}
{notificationStep === 2 && (
  <div className="p-6">
    <p className="text-gray-600 mb-6 text-center">Select what you want to notify your customers with</p>
    
    <div className="space-y-3 mb-6">
      {[
        { 
          type: 'Product Sale', 
          description: 'Notify customers about discounted products',
          icon: <FaTag className="text-blue-600" />
        },
        { 
          type: 'New Arrivals', 
          description: 'Alert customers about new product arrivals',
          icon: <FaRocket className="text-blue-600" />
        },
        { 
          type: 'Limited Editions', 
          description: 'Notify about limited edition products',
          icon: <FaCrown className="text-blue-600" />
        },
        { 
          type: 'Low in Stock', 
          description: 'Alert customers about low stock items',
          icon: <FaExclamationTriangle className="text-blue-600" />
        }
      ].map((notification) => (
        <div
          key={notification.type}
          className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
            selectedNotificationType === notification.type
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => handleNotificationTypeSelect(notification.type)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Blue Icon */}
              <div className="text-xl">
                {notification.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {notification.type}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {notification.description}
                </p>
              </div>
            </div>
            
            {/* Selection Indicator - Simple Radio Button */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedNotificationType === notification.type
                ? 'bg-blue-600 border-blue-600'
                : 'border-gray-300'
            }`}>
              {selectedNotificationType === notification.type && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="flex gap-3">
      <button
        onClick={handleCloseNotification}
        className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleNotificationBack}
        className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
      >
        Back
      </button>
      <button
        onClick={handleNotificationNext}
        disabled={!selectedNotificationType}
        className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
          selectedNotificationType
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>

    {/* Sign Out Link */}
    <div className="mt-6 pt-4 border-t text-center">
      <button className="text-gray-600 hover:text-gray-800 text-sm">
        Sign Out
      </button>
    </div>
  </div>
)}

            {/* Step 3: Select Products - UPDATED TO MATCH PRODUCTS COMPONENT */}
            {notificationStep === 3 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  {getStep3Title()}
                </h3>
                
                {/* Select All Products Button */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">
                    {selectedProducts.length} product(s) selected
                  </span>
                  <button
                    onClick={handleSelectAllProducts}
                    disabled={filteredProducts.length === 0}
                    className={`text-sm font-medium ${
                      filteredProducts.length === 0 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                <p className="text-center text-gray-600 mb-6">
                  Showing {filteredProducts.length} product(s) for {selectedNotificationType}
                </p>
                
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {getEmptyStateMessage()}
                  </div>
                ) : (
                  <>
                    {/* UPDATED: Product Grid matching the Products component */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className={`bg-white shadow-sm rounded-xl p-4 border hover:shadow-md transition cursor-pointer ${
                            isProductSelected(product) ? 'ring-2 ring-blue-600 bg-blue-50' : ''
                          }`}
                          onClick={() => handleProductSelect(product)}
                        >
                          {/* Selection Checkbox */}
                          <div className="flex justify-end mb-2">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isProductSelected(product)
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300 bg-white'
                            }`}>
                              {isProductSelected(product) && (
                                <FaCheck className="text-white text-xs" />
                              )}
                            </div>
                          </div>

                          {/* Product Tags */}
                          {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {product.tags.map((tag, index) => (
                                <div key={index} className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-md">
                                  {tag}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Product Image */}
                          {product.image ? (
                            <img 
                              src={product.image} 
                              className="w-full h-32 object-cover rounded-md mb-3" 
                              alt={product.name} 
                            />
                          ) : (
                            <div className="w-full h-32 rounded-md mb-3 bg-gray-50 border flex items-center justify-center text-gray-400">
                              No image
                            </div>
                          )}
                          
                          {/* Product Name */}
                          <h3 className="font-semibold text-[17px] mb-1">{product.name}</h3>
                          
                          {/* Product Description */}
                          {product.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                          )}
                          
                          {/* Price and Stock */}
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">Price: QAR {product.price}</p>
                            <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                          </div>
                          
                          {/* Category */}
                          {product.category && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                Category: {product.category}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleNotificationBack}
                        className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSendNotification}
                        disabled={selectedProducts.length === 0}
                        className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                          selectedProducts.length > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                      >
                        Send ({selectedProducts.length})
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SendNotificationModal;
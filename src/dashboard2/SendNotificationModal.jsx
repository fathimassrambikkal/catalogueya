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

  const getFilteredProducts = () => {
    if (!products) return [];
    if (!selectedNotificationType) return products || [];

    switch (selectedNotificationType) {
      case 'Product Sale':
        return products.filter(p => p.tags?.includes('Sale') || p.discountPrice);
      case 'New Arrivals':
        return products.filter(p => p.tags?.includes('New Arrival'));
      case 'Limited Editions':
        return products.filter(p => p.tags?.includes('Limited Edition'));
      case 'Low in Stock':
        return products.filter(
          p => p.tags?.includes('Low in Stock') || (p.stock && p.stock < 10)
        );
      default:
        return products;
    }
  };

  const filteredProducts = getFilteredProducts();

  const handleCloseNotification = () => {
    setShowNotificationModal(false);
    setNotificationStep(1);
    setSelectedNotificationType('');
    setSelectedProducts([]);
    setSelectedCustomers([]);
  };

  const handleSendNotification = () => {
    console.log({
      customers: selectedCustomers,
      type: selectedNotificationType,
      products: selectedProducts
    });
    handleCloseNotification();
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomers(prev =>
      prev.some(c => c.id === customer.id)
        ? prev.filter(c => c.id !== customer.id)
        : [...prev, customer]
    );
  };

  const handleProductSelect = (product) => {
    setSelectedProducts(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const handleSelectAllProducts = () =>
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length ? [] : [...filteredProducts]
    );

  const handleSelectAllCustomers = () =>
    setSelectedCustomers(
      selectedCustomers.length === loyalCustomers.length ? [] : [...loyalCustomers]
    );

  const isCustomerSelected = (c) => selectedCustomers.some(x => x.id === c.id);
  const isProductSelected = (p) => selectedProducts.some(x => x.id === p.id);

  const getStep3Title = () => {
    switch (selectedNotificationType) {
      case 'Product Sale': return 'Select products on Sale';
      case 'New Arrivals': return 'Select New Arrival products';
      case 'Limited Editions': return 'Select Limited Edition products';
      case 'Low in Stock': return 'Select Low in Stock products';
      default: return `Select products for ${selectedNotificationType}`;
    }
  };

  const getEmptyStateMessage = () => {
    switch (selectedNotificationType) {
      case 'Product Sale': return 'No products on sale available.';
      case 'New Arrivals': return 'No new arrival products available.';
      case 'Limited Editions': return 'No limited edition products available.';
      case 'Low in Stock': return 'No low stock products available.';
      default: return `No products available for ${selectedNotificationType}.`;
    }
  };

  if (!showNotificationModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-x-hidden">

      <div
        className="bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl w-full 
        max-w-6xl max-h-[85vh] sm:max-h-[85vh]
        overflow-y-auto border border-gray-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.2)] 
        mx-2 sm:mx-4 overflow-x-hidden min-w-0"
      >

        {/* HEADER */}
        <div className="p-3 sm:p-4 border-b border-gray-200/60 relative min-w-0">
          <button
            onClick={handleCloseNotification}
            className="absolute right-3 top-3 sm:right-6 sm:top-6 text-gray-500 hover:text-red-500 
            transition-colors p-2 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-lg 
            border border-gray-200/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
          >
            <FaTimes size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>

          {/* STEPPER */}
          <div className="flex justify-center items-center gap-2 sm:gap-4 mb-3 sm:mb-5 min-w-0 overflow-x-hidden">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center min-w-0">
                <div className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center 
                transition-all duration-300 text-xs sm:text-sm ${
                  step <= notificationStep
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>

                {step < 3 && (
                  <div className={`w-6 sm:w-10 h-1 mx-1 sm:mx-2 transition-all duration-300 ${
                    step < notificationStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center">
            Send Notification
          </h2>
        </div>

        {/* ================= STEP 1 ================= */}
        {notificationStep === 1 && (
          <div className="p-4 sm:p-6 min-w-0 overflow-x-hidden">

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
              <span className="text-gray-600 text-sm sm:text-base">
                {selectedCustomers.length} selected
              </span>

              <button
                onClick={handleSelectAllCustomers}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                {selectedCustomers.length === loyalCustomers.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-2 max-h-[45vh] overflow-y-auto">
              {loyalCustomers.map(customer => (
                <div
                  key={customer.id}
                  onClick={() => handleCustomerSelect(customer)}
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isCustomerSelected(customer)
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200/60 bg-white/80 hover:border-gray-300/60'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center ${
                        isCustomerSelected(customer)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {isCustomerSelected(customer) && <FaCheck className="text-white text-xs" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {customer.name}
                      </p>
                      <p className="text-gray-600 text-xs truncate">{customer.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={handleCloseNotification}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={() => setNotificationStep(2)}
                disabled={selectedCustomers.length === 0}
                className={`flex-1 py-2 rounded-lg text-white ${
                  selectedCustomers.length
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {notificationStep === 2 && (
          <div className="p-4 sm:p-6 min-w-0 overflow-x-hidden">

            <p className="text-gray-600 text-center text-sm mb-4">
              Select what you want to notify your customers with
            </p>

            <div className="space-y-3 max-h-[45vh] overflow-y-auto">
              {[
                { type: 'Product Sale', icon: <FaTag className="text-blue-500" /> },
                { type: 'New Arrivals', icon: <FaRocket className="text-blue-500" /> },
                { type: 'Limited Editions', icon: <FaCrown className="text-blue-500" /> },
                { type: 'Low in Stock', icon: <FaExclamationTriangle className="text-blue-500" /> }
              ].map(notification => (

                <div
                  key={notification.type}
                  onClick={() => setSelectedNotificationType(notification.type)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedNotificationType === notification.type
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200/60 bg-white/80 hover:border-gray-300/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {notification.icon}
                    <p className="font-semibold truncate">{notification.type}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={handleCloseNotification}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={() => setNotificationStep(1)}
                className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
              >
                Back
              </button>

              <button
                onClick={() => setNotificationStep(3)}
                disabled={!selectedNotificationType}
                className={`flex-1 py-2 rounded-lg text-white ${
                  selectedNotificationType
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {notificationStep === 3 && (
          <div className="p-4 sm:p-6 min-w-0 overflow-x-hidden">

            <h3 className="text-xl font-bold text-center mb-4">{getStep3Title()}</h3>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 text-sm">
                {selectedProducts.length} selected
              </span>

              <button
                onClick={handleSelectAllProducts}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-6 text-gray-500 bg-white/60 border rounded-xl">
                {getEmptyStateMessage()}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[45vh] overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={`p-4 rounded-2xl bg-white/80 border cursor-pointer transition-all ${
                        isProductSelected(product)
                          ? 'ring-2 ring-blue-500 bg-blue-500/10'
                          : 'border-gray-200/60 hover:shadow'
                      }`}
                    >

                      {/* Checkbox */}
                      <div className="flex justify-end mb-2">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isProductSelected(product)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {isProductSelected(product) && (
                            <FaCheck className="text-white text-xs" />
                          )}
                        </div>
                      </div>

                      {/* Image */}
                      {product.image ? (
                        <img
                          src={product.image}
                          className="w-full h-24 object-cover rounded-lg mb-3"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 border rounded-lg flex items-center justify-center text-gray-500">
                          No image
                        </div>
                      )}

                      <p className="font-semibold text-gray-900 truncate mb-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {product.description}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        QAR {product.price}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  <button
                    onClick={() => setNotificationStep(2)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                  >
                    Back
                  </button>

                  <button
                    onClick={handleSendNotification}
                    disabled={selectedProducts.length === 0}
                    className={`flex-1 py-2 rounded-lg text-white ${
                      selectedProducts.length
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-gray-400 cursor-not-allowed'
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
  );
};

export default SendNotificationModal;

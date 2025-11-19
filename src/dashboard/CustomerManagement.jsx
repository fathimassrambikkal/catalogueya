import React, { useState } from 'react';
import { FaBell, FaChevronRight, FaTimes, FaRegCommentDots, FaMoneyBillWave, FaRegStar, FaArrowLeft } from 'react-icons/fa';

const CustomerManagement = ({ 
  loyalCustomers = [], 
  onRemoveCustomer,
  onSendNotification,
  onRequestPayment,
  onRequestReview,
  onSendMessage
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerActionsModal, setShowCustomerActionsModal] = useState(false);
  const [showSendNotificationModal, setShowSendNotificationModal] = useState(false);
  const [showRequestPaymentModal, setShowRequestPaymentModal] = useState(false);
  const [showRequestReviewModal, setShowRequestReviewModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [reviewType, setReviewType] = useState('');

  const notificationTypes = [
    { type: 'New Sales', special: true, description: 'Notify customers about discounted products' },
    { type: 'Low in Stock', special: false, description: 'Alert customers about low stock items' }
  ];

  // Handle customer click to show actions modal
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerActionsModal(true);
  };

  // Handle remove customer
  const handleRemoveCustomer = () => {
    if (selectedCustomer && onRemoveCustomer) {
      onRemoveCustomer(selectedCustomer);
    }
    setShowCustomerActionsModal(false);
    setSelectedCustomer(null);
  };

  // Handle send notification for single customer
  const handleSingleSendNotification = (type) => {
    if (selectedCustomer && onSendNotification) {
      onSendNotification(selectedCustomer, type);
    }
    setShowSendNotificationModal(false);
  };

  // Handle request payment
  const handleRequestPayment = () => {
    if (selectedCustomer && onRequestPayment) {
      onRequestPayment(selectedCustomer);
    }
    setShowRequestPaymentModal(false);
  };

  // Handle request review
  const handleRequestReview = () => {
    if (selectedCustomer && onRequestReview) {
      onRequestReview(selectedCustomer, reviewType);
    }
    setShowRequestReviewModal(false);
    setReviewType('');
  };

  // Handle send message
  const handleSendMessage = (message) => {
    if (selectedCustomer && onSendMessage) {
      onSendMessage(selectedCustomer, message);
    }
  };

  // Handle back to customer actions modal
  const handleBackToCustomerActions = () => {
    setShowSendNotificationModal(false);
    setShowRequestPaymentModal(false);
    setShowRequestReviewModal(false);
    setShowChatModal(false);
    setShowCustomerActionsModal(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setShowCustomerActionsModal(false);
    setShowSendNotificationModal(false);
    setShowRequestPaymentModal(false);
    setShowRequestReviewModal(false);
    setShowChatModal(false);
    setSelectedCustomer(null);
    setReviewType('');
  };

  return (
    <>
      {/* Customers List */}
      <div className="space-y-3">
        {loyalCustomers.map((customer) => (
          <div 
            key={customer.id} 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleCustomerClick(customer)}
          >
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{customer.name}</div>
              <div className="text-gray-600 text-sm">{customer.phone}</div>
            </div>
            <div className="flex items-center gap-3">
              {customer.orders > 0 && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                  {customer.orders}
                </span>
              )}
              <FaChevronRight className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Customer Actions Modal */}
      {showCustomerActionsModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b text-center relative">
              <button
                onClick={closeAllModals}
                className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.name}</h2>
            </div>

            {/* Action Buttons */}
            <div className="p-6 space-y-4">
              <button 
                onClick={() => {
                  setShowCustomerActionsModal(false);
                  setShowSendNotificationModal(true);
                }}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaBell />
                Send Notification
              </button>
              
              <button 
                onClick={() => {
                  setShowCustomerActionsModal(false);
                  setShowRequestPaymentModal(true);
                }}
                className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaMoneyBillWave />
                Request Payment
              </button>
              
              <button 
                onClick={() => {
                  setShowCustomerActionsModal(false);
                  setShowRequestReviewModal(true);
                }}
                className="w-full flex items-center justify-center gap-3 bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <FaRegStar />
                Request Review
              </button>
              
              <button 
                onClick={() => {
                  setShowCustomerActionsModal(false);
                  setShowChatModal(true);
                }}
                className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaRegCommentDots />
                Chat
              </button>
            </div>

            {/* Remove Customer Button */}
            <div className="p-6 border-t">
              <button 
                onClick={handleRemoveCustomer}
                className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaTimes />
                Remove Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {showSendNotificationModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b text-center relative">
              <button
                onClick={handleBackToCustomerActions}
                className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <FaArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">Send Notification</h2>
              <p className="text-gray-600 mt-1">{selectedCustomer.name}</p>
            </div>

            {/* Notification Options */}
            <div className="p-6 space-y-4">
              {notificationTypes.map((notification) => (
                <button
                  key={notification.type}
                  onClick={() => handleSingleSendNotification(notification.type)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    notification.special 
                      ? 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-gray-800">{notification.type}</div>
                  <div className="text-gray-600 text-sm mt-1">{notification.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Request Payment Modal */}
      {showRequestPaymentModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b text-center relative">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBackToCustomerActions}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaArrowLeft size={20} />
                </button>
                <div className="flex-1 text-center">
                  <h2 className="text-xl font-semibold text-gray-800">Request Payment</h2>
                  <p className="text-gray-600 mt-1">{selectedCustomer.name}</p>
                </div>
                <button
                  onClick={closeAllModals}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Payment Options */}
            <div className="p-6 space-y-4">
              <div className="text-center text-gray-600 mb-4">
                Register at Skpcash
              </div>
              
              <button
                onClick={handleRequestPayment}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                SkipCash
              </button>
              
              <button
                onClick={handleRequestPayment}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Review Modal */}
      {showRequestReviewModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b relative">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBackToCustomerActions}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaArrowLeft size={20} />
                </button>
                <div className="flex-1 text-center">
                  <h2 className="text-xl font-semibold text-gray-800">Request Review</h2>
                  <p className="text-gray-600 mt-1">{selectedCustomer.name}</p>
                </div>
                <button
                  onClick={closeAllModals}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Review Description */}
            <div className="p-6 border-b">
              <p className="text-gray-600 text-sm">
                A form will be sent to {selectedCustomer.name} to submit her review on the product you sell her or the service you provide
              </p>
            </div>

            {/* Review Options */}
            <div className="p-6 space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="reviewType"
                  value="company"
                  checked={reviewType === 'company'}
                  onChange={(e) => setReviewType(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-800">Review for the Company</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="reviewType"
                  value="product"
                  checked={reviewType === 'product'}
                  onChange={(e) => setReviewType(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-800">Review a product</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t">
              <button
                onClick={handleRequestReview}
                disabled={!reviewType}
                className={`w-full py-3 px-4 rounded-lg transition-colors ${
                  reviewType
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                Request a Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleBackToCustomerActions}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{selectedCustomer.name}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCustomer.online 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedCustomer.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeAllModals}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {/* Messages would go here */}
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start a conversation!
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleSendMessage(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.target.previousSibling;
                    if (input.value.trim()) {
                      handleSendMessage(input.value);
                      input.value = '';
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerManagement;
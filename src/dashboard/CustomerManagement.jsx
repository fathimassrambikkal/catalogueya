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
  const [currentView, setCurrentView] = useState('list'); // 'list', 'actions', 'notification', 'payment', 'review', 'chat'
  const [reviewType, setReviewType] = useState('');

  // Handle customer click to show actions page
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setCurrentView('actions');
  };

  // Handle remove customer
  const handleRemoveCustomer = () => {
    if (selectedCustomer && onRemoveCustomer) {
      onRemoveCustomer(selectedCustomer);
    }
    setCurrentView('list');
    setSelectedCustomer(null);
  };

  // Handle send notification for single customer
  const handleSingleSendNotification = (type) => {
    if (selectedCustomer && onSendNotification) {
      onSendNotification(selectedCustomer, type);
    }
    setCurrentView('actions');
  };

  // Handle request payment
  const handleRequestPayment = () => {
    if (selectedCustomer && onRequestPayment) {
      onRequestPayment(selectedCustomer);
    }
    setCurrentView('actions');
  };

  // Handle request review
  const handleRequestReview = () => {
    if (selectedCustomer && onRequestReview) {
      onRequestReview(selectedCustomer, reviewType);
    }
    setCurrentView('actions');
    setReviewType('');
  };

  // Handle send message
  const handleSendMessage = (message) => {
    if (selectedCustomer && onSendMessage) {
      onSendMessage(selectedCustomer, message);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentView === 'actions') {
      setCurrentView('list');
      setSelectedCustomer(null);
    } else if (['notification', 'payment', 'review', 'chat'].includes(currentView)) {
      setCurrentView('actions');
    }
  };

  // Close all and return to list
  const handleCloseAll = () => {
    setCurrentView('list');
    setSelectedCustomer(null);
  };

  const notificationTypes = [
    { type: 'New Sales', special: true, description: 'Notify customers about discounted products' },
    { type: 'Low in Stock', special: false, description: 'Alert customers about low stock items' }
  ];

  // Customers List View
  const renderCustomersList = () => (
    <div className="space-y-3">
      {loyalCustomers.map((customer) => (
        <div 
          key={customer.id} 
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleCustomerClick(customer)}
        >
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{customer.name}</div>
            <div className="text-gray-600 text-sm">{customer.phone}</div>
          </div>
          <div className="flex items-center gap-3">
            {customer.orders > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                {customer.orders}
              </span>
            )}
            <FaChevronRight className="text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );

  // Customer Actions View
  const renderCustomerActions = () => (
    <div className="bg-white rounded-lg w-full">
      {/* Header */}
      <div className="p-6 border-b text-center relative">
        <button
          onClick={handleBack}
          className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <FaArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.name}</h2>
        <p className="text-gray-600 mt-1">{selectedCustomer.phone}</p>
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-4">
        <button 
          onClick={() => setCurrentView('notification')}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-500 transition-colors"
        >
          <FaBell className="text-blue-600" />
          Send Notification
        </button>
        
        <button 
          onClick={() => setCurrentView('payment')}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-500 transition-colors"
        >
          <FaMoneyBillWave className="text-blue-600" />
          Request Payment
        </button>
        
        <button 
          onClick={() => setCurrentView('review')}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-500 transition-colors"
        >
          <FaRegStar className="text-blue-600" />
          Request Review
        </button>
        
        <button 
          onClick={() => setCurrentView('chat')}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-500 transition-colors"
        >
          <FaRegCommentDots className="text-blue-600" />
          Chat
        </button>
      </div>

      {/* Remove Customer Button */}
      <div className="p-6 border-t">
        <button 
          onClick={handleRemoveCustomer}
          className="w-full flex items-center justify-center gap-3 bg-white text-red-600 py-3 px-4 rounded-lg border border-red-300 hover:bg-red-50 hover:border-red-500 transition-colors"
        >
          <FaTimes />
          Remove Customer
        </button>
      </div>
    </div>
  );

  // Send Notification View
  const renderSendNotification = () => (
    <div className="bg-white rounded-lg w-full">
      {/* Header */}
      <div className="p-6 border-b text-center relative">
        <button
          onClick={handleBack}
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
                ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300' 
                : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-800">{notification.type}</div>
            <div className="text-gray-600 text-sm mt-1">{notification.description}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // Request Payment View
  const renderRequestPayment = () => (
    <div className="bg-white rounded-lg w-full">
      {/* Header */}
      <div className="p-6 border-b text-center relative">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-xl font-semibold text-gray-800">Request Payment</h2>
            <p className="text-gray-600 mt-1">{selectedCustomer.name}</p>
          </div>
          <button
            onClick={handleCloseAll}
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
          className="w-full bg-white text-gray-800 py-3 px-4 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-500 transition-colors"
        >
          SkipCash
        </button>
        
        <button
          onClick={handleRequestPayment}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
      </div>
    </div>
  );

  // Request Review View
  const renderRequestReview = () => (
    <div className="bg-white rounded-lg w-full">
      {/* Header */}
      <div className="p-6 border-b relative">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-xl font-semibold text-gray-800">Request Review</h2>
            <p className="text-gray-600 mt-1">{selectedCustomer.name}</p>
          </div>
          <button
            onClick={handleCloseAll}
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
        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-blue-50">
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
        
        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-blue-50">
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
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Request a Review
        </button>
      </div>
    </div>
  );

  // Chat View
  const renderChat = () => (
    <div className="bg-white rounded-lg w-full h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
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
            onClick={handleCloseAll}
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
  );

  // Main render function
  return (
    <div className="w-full">
      {currentView === 'list' && renderCustomersList()}
      {currentView === 'actions' && renderCustomerActions()}
      {currentView === 'notification' && renderSendNotification()}
      {currentView === 'payment' && renderRequestPayment()}
      {currentView === 'review' && renderRequestReview()}
      {currentView === 'chat' && renderChat()}
    </div>
  );
};

export default CustomerManagement;
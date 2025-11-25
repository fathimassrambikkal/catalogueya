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
          className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
            hover:border-blue-200/60"
          onClick={() => handleCustomerClick(customer)}
        >
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-left">{customer.name}</div>
            <div className="text-gray-600 text-sm text-left">{customer.phone}</div>
          </div>
          <div className="flex items-center gap-3">
            {customer.orders > 0 && (
              <span className="bg-blue-500/10 text-blue-600 px-2 py-1 rounded text-sm font-semibold border border-blue-200/60">
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
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl w-full border border-gray-200/60
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/60 relative">
        <button
          onClick={handleBack}
          className="absolute left-6 top-6 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
        >
          <FaArrowLeft size={18} />
        </button>
        <div className="text-left pl-12">
          <h2 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h2>
          <p className="text-gray-600 mt-1">{selectedCustomer.phone}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-4">
        <button 
          onClick={() => setCurrentView('notification')}
          className="w-full flex items-center justify-start gap-3 bg-white/80 text-gray-900 py-3 px-4 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-200
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]"
        >
          <FaBell className="text-blue-500" />
          <span className="text-left">Send Notification</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('payment')}
          className="w-full flex items-center justify-start gap-3 bg-white/80 text-gray-900 py-3 px-4 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-200
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]"
        >
          <FaMoneyBillWave className="text-blue-500" />
          <span className="text-left">Request Payment</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('review')}
          className="w-full flex items-center justify-start gap-3 bg-white/80 text-gray-900 py-3 px-4 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-200
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]"
        >
          <FaRegStar className="text-blue-500" />
          <span className="text-left">Request Review</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('chat')}
          className="w-full flex items-center justify-start gap-3 bg-white/80 text-gray-900 py-3 px-4 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-200
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]"
        >
          <FaRegCommentDots className="text-blue-500" />
          <span className="text-left">Chat</span>
        </button>
      </div>

      {/* Remove Customer Button */}
      <div className="p-6 border-t border-gray-200/60">
        <button 
          onClick={handleRemoveCustomer}
          className="w-full flex items-center justify-start gap-3 bg-white/80 text-red-600 py-3 px-4 rounded-xl border border-red-300 hover:bg-red-500/10 hover:border-red-500 transition-all duration-200
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]"
        >
          <FaTimes />
          <span className="text-left">Remove Customer</span>
        </button>
      </div>
    </div>
  );

  // Send Notification View
  const renderSendNotification = () => (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl w-full border border-gray-200/60
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/60 relative">
        <button
          onClick={handleBack}
          className="absolute left-6 top-6 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
        >
          <FaArrowLeft size={18} />
        </button>
        <div className="text-left pl-12">
          <h2 className="text-2xl font-bold text-gray-900">Send Notification</h2>
          <p className="text-gray-600 mt-1">{selectedCustomer.name}</p>
        </div>
      </div>

      {/* Notification Options */}
      <div className="p-6 space-y-4">
        {notificationTypes.map((notification) => (
          <button
            key={notification.type}
            onClick={() => handleSingleSendNotification(notification.type)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              notification.special 
                ? 'border-blue-200 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-300' 
                : 'border-gray-200/60 bg-white/80 hover:bg-gray-50/60 hover:border-gray-300/60'
            } shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]`}
          >
            <div className="font-semibold text-gray-900 text-left">{notification.type}</div>
            <div className="text-gray-600 text-sm mt-1 text-left">{notification.description}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // Request Payment View
  const renderRequestPayment = () => (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl w-full border border-gray-200/60
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/60">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <FaArrowLeft size={18} />
          </button>
          <div className="flex-1 text-left ml-4">
            <h2 className="text-2xl font-bold text-gray-900">Request Payment</h2>
            <p className="text-gray-600 mt-1">{selectedCustomer.name}</p>
          </div>
          <button
            onClick={handleCloseAll}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <FaTimes size={18} />
          </button>
        </div>
      </div>

      {/* Payment Options */}
      <div className="p-6 space-y-4">
        <div className="text-gray-600 mb-4 text-left">
          Register at Skpcash
        </div>
        
        <button
          onClick={handleRequestPayment}
          className="w-full bg-white/80 text-gray-900 py-3 px-4 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-200 text-left
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]"
        >
          SkipCash
        </button>
        
        <button
          onClick={handleRequestPayment}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-all duration-200 text-left
            shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]"
        >
          Register
        </button>
      </div>
    </div>
  );

  // Request Review View
  const renderRequestReview = () => (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl w-full border border-gray-200/60
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/60">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <FaArrowLeft size={18} />
          </button>
          <div className="flex-1 text-left ml-4">
            <h2 className="text-2xl font-bold text-gray-900">Request Review</h2>
            <p className="text-gray-600 mt-1">{selectedCustomer.name}</p>
          </div>
          <button
            onClick={handleCloseAll}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <FaTimes size={18} />
          </button>
        </div>
      </div>

      {/* Review Description */}
      <div className="p-6 border-b border-gray-200/60">
        <p className="text-gray-600 text-sm text-left">
          A form will be sent to {selectedCustomer.name} to submit her review on the product you sell her or the service you provide
        </p>
      </div>

      {/* Review Options */}
      <div className="p-6 space-y-4">
        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 transition-all duration-200
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
          <input
            type="radio"
            name="reviewType"
            value="company"
            checked={reviewType === 'company'}
            onChange={(e) => setReviewType(e.target.value)}
            className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <span className="text-gray-900 text-left">Review for the Company</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 transition-all duration-200
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
          <input
            type="radio"
            name="reviewType"
            value="product"
            checked={reviewType === 'product'}
            onChange={(e) => setReviewType(e.target.value)}
            className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <span className="text-gray-900 text-left">Review a product</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-200/60">
        <button
          onClick={handleRequestReview}
          disabled={!reviewType}
          className={`w-full py-3 px-4 rounded-xl transition-all duration-200 text-left ${
            reviewType
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Request a Review
        </button>
      </div>
    </div>
  );

  // Chat View
  const renderChat = () => (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl w-full h-[600px] flex flex-col border border-gray-200/60
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
                bg-white/80 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
            >
              <FaArrowLeft size={18} />
            </button>
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCustomer.online 
                  ? 'bg-green-500/10 text-green-600 border border-green-200/60' 
                  : 'bg-gray-500/10 text-gray-600 border border-gray-200/60'
              }`}>
                {selectedCustomer.online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <button
            onClick={handleCloseAll}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <FaTimes size={18} />
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50/60">
        {/* Messages would go here */}
        <div className="text-gray-500 py-8 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 text-left px-4">
          No messages yet. Start a conversation!
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200/60">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border border-gray-300/60 rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
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
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all duration-200
              shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]"
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
import React, { useState } from 'react';
import { FaChevronRight, FaTimes, FaRegCommentDots, FaMoneyBillWave, FaRegStar, FaArrowLeft, FaPlus, FaPaperPlane, FaUserPlus } from 'react-icons/fa';
import AddCustomerModal from './AddCustomerModal';

const CustomerManagement = ({ 
  loyalCustomers = [], 
  onRemoveCustomer,
  onRequestPayment,
  onRequestReview,
  onSendMessage
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentView, setCurrentView] = useState('list'); 
  const [reviewType, setReviewType] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

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
    } else if (['payment', 'review', 'chat'].includes(currentView)) {
      setCurrentView('actions');
    }
  };

  // Close all and return to list
  const handleCloseAll = () => {
    setCurrentView('list');
    setSelectedCustomer(null);
  };

  // Customers List View
  const renderCustomersList = () => (
    <div className="space-y-3 overflow-x-hidden">
      {loyalCustomers.map((customer) => (
        <div 
          key={customer.id} 
          className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
            hover:border-blue-200/60 overflow-x-hidden"
          onClick={() => handleCustomerClick(customer)}
        >
          <div className="flex-1 min-w-0 overflow-x-hidden">
            <div className="font-semibold text-gray-900 text-left truncate">{customer.name}</div>
            <div className="text-gray-600 text-sm text-left truncate">{customer.phone}</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 overflow-x-hidden">
            {customer.orders > 0 && (
              <span className="bg-blue-500/10 text-blue-600 px-2 py-1 rounded text-sm font-semibold border border-blue-200/60 whitespace-nowrap">
                {customer.orders}
              </span>
            )}
            <FaChevronRight className="text-gray-400 flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );

  // Customer Actions View - RESPONSIVE
  const renderCustomerActions = () => (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl w-full mx-auto border border-gray-200/60
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200/60 relative overflow-x-hidden">
        <button
          onClick={handleBack}
          className="absolute left-4 sm:left-6 top-4 sm:top-6 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0"
        >
          <FaArrowLeft size={18} />
        </button>
        <div className="text-left pl-12 sm:pl-14 pr-4 min-w-0 overflow-x-hidden">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{selectedCustomer.name}</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base truncate">{selectedCustomer.phone}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-x-hidden">
        <button 
          onClick={() => setCurrentView('payment')}
          className="w-full flex items-center justify-start gap-3 bg-white/80 text-gray-900 py-3 px-4 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-200
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)] text-sm sm:text-base overflow-x-hidden"
        >
          <FaMoneyBillWave className="text-blue-500 flex-shrink-0" />
          <span className="text-left truncate">Request Payment</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('review')}
          className="w-full flex items-center justify-start gap-3 bg-white/80 text-gray-900 py-3 px-4 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-200
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)] text-sm sm:text-base overflow-x-hidden"
        >
          <FaRegStar className="text-blue-500 flex-shrink-0" />
          <span className="text-left truncate">Request Review</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('chat')}
          className="w-full flex items-center justify-start gap-3 bg-white/80 text-gray-900 py-3 px-4 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-200
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)] text-sm sm:text-base overflow-x-hidden"
        >
          <FaRegCommentDots className="text-blue-500 flex-shrink-0" />
          <span className="text-left truncate">Chat</span>
        </button>
      </div>

      {/* Remove Customer Button */}
      <div className="p-4 sm:p-6 border-t border-gray-200/60 overflow-x-hidden">
        <button 
          onClick={handleRemoveCustomer}
          className="w-full flex items-center justify-start gap-3 bg-white/80 text-red-600 py-3 px-4 rounded-xl border border-red-300 hover:bg-red-500/10 hover:border-red-500 transition-all duration-200
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)] text-sm sm:text-base overflow-x-hidden"
        >
          <FaTimes className="flex-shrink-0" />
          <span className="text-left truncate">Remove Customer</span>
        </button>
      </div>
    </div>
  );

  // Request Payment View - RESPONSIVE
  const renderRequestPayment = () => (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl w-full mx-auto border border-gray-200/60
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200/60 overflow-x-hidden">
        <div className="flex items-center justify-between gap-2 overflow-x-hidden">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0"
          >
            <FaArrowLeft size={18} />
          </button>
          <div className="flex-1 text-left ml-2 sm:ml-4 min-w-0 overflow-x-hidden">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Request Payment</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base truncate">{selectedCustomer.name}</p>
          </div>
          <button
            onClick={handleCloseAll}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0"
          >
            <FaTimes size={18} />
          </button>
        </div>
      </div>

      {/* Payment Options */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-x-hidden">
        <div className="text-gray-600 mb-3 sm:mb-4 text-left text-sm sm:text-base overflow-x-hidden">
          Register at Skpcash
        </div>
        
        <button
          onClick={handleRequestPayment}
          className="w-full bg-white/80 text-gray-900 py-3 px-4 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-200 text-left
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)] text-sm sm:text-base overflow-x-hidden"
        >
          SkipCash
        </button>
        
        <button
          onClick={handleRequestPayment}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-all duration-200 text-left
            shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)] text-sm sm:text-base overflow-x-hidden"
        >
          Register
        </button>
      </div>
    </div>
  );

  // Request Review View - RESPONSIVE
  const renderRequestReview = () => (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl w-full mx-auto border border-gray-200/60
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200/60 overflow-x-hidden">
        <div className="flex items-center justify-between gap-2 overflow-x-hidden">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0"
          >
            <FaArrowLeft size={18} />
          </button>
          <div className="flex-1 text-left ml-2 sm:ml-4 min-w-0 overflow-x-hidden">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Request Review</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base truncate">{selectedCustomer.name}</p>
          </div>
          <button
            onClick={handleCloseAll}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0"
          >
            <FaTimes size={18} />
          </button>
        </div>
      </div>

      {/* Review Description */}
      <div className="p-4 sm:p-6 border-b border-gray-200/60 overflow-x-hidden">
        <p className="text-gray-600 text-xs sm:text-sm text-left overflow-x-hidden">
          A form will be sent to {selectedCustomer.name} to submit her review on the product you sell her or the service you provide
        </p>
      </div>

      {/* Review Options */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-x-hidden">
        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 transition-all duration-200
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] text-sm sm:text-base overflow-x-hidden">
          <input
            type="radio"
            name="reviewType"
            value="company"
            checked={reviewType === 'company'}
            onChange={(e) => setReviewType(e.target.value)}
            className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500/20 flex-shrink-0"
          />
          <span className="text-gray-900 text-left">Review for the Company</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 transition-all duration-200
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] text-sm sm:text-base overflow-x-hidden">
          <input
            type="radio"
            name="reviewType"
            value="product"
            checked={reviewType === 'product'}
            onChange={(e) => setReviewType(e.target.value)}
            className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500/20 flex-shrink-0"
          />
          <span className="text-gray-900 text-left">Review a product</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="p-4 sm:p-6 border-t border-gray-200/60 overflow-x-hidden">
        <button
          onClick={handleRequestReview}
          disabled={!reviewType}
          className={`w-full py-3 px-4 rounded-xl transition-all duration-200 text-left text-sm sm:text-base overflow-x-hidden ${
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

  // Chat View - RESPONSIVE
  const renderChat = () => (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl w-full mx-auto flex flex-col border border-gray-200/60
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] max-w-full h-[70vh] sm:h-[600px] overflow-x-hidden">
      {/* Chat Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200/60 flex-shrink-0 overflow-x-hidden">
        <div className="flex items-center justify-between gap-2 overflow-x-hidden">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 overflow-x-hidden">
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
                bg-white/80 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0"
            >
              <FaArrowLeft size={16} className="sm:w-[18px]" />
            </button>
            <div className="text-left min-w-0 overflow-x-hidden">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{selectedCustomer.name}</h2>
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                selectedCustomer.online 
                  ? 'bg-green-500/10 text-green-600 border border-green-200/60' 
                  : 'bg-gray-500/10 text-gray-600 border border-gray-200/60'
              }`}>
                {selectedCustomer.online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          {/* Add Contact Button Only */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 overflow-x-hidden">
            <button 
              onClick={() => setShowAddCustomerModal(true)}
              className="flex items-center gap-1 bg-blue-500 text-white py-2 px-2 sm:px-3 rounded-lg hover:bg-blue-600 transition-all duration-200 text-xs sm:text-sm
                shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)] whitespace-nowrap overflow-x-hidden"
            >
              <FaUserPlus size={12} className="sm:w-[14px]" />
              <span className="hidden xs:inline">Add</span>
            </button>
            
            <button
              onClick={handleCloseAll}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
                bg-white/80 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0"
            >
              <FaTimes size={16} className="sm:w-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50/60 min-h-0 overflow-x-hidden">
        {/* Messages would go here */}
        <div className="text-gray-500 py-8 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 text-left px-3 sm:px-4 text-sm sm:text-base overflow-x-hidden">
          No messages yet. Start a conversation!
        </div>
      </div>

      {/* Message Input - RESPONSIVE SEND BUTTON */}
      <div className="p-3 sm:p-4 border-t border-gray-200/60 flex-shrink-0 overflow-x-hidden">
        <div className="flex items-center gap-2 overflow-x-hidden">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border border-gray-300/60 rounded-xl px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              text-sm sm:text-base min-w-0 overflow-x-hidden"
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
            className="bg-blue-500 text-white p-2 sm:px-4 sm:py-2 rounded-xl hover:bg-blue-600 transition-all duration-200
              shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]
              flex items-center justify-center min-w-[40px] sm:min-w-[60px] flex-shrink-0 text-sm sm:text-base overflow-x-hidden"
          >
            <FaPaperPlane className="text-xs sm:text-sm" />
            <span className="hidden sm:inline ml-2">Send</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Main render function
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {currentView === 'list' && renderCustomersList()}
      {currentView === 'actions' && renderCustomerActions()}
      {currentView === 'payment' && renderRequestPayment()}
      {currentView === 'review' && renderRequestReview()}
      {currentView === 'chat' && renderChat()}

      {/* Render the actual AddCustomerModal component */}
      <AddCustomerModal 
        showAddCustomerModal={showAddCustomerModal}
        setShowAddCustomerModal={setShowAddCustomerModal}
      />
    </div>
  );
};

export default CustomerManagement;
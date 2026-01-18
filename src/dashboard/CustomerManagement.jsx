import React, { useState } from 'react';

import {
  FaChevronRight,
  FaTimes,
  FaRegCommentDots,
  FaMoneyBillWave,
  FaRegStar,
  FaArrowLeft,
  FaPaperPlane,
  FaUserPlus,
  FaArrowRight,
} from 'react-icons/fa';
import { sendReviewRequest } from '../companyApi';
import AddCustomerModal from './AddCustomerModal';
import fatoraLogo from "../assets/fatora.webp";;

const CustomerManagement = ({
  loyalCustomers = [],
  onRemoveCustomer,
  onRequestPayment,
  onRequestReview,
  onSendMessage,
  messages = [], // New prop for chat messages
  onChatEnter,   // New prop when entering chat view
  companyId,     // To identify own messages
  products = [],  // New prop for product selection
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [reviewType, setReviewType] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(''); // Stores product_id or serviceName
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setCurrentView('actions');
  };

  const handleRemoveCustomer = () => {
    onRemoveCustomer?.(selectedCustomer);
    setCurrentView('list');
    setSelectedCustomer(null);
  };

  const handleRequestPayment = () => {
    onRequestPayment?.(selectedCustomer);
    setCurrentView('actions');
  };

  const handleRequestReview = async () => {
    if (!selectedCustomer || !reviewType || !selectedItemId) {
      alert("Please select what you want to request a review for.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = {
        company_id: companyId,
        customer_id: selectedCustomer.customerId || selectedCustomer.id,
      };

      if (reviewType === 'product') {
        data.product_id = selectedItemId;
      } else {
        data.service_name = selectedItemId;
      }

      const response = await sendReviewRequest(data);
      alert(response.data?.message || "Review request sent successfully!");

      setCurrentView('actions');
      setReviewType('');
      setSelectedItemId('');
    } catch (error) {
      console.error("Error sending review request:", error);
      alert(error.response?.data?.message || "Failed to send review request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = (message) => {
    onSendMessage?.(selectedCustomer, message);
  };

  const handleBack = () => {
    if (currentView === 'actions') {
      setCurrentView('list');
      setSelectedCustomer(null);
    } else if (['payment', 'review', 'chat'].includes(currentView)) {
      setCurrentView('actions');
    }
  };

  const handleCloseAll = () => {
    setCurrentView('list');
    setSelectedCustomer(null);
  };

  // =====================================================================
  // CUSTOMER LIST
  // =====================================================================
  const renderCustomersList = () => (
    <div className="space-y-3 overflow-x-hidden w-full min-w-0">
      {loyalCustomers.map((customer) => (
        <div
          key={customer.id}
          className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
            hover:border-blue-200/60 overflow-hidden min-w-0"
          onClick={() => handleCustomerClick(customer)}
        >
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-semibold text-gray-900 truncate">{customer.name}</div>
            <div className="text-gray-600 text-sm truncate">{customer.phone}</div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 overflow-hidden">
            {customer.orders > 0 && (
              <span className="bg-blue-500/10 text-blue-600 px-2 py-1 rounded text-sm font-semibold border border-blue-200/60 whitespace-nowrap">
                {customer.orders}
              </span>
            )}
            <FaChevronRight className="text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );

  // =====================================================================
  // CUSTOMER ACTIONS
  // =====================================================================
  const renderCustomerActions = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl w-full mx-auto border border-gray-200/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] overflow-hidden min-w-0">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200/60 relative overflow-hidden">
          <button
            onClick={handleBack}
            className="absolute left-4 sm:left-6 top-4 sm:top-6 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60 shadow"
          >
            <FaArrowLeft size={18} />
          </button>

          <div className="text-left pl-12 sm:pl-14 pr-4 min-w-0 overflow-hidden">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{selectedCustomer.name}</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base truncate">{selectedCustomer.phone}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 sm:p-6 space-y-4 overflow-hidden">
          {[
            //   {
            //   label: 'Create Fatora',
            //   icon: (
            //     <div className="flex items-center gap-2">
            //       <img
            //         src={fatoraLogo}
            //         alt="Fatora"
            //         className="w-4 h-4 object-contain"
            //       />

            //     </div>
            //   ),
            //   action: () => setCurrentView('payment'),
            // },
            {
              label: 'Request Review',
              icon: <FaRegStar className="text-blue-500" />,
              action: () => setCurrentView('review'),
            }, {
              label: 'Chat',
              icon: <FaRegCommentDots className="text-blue-500" />,
              action: () => {
                setCurrentView('chat');
                onChatEnter?.(selectedCustomer);
              },
            }].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className="w-full flex items-center gap-3 bg-white/80 text-gray-900 py-3 px-4 rounded-xl border border-gray-200/60
              hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-200 text-sm sm:text-base shadow overflow-hidden min-w-0"
              >
                {btn.icon}
                <span className="truncate">{btn.label}</span>
              </button>
            ))}
        </div>

        {/* Remove */}
        <div className="p-4 sm:p-6 border-t border-gray-200/60 overflow-hidden">
          <button
            onClick={handleRemoveCustomer}
            className="w-full flex items-center gap-3 bg-white/80 text-red-600 py-3 px-4 rounded-xl border border-red-300 hover:bg-red-500/10 hover:border-red-500 transition-all duration-200
            shadow text-sm sm:text-base overflow-hidden min-w-0"
          >
            <FaTimes />
            <span className="truncate">Remove Customer</span>
          </button>
        </div>
      </div>
    );
  };

  // =====================================================================
  // PAYMENT (now Create Fatora)
  // =====================================================================
  const renderRequestPayment = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/60 shadow overflow-hidden min-w-0">
        <div className="p-4 sm:p-6 border-b border-gray-200/60 overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden min-w-0">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200/60 text-gray-600 shadow"
            >
              <FaArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-3 flex-1 ml-3 min-w-0 overflow-hidden">
              <img
                src={fatoraLogo}
                alt="Fatora"
                className="w-5 h-5 object-contain"
              />
              <div className="min-w-0 overflow-hidden">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Create Fatora</h2>
                <p className="text-gray-600 text-sm sm:text-base truncate">{selectedCustomer.name}</p>
              </div>
            </div>

            <button
              onClick={handleCloseAll}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200/60 text-gray-600 shadow"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 overflow-hidden min-w-0">
          <p className="text-gray-600 text-sm">Register at Skpcash</p>

          <button
            onClick={handleRequestPayment}
            className="w-full bg-white/80 py-3 px-4 rounded-xl border border-gray-200/60 hover:bg-blue-500/10 hover:border-blue-500 transition-all text-left shadow text-sm sm:text-base min-w-0"
          >
            SkipCash
          </button>

          <button
            onClick={handleRequestPayment}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-all shadow text-sm sm:text-base min-w-0"
          >
            Register
          </button>
        </div>
      </div>
    );
  };

  // =====================================================================
  // REVIEW
  // =====================================================================
  const renderRequestReview = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/60 shadow overflow-hidden min-w-0">
        <div className="p-4 sm:p-6 border-b border-gray-200/60 overflow-hidden">
          <div className="flex items-center justify-between gap-2 overflow-hidden min-w-0">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200/60 text-gray-600 shadow"
            >
              <FaArrowLeft size={18} />
            </button>

            <div className="flex-1 ml-3 min-w-0 overflow-hidden">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Request Review</h2>
              <p className="text-gray-600 text-sm sm:text-base truncate">{selectedCustomer.name}</p>
            </div>

            <button
              onClick={handleCloseAll}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200/60 text-gray-600 shadow"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-b border-gray-200/60 overflow-hidden min-w-0">
          <p className="text-gray-600 text-xs sm:text-sm">
            A form will be sent to {selectedCustomer.name} to submit her review on the product you sell her or the service you provide
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 overflow-hidden min-w-0">
          {[{
            type: 'company',
            label: 'Review for Service',
          }, {
            type: 'product',
            label: 'Review a product',
          }].map((item, i) => (
            <div key={i} className="space-y-3">
              <label
                className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200/60 cursor-pointer hover:bg-blue-500/10 transition-all shadow text-sm sm:text-base overflow-hidden min-w-0"
              >
                <input
                  type="radio"
                  name="reviewType"
                  value={item.type}
                  checked={reviewType === item.type}
                  onChange={(e) => {
                    setReviewType(e.target.value);
                    setSelectedItemId('');
                  }}
                  className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <span>{item.label}</span>
              </label>

              {/* Selection Dropdown for Product/Service */}
              {reviewType === item.type && (
                <div className="pl-7 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {item.type === 'product' ? (
                    <select
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                    >
                      <option value="">Select a Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                    >
                      <option value="">Select a Service</option>
                      {/* Using common services as fallback or from company specialties if passed */}
                      {["Carpenter", "Curtains & Blind", "Lighting", "Paint", "Carpet"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200/60 overflow-hidden min-w-0">
          <button
            onClick={handleRequestReview}
            disabled={!reviewType || !selectedItemId || isSubmitting}
            className={`w-full py-3 px-4 rounded-xl text-sm sm:text-base transition-all duration-200 overflow-hidden min-w-0 flex items-center justify-center gap-2
              ${(reviewType && selectedItemId && !isSubmitting)
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaPaperPlane className="text-xs" />
            )}
            <span>{isSubmitting ? 'Sending...' : 'Request a Review'}</span>
          </button>
        </div>
      </div>
    );
  };

  // =====================================================================
  // CHAT
  // =====================================================================
  const renderChat = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl w-full flex flex-col border border-gray-200/60 shadow h-[calc(100vh-200px)] min-h-[600px] overflow-hidden min-w-0">

        {/* HEADER (fixed, no extra space) */}
        <div className="p-3 sm:p-4 border-b border-gray-200/60 flex-shrink-0 overflow-hidden min-w-0">
          <div className="flex items-center justify-between gap-2 overflow-hidden min-w-0">

            {/* Left */}
            <div className="flex items-center space-x-3 min-w-0 overflow-hidden whitespace-nowrap">
              <button
                onClick={handleBack}
                className="p-2 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200/60 text-gray-600 shadow"
              >
                <FaArrowLeft size={16} />
              </button>

              <div className="min-w-0 overflow-hidden text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{selectedCustomer.name}</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${selectedCustomer.online
                    ? 'bg-green-500/10 text-green-600 border-green-200/60'
                    : 'bg-gray-500/10 text-gray-600 border-gray-200/60'
                    }`}
                >
                  {selectedCustomer.online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 flex-shrink-0 overflow-hidden">
              <button
                onClick={() => setShowAddCustomerModal(true)}
                className="flex items-center bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-all text-xs sm:text-sm shadow whitespace-nowrap"
              >
                <FaUserPlus size={12} />
                <span className="hidden sm:inline ml-1">Add</span>
              </button>

              <button
                onClick={handleCloseAll}
                className="p-2 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200/60 text-gray-600 shadow"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50/60 min-w-0 flex flex-col space-y-3">
          {messages.length === 0 ? (
            <div className="text-gray-500 py-8 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 text-left px-4">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map((msg) => {
              // Determine if message is from me (Company) or them (Customer)
              // Ensure consistent comparison by converting both to String
              const isMe = String(msg.sender_id) === String(companyId);

              return (
                <div
                  key={msg.id}
                  className={`flex w-full mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-sm sm:text-base shadow-sm break-words relative transition-all ${isMe
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-200/60 rounded-tl-none'
                      }`}
                  >
                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {msg.attachments.map((att) => (
                          <img
                            key={att.id}
                            src={att.path}
                            alt="attachment"
                            className="w-32 h-32 object-cover rounded-xl border border-white/20 shadow-sm"
                          />
                        ))}
                      </div>
                    )}

                    {msg.body && <p className="leading-relaxed">{msg.body}</p>}

                    <span className={`text-[10px] sm:text-xs block text-right mt-1.5 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* INPUT */}
        <div className="p-3 sm:p-4 border-t border-gray-200/60 flex-shrink-0 overflow-hidden min-w-0">
          <div className="flex items-center gap-2 overflow-hidden w-full max-w-full min-w-0">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300/60 rounded-xl px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base shadow min-w-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleSendMessage(e.target.value);
                  e.target.value = '';
                }
              }}
            />

            <button
              onClick={(e) => {
                const input = e.target.closest('div').querySelector('input');
                if (input.value.trim()) {
                  handleSendMessage(input.value);
                  input.value = '';
                }
              }}
              className="bg-blue-500 text-white p-2 sm:px-4 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center min-w-[40px] sm:min-w-[60px] text-sm shadow"
            >
              <FaPaperPlane className="text-xs sm:text-sm" />
              <span className="hidden sm:inline ml-2">Send</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-full overflow-hidden min-w-0">
      {currentView === 'list' && renderCustomersList()}
      {currentView === 'actions' && renderCustomerActions()}
      {currentView === 'payment' && renderRequestPayment()}
      {currentView === 'review' && renderRequestReview()}
      {currentView === 'chat' && renderChat()}

      <AddCustomerModal
        showAddCustomerModal={showAddCustomerModal}
        setShowAddCustomerModal={setShowAddCustomerModal}
      />
    </div>
  );
};

export default CustomerManagement;
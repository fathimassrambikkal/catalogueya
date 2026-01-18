import React, { useState, useEffect } from 'react';
import { FaUsers, FaBell } from 'react-icons/fa';
import AddCustomerModal from './AddCustomerModal';
import SendNotificationModal from './SendNotificationModal';
import CustomerManagement from './CustomerManagement';
import {
  getCompanyConversations,
  getCompanyConversationMessages,
  sendCompanyMessage,
  markCompanyConversationRead
} from '../companyApi';

function Contacts({ companyInfo, products }) {
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [loyalCustomers, setLoyalCustomers] = useState([]);
  const [messages, setMessages] = useState([]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await getCompanyConversations();
      if (response.data && response.data.data) {
        // Map API response to the format expected by CustomerManagement
        const mappedCustomers = response.data.data.map(conv => {
          const participant = conv.other_participant || {};
          return {
            id: conv.id, // Conversation ID
            customerId: participant.id,
            name: participant.name_en || 'Unknown', // Show User's Name
            phone: participant.phone || '',       // Show Phone Number
            image: participant.image,
            orders: 0, // Not provided in API
            online: participant.status === 'active',
            unread_count: conv.unread_count
          };
        });
        setLoyalCustomers(mappedCustomers);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Handlers
  const handleRemoveCustomer = (customer) => console.log('Removing:', customer.name);

  const handleSendNotification = (customer, type) =>
    console.log('Sending notification:', type, 'to', customer.name);

  const handleRequestPayment = (customer) =>
    console.log('Requesting payment from:', customer.name);

  const handleRequestReview = (customer, reviewType) =>
    console.log('Review request from:', customer.name, 'for', reviewType);

  // Fetch messages when entering chat
  const handleChatEnter = async (customer) => {
    if (!customer?.id) return;
    try {
      setMessages([]); // Clear previous messages
      const response = await getCompanyConversationMessages(customer.id);
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      }

      // Mark as read
      await markCompanyConversationRead(customer.id);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (customer, messageText) => {
    if (!customer?.id || !messageText.trim()) return;

    try {
      // optimistic update or just fetch after send?
      // For now, fetch after send for simplicity and accuracy
      await sendCompanyMessage(customer.id, { body: messageText, attachments: [] });

      // Refresh messages
      const response = await getCompanyConversationMessages(customer.id);
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      {/* MAIN WRAPPER */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 lg:p-6 overflow-x-hidden w-full min-w-0">

        {/* MAIN CARD */}
        <div className="bg-white/80 backdrop-blur-lg p-3 sm:p-4 lg:p-6 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            rounded-xl max-w-full overflow-x-hidden min-w-0">

          {/* HEADER */}
          <div className="flex flex-row justify-between items-center gap-3 mb-4 sm:mb-6 min-w-0 w-full overflow-x-hidden">

            {/* Left */}
            <div className="flex items-center gap-3 min-w-0 flex-1 overflow-x-hidden">
              <div className="flex items-center gap-2 min-w-0 overflow-x-hidden">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Contacts
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="flex-shrink-0 overflow-x-hidden">
              <button
                onClick={() => setShowNotificationModal(true)}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-all duration-200
                  shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)] text-sm font-medium whitespace-nowrap flex-shrink-0 min-w-0"
              >
                <FaBell className="text-sm flex-shrink-0" />
                <span>Notify</span>
              </button>
            </div>
          </div>

          {/* MAIN CUSTOMER MANAGEMENT */}
          <div className="w-full overflow-hidden max-w-full min-w-0">
            <CustomerManagement
              loyalCustomers={loyalCustomers}
              onRemoveCustomer={handleRemoveCustomer}
              onRequestPayment={handleRequestPayment}
              onRequestReview={handleRequestReview}
              onSendMessage={handleSendMessage}
              onChatEnter={handleChatEnter}
              messages={messages}
              companyId={companyInfo?.id}
              products={products}
            />
          </div>

        </div>
      </div>

      {/* MODALS */}
      <AddCustomerModal
        showAddCustomerModal={showAddCustomerModal}
        setShowAddCustomerModal={setShowAddCustomerModal}
      />

      <SendNotificationModal
        showNotificationModal={showNotificationModal}
        setShowNotificationModal={setShowNotificationModal}
        products={products}
        loyalCustomers={loyalCustomers}
      />
    </>
  );
}

export default Contacts;

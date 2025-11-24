import React, { useState } from 'react';
import { FaPlus, FaBell, FaUsers } from 'react-icons/fa';
import AddCustomerModal from './AddCustomerModal';
import SendNotificationModal from './SendNotificationModal';
import CustomerManagement from './CustomerManagement';

function Contacts({ companyInfo, products }) {
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Sample data - replace with actual data from props or API
  const loyalCustomers = [
    { id: 1, name: 'Sara', phone: '66070009', orders: 3, online: true },
    { id: 2, name: 'Fathima', phone: '66070009', orders: 3, online: false },
    { id: 3, name: 'Fatma', phone: '66070009', orders: 3, online: true },
    { id: 4, name: 'Reseeeem', phone: '66070009', orders: 0, online: false },
    { id: 5, name: 'Twennjiree', phone: '66070009', orders: 0, online: true },
    { id: 6, name: 'Tolga', phone: '66070009', orders: 0, online: false }
  ];

  // Customer management handlers
  const handleRemoveCustomer = (customer) => {
    console.log('Removing customer:', customer.name);
    // Add your remove customer logic here
  };

  const handleSendNotification = (customer, type) => {
    console.log('Sending notification to', customer.name, ':', type);
    // Add your send notification logic here
  };

  const handleRequestPayment = (customer) => {
    console.log('Requesting payment from', customer.name);
    // Add your request payment logic here
  };

  const handleRequestReview = (customer, reviewType) => {
    console.log('Requesting review from', customer.name, 'for:', reviewType);
    // Add your request review logic here
  };

  const handleSendMessage = (customer, message) => {
    console.log('Sending message to', customer.name, ':', message);
    // Add your send message logic here
  };

  return (
    <>
      {/* Main Contacts View */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
        {/* Our Customers Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/60 p-6
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
          
          {/* Header Section with Title and Buttons in one line */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Left side - Title and customer count */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-500" />
                <span className="text-2xl font-bold text-gray-900">Our Customers</span>
              </div>
              <span className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200/60">
                {loyalCustomers.length} Loyal Customers
              </span>
            </div>

            {/* Right side - Small buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAddCustomerModal(true)}
                className="flex items-center gap-2 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm
                  shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]"
              >
                <FaPlus size={14} />
                Add Customers
              </button>
              
              <button 
                onClick={() => setShowNotificationModal(true)}
                className="flex items-center gap-2 bg-white/80 text-gray-700 py-2 px-3 rounded-lg border border-gray-200/60 hover:bg-white transition-all duration-200 text-sm
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
              >
                <FaBell size={14} />
                Send Notification
              </button>
            </div>
          </div>

          {/* Customer Management Component */}
          <CustomerManagement
            loyalCustomers={loyalCustomers}
            onRemoveCustomer={handleRemoveCustomer}
            onSendNotification={handleSendNotification}
            onRequestPayment={handleRequestPayment}
            onRequestReview={handleRequestReview}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>

      {/* Imported Modals */}
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
import React, { useState } from 'react';
import { FaPlus, FaBell, FaUsers } from 'react-icons/fa';
import AddCustomerModal from './AddCustomerModal';
import SendNotificationModal from './SendNotificationModal';
import CustomerManagement from './CustomerManagement'; // Import the CustomerManagement component

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
      <div className="max-w-4xl p-6">
        {/* Our Customers Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaUsers className="text-blue-600" />
            <span className="text-xl font-semibold">Our Customers</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {loyalCustomers.length} Loyal Customers
            </span>
          </div>
          
          {/* Top Two Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => setShowAddCustomerModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              Add Customers
            </button>
            
            <button 
              onClick={() => setShowNotificationModal(true)}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaBell />
              Send Notification
            </button>
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
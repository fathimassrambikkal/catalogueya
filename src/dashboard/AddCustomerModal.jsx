import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const AddCustomerModal = ({ showAddCustomerModal, setShowAddCustomerModal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const directMessageCustomers = [
    { id: 1, name: 'Sara', phone: '66070009', type: 'direct' },
    { id: 2, name: 'Fathima', phone: '66070009', type: 'direct' },
    { id: 3, name: 'Fatma', phone: '66070009', type: 'direct' }
  ];

  const suggestedCustomers = [
    { id: 4, name: 'Ahmed', phone: '66070010', type: 'suggested' },
    { id: 5, name: 'Mohammed', phone: '66070011', type: 'suggested' },
    { id: 6, name: 'Layla', phone: '66070012', type: 'suggested' }
  ];

  // Combine all customers for search
  const allCustomers = [...directMessageCustomers, ...suggestedCustomers];

  // Filter customers based on search term
  const filteredCustomers = allCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  // Check if we're in search mode
  const isSearching = searchTerm.length > 0;

  // Group filtered customers by type for search results
  const searchResultsByType = {
    direct: filteredCustomers.filter(customer => customer.type === 'direct'),
    suggested: filteredCustomers.filter(customer => customer.type === 'suggested')
  };

  return (
    <>
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b relative">
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Add Customers</h2>
              <p className="text-gray-600 mt-2">Customers who sent you Direct Messages</p>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            {isSearching && (
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold mb-4">
                  Search Results {filteredCustomers.length > 0 && `(${filteredCustomers.length})`}
                </h3>
                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No customers found for "{searchTerm}"
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Show Direct Message customers in search results */}
                    {searchResultsByType.direct.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Direct Message Customers</h4>
                        {searchResultsByType.direct.map((customer) => (
                          <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
                            <div>
                              <div className="font-semibold text-gray-800">{customer.name}</div>
                              <div className="text-gray-600">{customer.phone}</div>
                            </div>
                            <div className="flex gap-2">
                              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Add Customer
                              </button>
                              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Show Suggested customers in search results */}
                    {searchResultsByType.suggested.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Suggested Customers</h4>
                        {searchResultsByType.suggested.map((customer) => (
                          <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
                            <div>
                              <div className="font-semibold text-gray-800">{customer.name}</div>
                              <div className="text-gray-600">{customer.phone}</div>
                            </div>
                            <div className="flex gap-2">
                              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Add Customer
                              </button>
                              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Regular View (when not searching) */}
            {!isSearching && (
              <>
                {/* Direct Message Customers */}
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold mb-4">Direct Message Customers</h3>
                  <div className="space-y-4">
                    {directMessageCustomers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-gray-800">{customer.name}</div>
                          <div className="text-gray-600">{customer.phone}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Add Customer
                          </button>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Customers */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Suggested Customers</h3>
                  <div className="space-y-4">
                    {suggestedCustomers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-gray-800">{customer.name}</div>
                          <div className="text-gray-600">{customer.phone}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Add Customer
                          </button>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AddCustomerModal;
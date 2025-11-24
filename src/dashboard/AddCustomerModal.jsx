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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200/60
            shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200/60 relative">
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="absolute right-6 top-6 text-gray-500 hover:text-red-500 transition-colors p-2 rounded-xl
                  bg-white/80 backdrop-blur-lg border border-gray-200/60
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
              >
                <FaTimes size={18} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Add Customers</h2>
              <p className="text-gray-600 mt-2">Customers who sent you Direct Messages</p>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200/60">
              <div className="relative">
                <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-12 pr-10 py-3 border border-gray-300/60 rounded-xl bg-white/80 backdrop-blur-sm
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            {isSearching && (
              <div className="p-6 border-b border-gray-200/60">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Search Results {filteredCustomers.length > 0 && `(${filteredCustomers.length})`}
                </h3>
                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60">
                    No customers found for "{searchTerm}"
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Show Direct Message customers in search results */}
                    {searchResultsByType.direct.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Direct Message Customers</h4>
                        {searchResultsByType.direct.map((customer) => (
                          <div key={customer.id} className="flex items-center justify-between p-4 rounded-xl mb-3
                            bg-white/80 backdrop-blur-lg border border-gray-200/60
                            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
                            <div>
                              <div className="font-semibold text-gray-900">{customer.name}</div>
                              <div className="text-gray-600">{customer.phone}</div>
                            </div>
                            <div className="flex gap-2">
                              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200
                                shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]">
                                Add Customer
                              </button>
                              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200
                                shadow-[3px_3px_10px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_15px_rgba(239,68,68,0.4)]">
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
                          <div key={customer.id} className="flex items-center justify-between p-4 rounded-xl mb-3
                            bg-white/80 backdrop-blur-lg border border-gray-200/60
                            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
                            <div>
                              <div className="font-semibold text-gray-900">{customer.name}</div>
                              <div className="text-gray-600">{customer.phone}</div>
                            </div>
                            <div className="flex gap-2">
                              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200
                                shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]">
                                Add Customer
                              </button>
                              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200
                                shadow-[3px_3px_10px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_15px_rgba(239,68,68,0.4)]">
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

            {/* Regular View  */}
            {!isSearching && (
              <>
                {/* Direct Message Customers */}
                <div className="p-6 border-b border-gray-200/60">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Direct Message Customers</h3>
                  <div className="space-y-4">
                    {directMessageCustomers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 rounded-xl
                        bg-white/80 backdrop-blur-lg border border-gray-200/60
                        shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
                        <div>
                          <div className="font-semibold text-gray-900">{customer.name}</div>
                          <div className="text-gray-600">{customer.phone}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200
                            shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]">
                            Add Customer
                          </button>
                          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200
                            shadow-[3px_3px_10px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_15px_rgba(239,68,68,0.4)]">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Customers */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Customers</h3>
                  <div className="space-y-4">
                    {suggestedCustomers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 rounded-xl
                        bg-white/80 backdrop-blur-lg border border-gray-200/60
                        shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
                        <div>
                          <div className="font-semibold text-gray-900">{customer.name}</div>
                          <div className="text-gray-600">{customer.phone}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200
                            shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]">
                            Add Customer
                          </button>
                          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200
                            shadow-[3px_3px_10px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_15px_rgba(239,68,68,0.4)]">
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
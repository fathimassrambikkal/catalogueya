import React, { useState, lazy, Suspense, useCallback, useMemo } from 'react';
import { FaSearch, FaTimes, FaUser, FaUserMinus, FaSpinner } from 'react-icons/fa';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <div className="text-red-600 font-semibold mb-2">Something went wrong</div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Skeleton Component
const CustomerSkeleton = () => (
  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200/60 animate-pulse gap-3">
    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
        <div className="h-3 sm:h-4 bg-gray-300 rounded w-20 sm:w-24"></div>
        <div className="h-2 sm:h-3 bg-gray-200 rounded w-16 sm:w-20"></div>
      </div>
    </div>
    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
      <div className="w-16 h-7 sm:w-20 sm:h-8 bg-gray-300 rounded-lg"></div>
      <div className="w-12 h-7 sm:w-16 sm:h-8 bg-gray-300 rounded-lg"></div>
    </div>
  </div>
);

// Enhanced Button Component with Micro-interactions
const EnhancedButton = ({ 
  children, 
  icon: Icon,
  onClick, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = "px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 justify-center relative overflow-hidden text-xs sm:text-sm flex-shrink-0";
  
  const variants = {
    primary: `bg-blue-500 text-white shadow-[2px_2px_8px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_12px_rgba(59,130,246,0.4)] ${
      disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'
    }`,
    danger: `bg-red-500 text-white shadow-[2px_2px_8px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_12px_rgba(239,68,68,0.4)] ${
      disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-red-600'
    }`,
    secondary: `bg-gray-500 text-white shadow-[2px_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_12px_rgba(0,0,0,0.15)] ${
      disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-gray-600'
    }`
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        isPressed ? 'scale-95' : isHovered && !disabled ? 'scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <FaSpinner className="animate-spin flex-shrink-0 text-xs" />
      ) : (
        Icon && <Icon className="flex-shrink-0 text-xs sm:text-sm" />
      )}
      <span className={`${loading ? 'opacity-0' : 'opacity-100'} truncate`}>{children}</span>
      
      {/* Ripple Effect */}
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <span className={`absolute inset-0 bg-white/20 transform scale-0 transition-transform duration-300 ${
          isPressed ? 'scale-100' : ''
        }`}></span>
      </span>
    </button>
  );
};

const AddCustomerModal = ({ showAddCustomerModal, setShowAddCustomerModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStates, setLoadingStates] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Memoized data processing
  const allCustomers = useMemo(() => 
    [...directMessageCustomers, ...suggestedCustomers], 
    []
  );

  const filteredCustomers = useMemo(() => 
    allCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    ), 
    [allCustomers, searchTerm]
  );

  const isSearching = searchTerm.length > 0;

  const searchResultsByType = useMemo(() => ({
    direct: filteredCustomers.filter(customer => customer.type === 'direct'),
    suggested: filteredCustomers.filter(customer => customer.type === 'suggested')
  }), [filteredCustomers]);

  // Enhanced handlers with error handling and loading states
  const handleSaveContact = useCallback(async (customerId) => {
    setLoadingStates(prev => ({ ...prev, [customerId]: 'save' }));
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
      
      // Simulate occasional errors for demonstration
      if (Math.random() < 0.1) {
        throw new Error('Failed to save contact. Please try again.');
      }
      
      console.log('Saved contact:', customerId);
      // Add your actual save contact logic here
      
    } catch (err) {
      setError(err.message);
      console.error('Error saving contact:', err);
    } finally {
      setLoadingStates(prev => ({ ...prev, [customerId]: false }));
    }
  }, []);

  const handleRemoveContact = useCallback(async (customerId) => {
    setLoadingStates(prev => ({ ...prev, [customerId]: 'remove' }));
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 500));
      
      if (Math.random() < 0.1) {
        throw new Error('Failed to remove contact. Please try again.');
      }
      
      console.log('Removed contact:', customerId);
      // Add your actual remove contact logic here
      
    } catch (err) {
      setError(err.message);
      console.error('Error removing contact:', err);
    } finally {
      setLoadingStates(prev => ({ ...prev, [customerId]: false }));
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddCustomerModal(false);
    setSearchTerm('');
    setError(null);
    setLoadingStates({});
  }, [setShowAddCustomerModal]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setError(null);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleCloseModal();
    }
  }, [handleCloseModal]);

  React.useEffect(() => {
    if (showAddCustomerModal) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showAddCustomerModal, handleKeyDown]);

  // Render customer item with enhanced interactions
  const renderCustomerItem = (customer) => (
    <div 
      key={customer.id}
      className="flex items-center justify-between p-3 sm:p-4 rounded-xl group gap-2 sm:gap-3
        bg-white/80 backdrop-blur-lg border border-gray-200/60
        shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
        hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
        hover:border-blue-200/60 transition-all duration-300 transform hover:scale-[1.02] min-w-0"
      role="listitem"
      aria-label={`Contact: ${customer.name}, Phone: ${customer.phone}`}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-lg">
            {customer.name.charAt(0)}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-white ${
            customer.type === 'direct' ? 'bg-green-500' : 'bg-blue-500'
          }`}></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 truncate text-xs sm:text-sm">{customer.name}</div>
          <div className="text-gray-600 truncate text-xs">{customer.phone}</div>
        </div>
      </div>
      
      {/* Action Buttons - Always in same row, perfectly aligned */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <EnhancedButton
          icon={FaUser}
          variant="primary"
          loading={loadingStates[customer.id] === 'save'}
          onClick={() => handleSaveContact(customer.id)}
          className="min-w-[75px] sm:min-w-[90px]"
        >
          Save
        </EnhancedButton>
        <EnhancedButton
          icon={FaUserMinus}
          variant="danger"
          loading={loadingStates[customer.id] === 'remove'}
          onClick={() => handleRemoveContact(customer.id)}
          className="min-w-[60px] sm:min-w-[70px]"
        >
          Remove
        </EnhancedButton>
      </div>
    </div>
  );

  if (!showAddCustomerModal) return null;

  return (
    <ErrorBoundary>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
      >
        <div 
          className="bg-white/90 backdrop-blur-lg rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200/60
            shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-in fade-in-90 slide-in-from-bottom-10 duration-300 mx-2 sm:mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200/60">
            <div className="flex-1 min-w-0">
              <h2 id="modal-title" className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                Add Contacts
              </h2>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm" id="modal-description">
                Customers who sent you Direct Messages
              </p>
            </div>
            <EnhancedButton
              icon={FaTimes}
              variant="secondary"
              onClick={handleCloseModal}
              className="!p-1.5 sm:!p-2 !min-w-0 flex-shrink-0 ml-2"
              aria-label="Close modal"
            >
              <span className="sr-only">Close</span>
            </EnhancedButton>
          </div>

          {/* Error Display */}
          {error && (
            <div 
              className="mx-3 sm:mx-6 mt-2 sm:mt-4 p-2 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between animate-in fade-in duration-300"
              role="alert"
              aria-live="polite"
            >
              <span className="text-xs sm:text-sm flex-1 pr-2">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900 transition-colors p-1 flex-shrink-0"
                aria-label="Dismiss error"
              >
                <FaTimes size={12} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="p-3 sm:p-6 border-b border-gray-200/60">
            <div className="relative group">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500 text-sm" />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-9 sm:pl-12 pr-7 sm:pr-10 py-2 sm:py-3 border border-gray-300/60 rounded-xl bg-white/80 backdrop-blur-sm
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  hover:border-gray-400/60 text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search contacts"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:scale-110"
                  aria-label="Clear search"
                >
                  <FaTimes size={12} className="sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Search Results */}
          {isSearching && (
            <div className="p-3 sm:p-6 border-b border-gray-200/60">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                Search Results {filteredCustomers.length > 0 && `(${filteredCustomers.length})`}
              </h3>
              {filteredCustomers.length === 0 ? (
                <div 
                  className="text-center py-4 sm:py-8 text-gray-500 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 animate-in fade-in duration-300"
                  role="status"
                  aria-live="polite"
                >
                  <FaSearch className="mx-auto text-xl sm:text-3xl mb-2 opacity-50" />
                  <p className="text-xs sm:text-sm">No contacts found for "{searchTerm}"</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-4 animate-in fade-in duration-300" role="list">
                  {/* Show Direct Message contacts in search results */}
                  {searchResultsByType.direct.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Direct Message Contacts</h4>
                      <div className="space-y-2 sm:space-y-3" role="list">
                        {searchResultsByType.direct.map(renderCustomerItem)}
                      </div>
                    </div>
                  )}

                  {/* Show Suggested contacts in search results */}
                  {searchResultsByType.suggested.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Suggested Contacts</h4>
                      <div className="space-y-2 sm:space-y-3" role="list">
                        {searchResultsByType.suggested.map(renderCustomerItem)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Regular View */}
          {!isSearching && (
            <>
              {/* Direct Message Contacts */}
              <div className="p-3 sm:p-6 border-b border-gray-200/60">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Direct Message Contacts</h3>
                <div className="space-y-2 sm:space-y-4" role="list">
                  {directMessageCustomers.map(renderCustomerItem)}
                </div>
              </div>

              {/* Suggested Contacts */}
              <div className="p-3 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Suggested Contacts</h3>
                <div className="space-y-2 sm:space-y-4" role="list">
                  {suggestedCustomers.map(renderCustomerItem)}
                </div>
              </div>
            </>
          )}

          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <FaSpinner className="animate-spin text-blue-500 text-lg sm:text-2xl mx-auto mb-2" />
                <p className="text-gray-600 text-xs sm:text-sm">Processing...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(AddCustomerModal);
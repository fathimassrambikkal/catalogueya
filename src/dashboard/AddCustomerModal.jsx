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
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200/60 animate-pulse gap-2 min-w-0">
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div className="space-y-1 flex-1 min-w-0">
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="flex gap-1 flex-shrink-0">
      <div className="w-12 h-7 bg-gray-300 rounded-lg"></div>
      <div className="w-10 h-7 bg-gray-300 rounded-lg"></div>
    </div>
  </div>
);

// Enhanced Button Component with Micro-interactions - FIXED BUTTON SIZE
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

  const baseStyles = "px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 justify-center relative overflow-hidden text-sm flex-shrink-0 min-w-0";
  
  const variants = {
    primary: `bg-blue-500 text-white shadow-sm hover:shadow-md ${
      disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'
    }`,
    danger: `bg-red-500 text-white shadow-sm hover:shadow-md ${
      disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-red-600'
    }`,
    secondary: `bg-gray-500 text-white shadow-sm hover:shadow-md ${
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
        <FaSpinner className="animate-spin flex-shrink-0 text-sm" />
      ) : (
        Icon && <Icon className="flex-shrink-0 text-sm" />
      )}
      <span className={`${loading ? 'opacity-0' : 'opacity-100'} truncate`}>
        {children}
      </span>
      
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

  // Render customer item with enhanced interactions - FIXED BUTTON SIZE
  const renderCustomerItem = (customer) => (
    <div 
      key={customer.id}
      className="flex items-center justify-between p-2 sm:p-3 rounded-xl group gap-1 sm:gap-2
        bg-white/80 backdrop-blur-lg border border-gray-200/60
        shadow-sm hover:shadow-md
        hover:border-blue-200/60 transition-all duration-300 min-w-0 w-full
        max-w-[calc(100vw-32px)]"
      role="listitem"
      aria-label={`Contact: ${customer.name}, Phone: ${customer.phone}`}
    >
      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
        <div className="relative flex-shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            {customer.name.charAt(0)}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white ${
            customer.type === 'direct' ? 'bg-green-500' : 'bg-blue-500'
          }`}></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 truncate text-xs sm:text-xs">{customer.name}</div>
          <div className="text-gray-600 truncate text-xs">{customer.phone}</div>
        </div>
      </div>
      
      {/* Action Buttons - Fixed size for mobile */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <EnhancedButton
          icon={FaUser}
          variant="primary"
          loading={loadingStates[customer.id] === 'save'}
          onClick={() => handleSaveContact(customer.id)}
          className="min-w-[60px]"
          aria-label="Save contact"
        >
          Save
        </EnhancedButton>
        <EnhancedButton
          icon={FaUserMinus}
          variant="danger"
          loading={loadingStates[customer.id] === 'remove'}
          onClick={() => handleRemoveContact(customer.id)}
          className="min-w-[70px]"
          aria-label="Remove contact"
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
      >
        <div 
          className="bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl w-full max-w-full max-h-[80vh] overflow-y-auto border border-gray-200/60
            shadow-lg animate-in fade-in-90 slide-in-from-bottom-10 duration-300 mx-1 sm:mx-2
            min-w-0 max-w-[calc(100vw-16px)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200/60 sticky top-0 bg-white/90 backdrop-blur-lg z-10">
            <div className="flex-1 min-w-0">
              <h2 id="modal-title" className="text-base sm:text-lg font-bold text-gray-900 truncate">
                Add Contacts
              </h2>
              <p className="text-gray-600 mt-0.5 sm:mt-1 text-xs" id="modal-description">
                Customers who sent you Direct Messages
              </p>
            </div>
            <EnhancedButton
              icon={FaTimes}
              variant="secondary"
              onClick={handleCloseModal}
              className="!p-2 !min-w-0 flex-shrink-0 ml-2"
              aria-label="Close modal"
            >
              <span className="sr-only">Close</span>
            </EnhancedButton>
          </div>

          {/* Error Display */}
          {error && (
            <div 
              className="mx-2 sm:mx-3 mt-2 p-2 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between animate-in fade-in duration-300"
              role="alert"
              aria-live="polite"
            >
              <span className="text-xs flex-1 pr-2">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900 transition-colors p-1 flex-shrink-0"
                aria-label="Dismiss error"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="p-3 sm:p-4 border-b border-gray-200/60 sticky top-[61px] sm:top-[73px] bg-white/90 backdrop-blur-lg z-10">
            <div className="relative group">
              <FaSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500 text-xs" />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-6 sm:pl-8 pr-5 sm:pr-6 py-1.5 sm:py-2 border border-gray-300/60 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm
                  focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300
                  shadow-sm hover:border-gray-400/60 text-xs min-w-0"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search contacts"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:scale-110"
                  aria-label="Clear search"
                >
                  <FaTimes size={10} className="sm:w-[12px] sm:h-[12px]" />
                </button>
              )}
            </div>
          </div>

          {/* Content Area with Scroll */}
          <div className="overflow-y-auto p-2 sm:p-0">
            {/* Search Results */}
            {isSearching && (
              <div className="p-2 sm:p-4 border-b border-gray-200/60">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Search Results {filteredCustomers.length > 0 && `(${filteredCustomers.length})`}
                </h3>
                {filteredCustomers.length === 0 ? (
                  <div 
                    className="text-center py-3 sm:py-4 text-gray-500 rounded-lg sm:rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 animate-in fade-in duration-300"
                    role="status"
                    aria-live="polite"
                  >
                    <FaSearch className="mx-auto text-base sm:text-lg mb-1 sm:mb-2 opacity-50" />
                    <p className="text-xs">No contacts found for "{searchTerm}"</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 sm:space-y-2 animate-in fade-in duration-300" role="list">
                    {/* Show Direct Message contacts in search results */}
                    {searchResultsByType.direct.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1.5 sm:mb-2 text-xs">Direct Message Contacts</h4>
                        <div className="space-y-1.5 sm:space-y-2" role="list">
                          {searchResultsByType.direct.map(renderCustomerItem)}
                        </div>
                      </div>
                    )}

                    {/* Show Suggested contacts in search results */}
                    {searchResultsByType.suggested.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1.5 sm:mb-2 text-xs">Suggested Contacts</h4>
                        <div className="space-y-1.5 sm:space-y-2" role="list">
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
                <div className="p-2 sm:p-4 border-b border-gray-200/60">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Direct Message Contacts</h3>
                  <div className="space-y-1.5 sm:space-y-2" role="list">
                    {directMessageCustomers.map(renderCustomerItem)}
                  </div>
                </div>

                {/* Suggested Contacts */}
                <div className="p-2 sm:p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Suggested Contacts</h3>
                  <div className="space-y-1.5 sm:space-y-2" role="list">
                    {suggestedCustomers.map(renderCustomerItem)}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <FaSpinner className="animate-spin text-blue-500 text-sm sm:text-base mx-auto mb-1 sm:mb-2" />
                <p className="text-gray-600 text-xs">Processing...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(AddCustomerModal);
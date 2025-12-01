import React, { useState, useCallback, useMemo } from 'react';
import { FaSearch, FaTimes, FaUser, FaUserMinus, FaSpinner } from 'react-icons/fa';

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

const CustomerSkeleton = () => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200/60 animate-pulse gap-2 min-w-0 overflow-x-hidden w-full">
    <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
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

  const baseStyles =
    "px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 justify-center relative overflow-hidden text-sm flex-shrink-0 min-w-0";

  const variants = {
    primary: `bg-blue-500 text-white shadow-sm hover:shadow-md ${
      disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'
    }`,
    danger: `bg-red-500 text-white shadow-sm hover:shadow-md ${
      disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-red-600'
    }`,
    secondary: `bg-gray-500 text-white shadow-sm hover:shadow-md ${
      disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-gray-600'
    }`,
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
    </button>
  );
};

const AddCustomerModal = ({ showAddCustomerModal, setShowAddCustomerModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStates, setLoadingStates] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting] = useState(false);

  const directMessageCustomers = [
    { id: 1, name: 'Sara', phone: '66070009', type: 'direct' },
    { id: 2, name: 'Fathima', phone: '66070009', type: 'direct' },
    { id: 3, name: 'Fatma', phone: '66070009', type: 'direct' },
  ];

  const suggestedCustomers = [
    { id: 4, name: 'Ahmed', phone: '66070010', type: 'suggested' },
    { id: 5, name: 'Mohammed', phone: '66070011', type: 'suggested' },
    { id: 6, name: 'Layla', phone: '66070012', type: 'suggested' },
  ];

  const allCustomers = useMemo(
    () => [...directMessageCustomers, ...suggestedCustomers],
    []
  );

  const filteredCustomers = useMemo(
    () =>
      allCustomers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm)
      ),
    [allCustomers, searchTerm]
  );

  const isSearching = searchTerm.length > 0;

  const searchResultsByType = useMemo(
    () => ({
      direct: filteredCustomers.filter((customer) => customer.type === 'direct'),
      suggested: filteredCustomers.filter(
        (customer) => customer.type === 'suggested'
      ),
    }),
    [filteredCustomers]
  );

  const clearSearch = useCallback(() => setSearchTerm(''), []);

  const handleCloseModal = () => {
    setShowAddCustomerModal(false);
    setError(null);
    setSearchTerm('');
  };

  if (!showAddCustomerModal) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-50 overflow-x-hidden"
        onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
      >
        <div
          className="bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl w-full max-w-[480px] max-h-[80vh] overflow-y-auto border border-gray-200/60 shadow-lg mx-1 sm:mx-2 min-w-0 overflow-x-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200/60 sticky top-0 bg-white/90 z-10 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate flex-1 min-w-0">
              Add Contacts
            </h2>
            <EnhancedButton
              icon={FaTimes}
              variant="secondary"
              onClick={handleCloseModal}
              className="!p-2 !min-w-0"
            />
          </div>

          {/* SEARCH */}
          <div className="p-3 border-b border-gray-200/60 sticky top-[60px] bg-white/90 z-10 overflow-x-hidden">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                className="w-full pl-8 pr-6 py-2 border rounded-lg text-xs min-w-0 overflow-hidden"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <FaTimes size={10} />
                </button>
              )}
            </div>
          </div>

          {/* CONTACT LIST (No overflow horizontally now) */}
          <div className="p-2 space-y-2 overflow-x-hidden min-w-0">
            {(isSearching ? filteredCustomers : allCustomers).map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-gray-200/60 shadow-sm min-w-0 overflow-hidden"
              >
                <div className="flex items-center gap-2 min-w-0 overflow-hidden flex-1">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                    {customer.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate text-xs">{customer.name}</div>
                    <div className="truncate text-xs text-gray-600">{customer.phone}</div>
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <EnhancedButton
                    icon={FaUser}
                    variant="primary"
                    className="min-w-[50px]"
                  >
                    Save
                  </EnhancedButton>
                  <EnhancedButton
                    icon={FaUserMinus}
                    variant="danger"
                    className="min-w-[50px]"
                  >
                    Remove
                  </EnhancedButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(AddCustomerModal);

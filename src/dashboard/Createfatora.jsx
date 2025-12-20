import React, { useState } from 'react';
import fatoraLogo from "../assets/fatoralogo.webp";
import PreviewFatora from './PreviewFatora'; 

function Createfatora({ onBack }) {
  const [recipient, setRecipient] = useState('');
  const [validityDays, setValidityDays] = useState('1');
  const [customDays, setCustomDays] = useState(1);
  const [requestTip, setRequestTip] = useState(false);
  const [addDiscount, setAddDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [specialNote, setSpecialNote] = useState('');
  const [fatoraNumber, setFatoraNumber] = useState(`FTR-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceTime, setInvoiceTime] = useState(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
  const [showPreview, setShowPreview] = useState(false);
  
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: '', 
      manualName: '', 
      unit: 'Item', 
      pricePer1: '', 
      quantity: ''
    }
  ]);
  
  const [services, setServices] = useState([
    { id: 1, name: '', price: '' }
  ]);

  // Calculate price for a product
  const calculatePrice = (pricePer1, quantity) => {
    const price = parseFloat(pricePer1) || 0;
    const qty = parseFloat(quantity) || 0;
    return (price * qty).toFixed(2);
  };

  const handleAddProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { 
      id: newId, 
      name: '', 
      manualName: '', 
      unit: 'Item', 
      pricePer1: '', 
      quantity: ''
    }]);
  };

  const handleDeleteProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleAddService = () => {
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    setServices([...services, { id: newId, name: '', price: '' }]);
  };

  const handleDeleteService = (id) => {
    if (services.length > 1) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const handleProductChange = (id, field, value) => {
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        return { ...product, [field]: value };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleServiceChange = (id, field, value) => {
    const updatedServices = services.map(service => {
      if (service.id === id) {
        return { ...service, [field]: value };
      }
      return service;
    });
    setServices(updatedServices);
  };

  const calculateTotal = () => {
    const productsTotal = products.reduce((sum, product) => {
      const price = parseFloat(product.pricePer1) || 0;
      const quantity = parseFloat(product.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
    
    const servicesTotal = services.reduce((sum, service) => sum + (parseFloat(service.price) || 0), 0);
    const subtotal = productsTotal + servicesTotal;
    const discountAmount = subtotal * (discountPercentage / 100);
    return subtotal - discountAmount;
  };

  const handleCreateFatora = () => {
    console.log('Creating Fatora...');
    console.log('Products:', products);
    console.log('Services:', services);
    console.log('Total:', calculateTotal());
    
    // Validation
    if (!recipient) {
      alert('Please select a recipient');
      return;
    }
    
    // Show preview instead of creating directly
    setShowPreview(true);
  };

  const handleBackFromPreview = () => {
    setShowPreview(false);
  };

  const handleSendFatora = () => {
    alert('Fatora sent successfully!');
    onBack(); // Go back to dashboard
  };

  const handleEditFromPreview = () => {
    setShowPreview(false);
  };

  // SVG Icons
const BackIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

  const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  // If showPreview is true, show the PreviewFatora component
  if (showPreview) {
    return (
      <PreviewFatora
        data={{
          fatoraNumber,
          invoiceDate,
          invoiceTime,
          recipient,
          validityDays,
          customDays,
          products,
          services,
          requestTip,
          addDiscount,
          discountPercentage,
          specialNote
        }}
        onBack={handleBackFromPreview}
        onSend={handleSendFatora}
        onEdit={handleEditFromPreview}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
            >
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition">
                <BackIcon />
              </div>
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
          
          <div className="flex flex-col lg:justify-end">
            <div className="flex items-center gap-2 bg-white backdrop-blur-sm px-4 py-2 rounded-lg w-fit">
              <span className="text-blue-500 text-sm">Powered by</span>
              <img 
                src={fatoraLogo}
                alt="Fatora" 
                className="h-6 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* General Information Section */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">General Information</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Fatora Number */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Fatora Number</label>
                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                  <input
                    type="text"
                    className="w-full bg-transparent focus:outline-none text-gray-900 text-sm border-none p-0"
                    placeholder="Enter Fatora number"
                    value={fatoraNumber}
                    onChange={(e) => setFatoraNumber(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Date */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Date</label>
                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                  <CalendarIcon className="text-gray-400 mr-3 w-5 h-5" />
                  <input
                    type="date"
                    className="w-full bg-transparent focus:outline-none text-gray-900 text-sm border-none p-0"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Time */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Time</label>
                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                  <ClockIcon className="text-gray-400 mr-3 w-5 h-5" />
                  <input
                    type="time"
                    className="w-full bg-transparent focus:outline-none text-gray-900 text-sm border-none p-0"
                    value={invoiceTime}
                    onChange={(e) => setInvoiceTime(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Recipient */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Recipient</label>
                <div className="relative">
                  <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                    <UserIcon className="text-gray-400 mr-3 w-5 h-5" />
                    <select 
                      className="w-full bg-transparent focus:outline-none text-gray-900 text-sm border-none p-0 appearance-none"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    >
                      <option value="">Choose from contacts</option>
                      <option value="John Doe">John Doe - Customer 1</option>
                      <option value="Jane Smith">Jane Smith - Customer 2</option>
                      <option value="Robert Johnson">Robert Johnson - Customer 3</option>
                      <option value="Sarah Williams">Sarah Williams - Customer 4</option>
                    </select>
                    <div className="absolute right-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Validity - Full width on mobile, then takes last position */}
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-semibold text-gray-700">Valid For</label>
                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                  <select
                    className="w-full bg-transparent focus:outline-none text-gray-900 text-sm border-none p-0 appearance-none"
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                  >
                    <option value="1">1 Day</option>
                    <option value="2">2 Days</option>
                    <option value="3">3 Days</option>
                    <option value="7">1 Week</option>
                    <option value="14">2 Weeks</option>
                    <option value="30">1 Month</option>
                    <option value="custom">Custom</option>
                  </select>
                  {validityDays === 'custom' && (
                    <div className="flex items-center border-l border-gray-300 pl-4 ml-4">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        className="w-16 bg-transparent focus:outline-none text-gray-900 text-sm border-none p-0 text-center"
                        placeholder="Days"
                        value={customDays}
                        onChange={(e) => setCustomDays(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Products</h2>
                  <p className="text-sm text-gray-600">Add products to this invoice</p>
                </div>
              </div>
              <button
                onClick={handleAddProduct}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <PlusIcon />
                Add
              </button>
            </div>

            {/* Desktop Products Table */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="col-span-5 text-sm font-semibold text-gray-700">Product Details</div>
                <div className="col-span-2 text-sm font-semibold text-gray-700 text-center">Unit</div>
                <div className="col-span-2 text-sm font-semibold text-gray-700 text-center">Unit Price</div>
                <div className="col-span-1 text-sm font-semibold text-gray-700 text-center">Quantity</div>
                <div className="col-span-1 text-sm font-semibold text-gray-700 text-center">Total</div>
                <div className="col-span-1 text-sm font-semibold text-gray-700 text-center">Action</div>
              </div>

              {/* Products Rows */}
              {products.map((product, index) => (
                <div key={product.id} className={`grid grid-cols-12 px-6 py-4 items-center gap-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/30 transition-colors`}>
                  {/* Product Name */}
                  <div className="col-span-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="mb-2">
                          <select 
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            value={product.name}
                            onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                          >
                            <option value="">Select a product...</option>
                            <option value="Laptop Pro X1">Laptop Pro X1 - $1,299</option>
                            <option value="Wireless Mouse">Wireless Mouse - $49</option>
                            <option value="Mechanical Keyboard">Mechanical Keyboard - $129</option>
                            <option value="4K Monitor">4K Monitor - $599</option>
                            <option value="Noise Cancelling Headphones">Noise Cancelling Headphones - $299</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>or</span>
                          <input 
                            type="text" 
                            placeholder="Enter custom product name"
                            value={product.manualName}
                            onChange={(e) => handleProductChange(product.id, 'manualName', e.target.value)}
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unit */}
                  <div className="col-span-2">
                    <select
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      value={product.unit}
                      onChange={(e) => handleProductChange(product.id, 'unit', e.target.value)}
                    >
                  <option value="item">Item</option>
                  <option value="kg">Kg</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="ft">Feet</option>
                    </select>
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={product.pricePer1}
                        onChange={(e) => handleProductChange(product.id, 'pricePer1', e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">QR</span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1">
                    <input
                      type="number"
                      min="0"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  {/* Total */}
                  <div className="col-span-1">
                    <div className="text-center text-gray-900 font-semibold text-sm">
                      {calculatePrice(product.pricePer1, product.quantity)} QR
                    </div>
                  </div>

                  {/* Action */}
                  <div className="col-span-1">
                    {products.length > 1 && (
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="w-full flex justify-center p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Products View */}
            <div className="md:hidden space-y-4">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Product #{product.id}</h3>
                      <div className="space-y-2">
                        <select 
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                          value={product.name}
                          onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                        >
                          <option value="">Select product...</option>
                          <option value="Laptop Pro X1">Laptop Pro X1</option>
                          <option value="Wireless Mouse">Wireless Mouse</option>
                          <option value="Mechanical Keyboard">Mechanical Keyboard</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">or</span>
                          <input 
                            type="text" 
                            placeholder="Custom product"
                            value={product.manualName}
                            onChange={(e) => handleProductChange(product.id, 'manualName', e.target.value)}
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    {products.length > 1 && (
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Unit</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={product.unit}
                        onChange={(e) => handleProductChange(product.id, 'unit', e.target.value)}
                      >
                        <option>Item</option>
                        <option>Kg</option>
                        <option>Box</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Unit Price</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={product.pricePer1}
                          onChange={(e) => handleProductChange(product.id, 'pricePer1', e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">QR</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
                        placeholder="0"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Item Total:</span>
                      <span className="text-lg font-bold text-gray-900">
                        {calculatePrice(product.pricePer1, product.quantity)} QR
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Services</h2>
                  <p className="text-sm text-gray-600">Additional services provided</p>
                </div>
              </div>
              <button
                onClick={handleAddService}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <PlusIcon />
                Add
              </button>
            </div>
            
            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={service.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-white border border-gray-300 rounded-full text-sm font-semibold text-gray-700">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        placeholder="Service name (e.g., Installation, Maintenance, Consultation)"
                        className="bg-transparent border-0 px-0 py-1 text-sm md:text-base text-gray-900 focus:outline-none focus:ring-0 w-full placeholder-gray-500"
                        value={service.name}
                        onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        value={service.price}
                        onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">QR</span>
                    </div>
                    {services.length > 1 && (
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete service"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Tips & Discounts */}
              <div className="space-y-8">
                {/* Tips */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Tips & Gratuity</h3>
                  <p className="text-sm text-gray-600 mb-4">Do you want to request for tip?</p>
                  <div className="space-y-3">
                    {/* Yes, include tip option */}
                    <label className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-gray-300/50 hover:border-blue-400/50 hover:bg-gray-50/30 transition-all duration-200 cursor-pointer group hover:shadow-sm backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${requestTip 
                            ? 'border-blue-500 bg-blue-500 shadow-sm' 
                            : 'border-gray-400 group-hover:border-gray-500'}`}
                          >
                            {requestTip && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                          Yes, include tip option
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="tip"
                        checked={requestTip}
                        onChange={() => setRequestTip(true)}
                        className="hidden"
                      />
                    </label>

                    {/* No, don't include tip */}
                    <label className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-gray-300/50 hover:border-blue-400/50 hover:bg-gray-50/30 transition-all duration-200 cursor-pointer group hover:shadow-sm backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${!requestTip 
                            ? 'border-blue-500 bg-blue-500 shadow-sm' 
                            : 'border-gray-400 group-hover:border-gray-500'}`}
                          >
                            {!requestTip && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                          No, don't include tip
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="tip"
                        checked={!requestTip}
                        onChange={() => setRequestTip(false)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Discounts */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Discounts</h3>
                  <p className="text-sm text-gray-600 mb-4">Do you want to add special discounts?</p>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-gray-300/50 hover:border-blue-400/50 hover:bg-gray-50/30 transition-all duration-200 cursor-pointer group hover:shadow-sm backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${addDiscount 
                            ? 'border-blue-500 bg-blue-500 shadow-sm' 
                            : 'border-gray-400 group-hover:border-gray-500'}`}
                          >
                            {addDiscount && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                          Yes, apply discount
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="discount"
                        checked={addDiscount}
                        onChange={() => setAddDiscount(true)}
                        className="hidden"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-gray-300/50 hover:border-gray-400/50 hover:bg-gray-50/30 transition-all duration-200 cursor-pointer group hover:shadow-sm backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${!addDiscount 
                            ? 'border-blue-500 bg-blue-500 shadow-sm' 
                            : 'border-gray-400 group-hover:border-gray-500'}`}
                          >
                            {!addDiscount && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                          No discount
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="discount"
                        checked={!addDiscount}
                        onChange={() => setAddDiscount(false)}
                        className="hidden"
                      />
                    </label>
                    
                    {addDiscount && (
                      <div className="pt-4 mt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Discount Percentage</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              className="w-24 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                              value={discountPercentage}
                              onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-gray-700 font-medium">%</span>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          Discount amount: {((products.reduce((sum, product) => {
                            const price = parseFloat(product.pricePer1) || 0;
                            const quantity = parseFloat(product.quantity) || 0;
                            return sum + (price * quantity);
                          }, 0) + services.reduce((sum, service) => sum + (parseFloat(service.price) || 0), 0)) * discountPercentage / 100).toFixed(2)} QR
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Notes & Summary */}
              <div className="space-y-8">
                {/* Special Note */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Special Notes</h3>
                  <p className="text-sm text-gray-600 mb-4">Add any special instructions or notes for the recipient</p>
                  <textarea
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    rows="6"
                    placeholder="Example: Payment due within 30 days. Please contact us for any questions regarding this invoice..."
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                  />
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-6">Invoice Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="font-medium">
                        {(products.reduce((sum, product) => {
                          const price = parseFloat(product.pricePer1) || 0;
                          const quantity = parseFloat(product.quantity) || 0;
                          return sum + (price * quantity);
                        }, 0) + services.reduce((sum, service) => sum + (parseFloat(service.price) || 0), 0)).toFixed(2)} QR
                      </span>
                    </div>
                    {addDiscount && discountPercentage > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Discount ({discountPercentage}%)</span>
                        <span className="text-green-400 font-medium">
                          -{((products.reduce((sum, product) => {
                            const price = parseFloat(product.pricePer1) || 0;
                            const quantity = parseFloat(product.quantity) || 0;
                            return sum + (price * quantity);
                          }, 0) + services.reduce((sum, service) => sum + (parseFloat(service.price) || 0), 0)) * discountPercentage / 100).toFixed(2)} QR
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-700 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total Amount</span>
                        <span className="text-2xl md:text-3xl font-bold">
                          {calculateTotal().toFixed(2)} QR
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-between items-center gap-4 p-6 bg-white rounded-2xl shadow-xl">
          <div className="text-sm text-gray-600">
            <p>Created on {invoiceDate} at {invoiceTime}</p>
          </div>
          <div className="flex flex-row gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-[10px] md:text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateFatora}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium text-[10px] md:text-sm shadow-lg hover:shadow-xl"
            >
              Create Fatora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Createfatora;
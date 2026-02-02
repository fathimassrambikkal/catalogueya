import React, { useState, useMemo, useCallback, memo } from 'react';
import PreviewFatora from './PreviewFatora'; 
import {
  BackIcon,
  PlusIcon,
  DeleteIcon,
} from "./CompanySvg";

// Memoized components for better performance
const ProductRow = memo(({ product, index, handleProductChange, calculatePrice, handleDeleteProduct, productsLength }) => {
  const onInputChange = useCallback((field, value) => {
    handleProductChange(product.id, field, value);
  }, [product.id, handleProductChange]);

  const price = useMemo(() => calculatePrice(product.pricePer1, product.quantity), [product.pricePer1, product.quantity, calculatePrice]);

  return (
    <div className={`grid grid-cols-12 px-6 py-4 items-center gap-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/30 transition-colors`}>
      <div className="col-span-5">
        <div className="mb-2">
          <select 
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={product.name}
            onChange={(e) => onInputChange('name', e.target.value)}
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
            onChange={(e) => onInputChange('manualName', e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <div className="col-span-2">
        <select
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          value={product.unit}
          onChange={(e) => onInputChange('unit', e.target.value)}
        >
          <option value="item">Item</option>
          <option value="kg">Kg</option>
          <option value="cm">cm</option>
          <option value="m">m</option>
          <option value="ft">Feet</option>
        </select>
      </div>

      <div className="col-span-2">
        <div className="relative">
          <input
            type="number"
            min="0"
            step="0.01"
            value={product.pricePer1}
            onChange={(e) => onInputChange('pricePer1', e.target.value)}
            placeholder="0.00"
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">QR</span>
        </div>
      </div>

      <div className="col-span-1">
        <input
          type="number"
          min="0"
          value={product.quantity}
          onChange={(e) => onInputChange('quantity', e.target.value)}
          placeholder="0"
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <div className="col-span-1">
        <div className="text-center text-gray-900 font-semibold text-sm">
          {price} QR
        </div>
      </div>

      <div className="col-span-1">
      <button
  onClick={() => handleDeleteProduct(product.id)}
  className={`
    w-full flex justify-center p-2 rounded-lg transition-colors
    ${
      productsLength > 1
        ? "text-red-500 hover:text-red-700 hover:bg-red-50"
        : "text-gray-300 cursor-not-allowed"
    }
  `}
  
  title={productsLength === 1 ? "At least one product is required" : "Delete product"}
>
  <DeleteIcon  className="w-4 h-4" />
</button>

      </div>
    </div>
  );
});

ProductRow.displayName = 'ProductRow';

const MobileProductCard = memo(({ product, handleProductChange, calculatePrice, handleDeleteProduct, productsLength }) => {
  const onInputChange = useCallback((field, value) => {
    handleProductChange(product.id, field, value);
  }, [product.id, handleProductChange]);


  const price = useMemo(() => calculatePrice(product.pricePer1, product.quantity), [product.pricePer1, product.quantity, calculatePrice]);




  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">Product #{product.id}</h3>
          <div className="space-y-2">
            <select 
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
              value={product.name}
              onChange={(e) => onInputChange('name', e.target.value)}
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
                onChange={(e) => onInputChange('manualName', e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>
 <button
  onClick={() => handleDeleteProduct(product.id)}
  className={`
    w-full flex justify-center p-2 rounded-lg transition-colors
    ${
      productsLength > 1
        ? "text-red-500 hover:text-red-700 hover:bg-red-50"
        : "text-gray-300 cursor-not-allowed"
    }
  `}
  title={productsLength === 1 ? "At least one product is required" : "Delete product"}
>
  <span className="w-4 h-4 flex items-center justify-center">
    <DeleteIcon  className="w-4 h-4" />
  </span>
</button>


      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Unit</label>
          <select
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={product.unit}
            onChange={(e) => onInputChange('unit', e.target.value)}
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
              onChange={(e) => onInputChange('pricePer1', e.target.value)}
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
            onChange={(e) => onInputChange('quantity', e.target.value)}
            placeholder="0"
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Item Total:</span>
          <span className="text-lg font-bold text-gray-900">
            {price} QR
          </span>
        </div>
      </div>
    </div>
  );
});

MobileProductCard.displayName = 'MobileProductCard';

function CreateBills({ onBack }) {
  const [recipient, setRecipient] = useState('');
  const [validityDays, setValidityDays] = useState('1');
  const [customDays, setCustomDays] = useState(1);
  const [requestTip, setRequestTip] = useState(false);
  const [addDiscount, setAddDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [specialNote, setSpecialNote] = useState('');
  const [fatoraNumber, setFatoraNumber] = useState(() => `FTR-${Date.now().toString().slice(-6)}`);
  const [invoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [invoiceTime] = useState(() => new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
  const [showPreview, setShowPreview] = useState(false);
  
  const [products, setProducts] = useState([{
    id: 1, 
    name: '', 
    manualName: '', 
    unit: 'Item', 
    pricePer1: '', 
    quantity: ''
  }]);
  
  const [services, setServices] = useState([{
    id: 1, 
    name: '', 
    price: ''
  }]);

  // Memoized calculations
  const calculatePrice = useCallback((pricePer1, quantity) => {
    const price = parseFloat(pricePer1) || 0;
    const qty = parseFloat(quantity) || 0;
    return (price * qty).toFixed(2);
  }, []);

  const calculateTotal = useMemo(() => {
    const productsTotal = products.reduce((sum, product) => {
      const price = parseFloat(product.pricePer1) || 0;
      const quantity = parseFloat(product.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
    
    const servicesTotal = services.reduce((sum, service) => sum + (parseFloat(service.price) || 0), 0);
    const subtotal = productsTotal + servicesTotal;
    const discountAmount = subtotal * (discountPercentage / 100);
    return subtotal - discountAmount;
  }, [products, services, discountPercentage]);

  const productsSubtotal = useMemo(() => 
    products.reduce((sum, product) => {
      const price = parseFloat(product.pricePer1) || 0;
      const quantity = parseFloat(product.quantity) || 0;
      return sum + (price * quantity);
    }, 0),
    [products]
  );

  const servicesSubtotal = useMemo(() => 
    services.reduce((sum, service) => sum + (parseFloat(service.price) || 0), 0),
    [services]
  );

  const subtotal = useMemo(() => 
    productsSubtotal + servicesSubtotal,
    [productsSubtotal, servicesSubtotal]
  );

  const discountAmount = useMemo(() => 
    subtotal * (discountPercentage / 100),
    [subtotal, discountPercentage]
  );

  // Event handlers
  const handleAddProduct = useCallback(() => {
    setProducts(prev => [...prev, {
      id: Math.max(...prev.map(p => p.id), 0) + 1,
      name: '', 
      manualName: '', 
      unit: 'Item', 
      pricePer1: '', 
      quantity: ''
    }]);
  }, []);

const handleDeleteProduct = useCallback((id) => {
  setProducts(prev => {
    // If only one product → just reset its fields
    if (prev.length === 1) {
      return [{
        ...prev[0],
        name: '',
        manualName: '',
        pricePer1: '',
        quantity: ''
      }];
    }

    // Otherwise → remove normally
    return prev.filter(product => product.id !== id);
  });
}, []);



  const handleAddService = useCallback(() => {
    setServices(prev => [...prev, {
      id: Math.max(...prev.map(s => s.id), 0) + 1,
      name: '', 
      price: ''
    }]);
  }, []);

const handleDeleteService = useCallback((id) => {
  setServices(prev => {
    if (prev.length === 1) {
      return [{
        ...prev[0],
        name: '',
        price: ''
      }];
    }

    return prev.filter(service => service.id !== id);
  });
}, []);



  const handleProductChange = useCallback((id, field, value) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  }, []);

  const handleServiceChange = useCallback((id, field, value) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  }, []);

  const handleCreateFatora = useCallback(() => {
    if (!recipient) {
      alert('Please select a recipient');
      return;
    }
    
    setShowPreview(true);
  }, [recipient]);





  const handleSaveDraft = useCallback(() => {
  const draftPayload = {
    fatoraNumber,
    recipient,
    products,
    services,
    requestTip,
    addDiscount,
    discountPercentage,
    specialNote,
    invoiceDate,
    invoiceTime,
  };

  console.log("Saved as draft", draftPayload);

  // TODO: replace with API call
  alert("Draft saved successfully");
  onBack();
}, [
  fatoraNumber,
  recipient,
  products,
  services,
  requestTip,
  addDiscount,
  discountPercentage,
  specialNote,
  invoiceDate,
  invoiceTime,
  onBack,
]);


  const handleBackFromPreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  const handleSendFatora = useCallback(() => {
    alert('Fatora sent successfully!');
    onBack();
  }, [onBack]);

  const handleEditFromPreview = useCallback(() => {
    setShowPreview(false);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 mt-20 md:mt-0 ">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col ">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 ">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
                >
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition">
                    <BackIcon />
                  </div>
                  <span className="font-medium text-sm sm:text-base">Back to Dashboard</span>
                </button>
              </div>
            </div>
          </div>
   {/* PAGE TITLE (separate section) */}
<div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 border-b border-gray-200">
  <h1
    className="
      text-gray-900
      text-2xl sm:text-3xl md:text-4xl
      font-bold
      tracking-tight
      leading-tight
    "
  >
    Create a Bill
  </h1>
  </div>
          {/* CONTENT */}
          <div className="divide-y divide-gray-200">
            {/* General Information Section - Responsive */}
            <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 ">
             
              <h2 className="font-semibold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4 tracking-tight">
                General Information
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {/* Recipient */}
                <div>
                  <label className="block text-gray-600 text-xs sm:text-sm mb-1">
                    Recipient
                  </label>
                  <select
                    className="w-full rounded-lg bg-white/70 backdrop-blur border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option>Insert Customers information</option>
                  </select>
                </div>

                {/* First name + Surname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-gray-600 text-xs sm:text-sm mb-1">
                      Customers First Name
                    </label>
                    <input
                      className="w-full rounded-lg bg-white/80 backdrop-blur border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-xs sm:text-sm mb-1">
                      Surname
                    </label>
                    <input
                      className="w-full rounded-lg bg-white/80 backdrop-blur border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Mobile / Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 sm:gap-3 rounded-lg bg-white/80 backdrop-blur border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <input type="radio" name="contact" defaultChecked className="w-4 h-4" />
                    <span className="text-gray-700 text-xs sm:text-sm whitespace-nowrap">
                      Mobile
                    </span>
                    <input
                      className="flex-1 bg-transparent outline-none text-gray-900 text-xs sm:text-sm min-w-0"
                    />
                  </label>

                  <label className="flex items-center gap-2 sm:gap-3 rounded-lg bg-white/80 backdrop-blur border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <input type="radio" name="contact" className="w-4 h-4" />
                    <span className="text-gray-700 text-xs sm:text-sm whitespace-nowrap">
                      Email
                    </span>
                    <input
                      className="flex-1 bg-transparent outline-none text-gray-900 text-xs sm:text-sm min-w-0"
                    />
                  </label>
                </div>

                {/* Valid For */}
                <div className="max-w-[140px] sm:max-w-[200px]">
                  <label className="block text-gray-600 text-xs sm:text-sm mb-1">
                    Valid for
                  </label>
                  <select
                    className="w-full rounded-lg bg-white/70 backdrop-blur border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option>1 Day</option>
                    <option>3 Days</option>
                    <option>1 Week</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Products</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Add products to this invoice</p>
                  </div>
                </div>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm"
                >
                  <PlusIcon />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>

              {/* Desktop Products Table */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <div className="col-span-5 text-xs sm:text-sm font-semibold text-gray-700">Product Details</div>
                  <div className="col-span-2 text-xs sm:text-sm font-semibold text-gray-700 text-center">Unit</div>
                  <div className="col-span-2 text-xs sm:text-sm font-semibold text-gray-700 text-center">Unit Price</div>
                  <div className="col-span-1 text-xs sm:text-sm font-semibold text-gray-700 text-center">Quantity</div>
                  <div className="col-span-1 text-xs sm:text-sm font-semibold text-gray-700 text-center">Total</div>
                  <div className="col-span-1 text-xs sm:text-sm font-semibold text-gray-700 text-center">Action</div>
                </div>

                {/* Products Rows - Memoized */}
                {products.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    index={index}
                    handleProductChange={handleProductChange}
                    calculatePrice={calculatePrice}
                    handleDeleteProduct={handleDeleteProduct}
                    productsLength={products.length}
                  />
                ))}
              </div>

              {/* Mobile Products View - Memoized */}
              <div className="md:hidden space-y-3 sm:space-y-4">
                {products.map((product) => (
                  <MobileProductCard
                    key={product.id}
                    product={product}
                    handleProductChange={handleProductChange}
                    calculatePrice={calculatePrice}
                    handleDeleteProduct={handleDeleteProduct}
                    productsLength={products.length}
                  />
                ))}
              </div>
            </div>

            {/* Services Section */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Services</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Additional services provided</p>
                  </div>
                </div>
                <button
                  onClick={handleAddService}
                  className="flex items-center gap-2 bg-blue-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium text-xs sm:text-sm"
                >
                  <PlusIcon />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                {services.map((service, index) => (
                  <div key={service.id} className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-white border border-gray-300 rounded-full text-xs sm:text-sm font-semibold text-gray-700">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="Service name"
                          className="bg-transparent border-0 px-0 py-1 text-xs sm:text-sm md:text-base text-gray-900 focus:outline-none focus:ring-0 w-full placeholder-gray-500"
                          value={service.name}
                          onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 mt-2 md:mt-0">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm w-24 sm:w-32 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                          value={service.price}
                          onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)}
                        />
                        <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs sm:text-sm">QR</span>
                      </div>
<button
  onClick={() => handleDeleteService(service.id)}
  className={`
    p-2 rounded-lg transition
    ${
      services.length > 1
        ? "text-red-500 hover:text-red-700"
        : "text-gray-300 cursor-not-allowed"
    }
  `}
  title={services.length === 1 ? "At least one service is required" : "Delete service"}
>
  <span className="w-4 h-4 flex items-center justify-center">
    <DeleteIcon className="w-4 h-4"  />
  </span>
</button>


                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Column - Tips & Discounts */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Tips */}
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Tips & Gratuity</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Do you want to request for tip?</p>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="flex items-center justify-between p-3 sm:p-4 bg-white/80 rounded-xl border border-gray-300/50 hover:border-blue-400/50 hover:bg-gray-50/30 transition-all duration-200 cursor-pointer backdrop-blur-sm">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${requestTip 
                            ? 'border-blue-500 bg-blue-500 shadow-sm' 
                            : 'border-gray-400 group-hover:border-gray-500'}`}
                          >
                            {requestTip && (
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm sm:text-base">
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

                      <label className="flex items-center justify-between p-3 sm:p-4 bg-white/80 rounded-xl border border-gray-300/50 hover:border-blue-400/50 hover:bg-gray-50/30 transition-all duration-200 cursor-pointer backdrop-blur-sm">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${!requestTip 
                            ? 'border-blue-500 bg-blue-500 shadow-sm' 
                            : 'border-gray-400 group-hover:border-gray-500'}`}
                          >
                            {!requestTip && (
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm sm:text-base">
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
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Discounts</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Do you want to add special discounts?</p>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="flex items-center justify-between p-3 sm:p-4 bg-white/80 rounded-xl border border-gray-300/50 hover:border-blue-400/50 hover:bg-gray-50/30 transition-all duration-200 cursor-pointer backdrop-blur-sm">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${addDiscount 
                            ? 'border-blue-500 bg-blue-500 shadow-sm' 
                            : 'border-gray-400 group-hover:border-gray-500'}`}
                          >
                            {addDiscount && (
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm sm:text-base">
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
                      
                      <label className="flex items-center justify-between p-3 sm:p-4 bg-white/80 rounded-xl border border-gray-300/50 hover:border-gray-400/50 hover:bg-gray-50/30 transition-all duration-200 cursor-pointer backdrop-blur-sm">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${!addDiscount 
                            ? 'border-blue-500 bg-blue-500 shadow-sm' 
                            : 'border-gray-400 group-hover:border-gray-500'}`}
                          >
                            {!addDiscount && (
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm sm:text-base">
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
                        <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">Discount %</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-20 sm:w-24 bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={discountPercentage}
                                onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                              />
                              <span className="text-gray-700 font-medium text-sm">%</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Discount: {discountAmount.toFixed(2)} QR
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Notes & Summary */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Special Note */}
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Special Notes</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Add any special instructions or notes</p>
                    <textarea
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                      rows="5"
                      placeholder="Example: Payment due within 30 days..."
                      value={specialNote}
                      onChange={(e) => setSpecialNote(e.target.value)}
                    />
                  </div>

                  {/* Summary Card */}
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 sm:p-6 text-white">
                    <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Invoice Summary</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-xs sm:text-sm">Subtotal</span>
                        <span className="font-medium text-sm sm:text-base">
                          {subtotal.toFixed(2)} QR
                        </span>
                      </div>
                      {addDiscount && discountPercentage > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-xs sm:text-sm">Discount ({discountPercentage}%)</span>
                          <span className="text-green-400 font-medium text-sm sm:text-base">
                            -{discountAmount.toFixed(2)} QR
                          </span>
                        </div>
                      )}
                      <div className="border-t border-gray-700 pt-2 sm:pt-3 mt-2 sm:mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-lg font-bold">Total Amount</span>
                          <span className="text-xl sm:text-2xl md:text-3xl font-bold">
                            {calculateTotal.toFixed(2)} QR
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Meta */}
              <div className="text-xs sm:text-sm text-gray-600">
                <p>Created on {invoiceDate} at {invoiceTime}</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Cancel */}
                <button
                  onClick={onBack}
                  className="
                    px-4 sm:px-5 py-2
                    border border-gray-300
                    text-gray-700
                    rounded-xl
                    hover:bg-gray-50
                    transition
                    font-medium
                    text-xs sm:text-sm
                    w-full sm:w-auto
                  "
                >
                  Cancel
                </button>

                {/* Save as Draft */}
                <button
                  onClick={handleSaveDraft}
                  className="
                    px-4 sm:px-5 py-2
                    border border-blue-300
                    text-blue-600
                    bg-blue-50/50
                    rounded-xl
                    hover:bg-blue-100/60
                    transition
                    font-medium
                    text-xs sm:text-sm
                    w-full sm:w-auto
                  "
                >
                  Save as Draft
                </button>

                {/* Create */}
                <button
                  onClick={handleCreateFatora}
                  className="
                    px-5 sm:px-6 py-2
                   bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg
                    w-full sm:w-auto
                  "
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CreateBills);
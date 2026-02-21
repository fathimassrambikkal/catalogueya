import React from 'react';
import fatoraLogo from "../assets/fatoralogo.webp";

function PreviewFatora({ 
  data, 
  onBack, 
  onSend,
  onEdit 
}) {
  const {
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
  } = data;

  // Calculate totals
  const calculateProductTotal = (price, quantity) => (parseFloat(price) || 0) * (parseFloat(quantity) || 0);
  
  const productsTotal = products.reduce((sum, product) => sum + calculateProductTotal(product.pricePer1, product.quantity), 0);
  const servicesTotal = services.reduce((sum, service) => sum + (parseFloat(service.price) || 0), 0);
  const subtotal = productsTotal + servicesTotal;
  const discountAmount = addDiscount ? subtotal * (discountPercentage / 100) : 0;
  const total = subtotal - discountAmount;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate validity
  const getValidityText = () => {
    if (validityDays === 'custom') {
      return `${customDays} ${customDays === 1 ? 'day' : 'days'}`;
    }
    const days = parseInt(validityDays);
    if (days === 1) return '1 day';
    if (days === 7) return '1 week';
    if (days === 14) return '2 weeks';
    if (days === 30) return '1 month';
    return `${days} days`;
  };

  // Get recipient display text
  const getRecipientText = () => {
    if (!recipient) return 'N/A';
    const recipients = {
      'customer1': 'John Doe',
      'customer2': 'Jane Smith', 
      'customer3': 'Robert Johnson',
      'customer4': 'Sarah Williams'
    };
    return recipients[recipient] || recipient;
  };

  // Back Icon Component
  const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const EditIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const SendIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );

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
              <span className="font-medium">Back to Edit</span>
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

      {/* Main Preview Content */}
      <div className="max-w-6xl mx-auto">
        {/* Invoice Preview Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">FATORA</h1>
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-gray-800">Allazael Plantery</h2>
                  <p className="text-gray-600">Aljazeera alarabia street, Doha, Qatar</p>
                  <p className="text-gray-600">Email: hqaljazzaaal@gmail.com</p>
                  <p className="text-gray-600">Phone: +97466070009</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Invoice #</span>
                    <p className="text-lg font-bold text-gray-900">{fatoraNumber || 'FTR-001'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Date</span>
                    <p className="text-gray-900">{formatDate(invoiceDate)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Time</span>
                    <p className="text-gray-900">{invoiceTime}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Valid For</span>
                    <p className="text-gray-900">{getValidityText()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billed To Section */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Billed To</h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-900 font-medium mb-2">{getRecipientText()}</p>
              <p className="text-gray-600">Aljazeera alarabia street, Doha, Qatar</p>
              <p className="text-gray-600">Email: falmoghunni@gmail.com</p>
              <p className="text-gray-600">Phone: +97466070009</p>
            </div>
          </div>

          {/* Products/Services Section */}
          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Product(s) & Service(s)</h3>
            
            {/* Products List */}
            {products.filter(p => p.name || p.manualName).length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Selected from Products</h4>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-6 text-sm font-semibold text-gray-700">Product</div>
                      <div className="col-span-2 text-sm font-semibold text-gray-700 text-center">Unit Price</div>
                      <div className="col-span-2 text-sm font-semibold text-gray-700 text-center">Quantity</div>
                      <div className="col-span-2 text-sm font-semibold text-gray-700 text-center">Total</div>
                    </div>
                  </div>
                  {products.filter(p => p.name || p.manualName).map((product, index) => (
                    <div key={index} className={`px-6 py-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6">
                          <p className="font-medium text-gray-900">
                            {product.manualName || product.name}
                          </p>
                          <p className="text-sm text-gray-500">{product.unit}</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <p className="text-gray-900">{parseFloat(product.pricePer1 || 0).toFixed(2)} QR</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <p className="text-gray-900">{product.quantity || 0}</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <p className="font-semibold text-gray-900">
                            {calculateProductTotal(product.pricePer1, product.quantity).toFixed(2)} QR
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services List */}
            {services.filter(s => s.name).length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Service(s)</h4>
                <div className="space-y-3">
                  {services.filter(s => s.name).map((service, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-6 h-6 bg-white border border-gray-300 rounded-full text-sm font-semibold text-gray-700">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900">{service.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {parseFloat(service.price || 0).toFixed(2)} QR
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Options Summary */}
          <div className="p-8 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tips */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Tips & Gratuity</h4>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${requestTip ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  <div className={`w-2 h-2 rounded-full ${requestTip ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-medium">
                    {requestTip ? 'Tip option included' : 'No tip option'}
                  </span>
                </div>
              </div>

              {/* Discount */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Special Discount</h4>
                {addDiscount && discountPercentage > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-gray-900">{discountPercentage}% Discount Applied</span>
                    </div>
                    <p className="text-lg font-bold text-red-600">-{discountAmount.toFixed(2)} QR</p>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-sm font-medium">No discount applied</span>
                  </div>
                )}
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Total Amount</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Subtotal</span>
                    <span className="font-medium">{subtotal.toFixed(2)} QR</span>
                  </div>
                  {addDiscount && discountPercentage > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/90">Discount</span>
                      <span className="font-medium text-red-300">-{discountAmount.toFixed(2)} QR</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold">{total.toFixed(2)} QR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Note */}
          {specialNote && (
            <div className="p-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Special Note</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-6">
                <p className="text-gray-800 whitespace-pre-line">{specialNote}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-xl">
          <div className="text-sm text-gray-600">
            <p>Preview generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              <EditIcon />
              Edit Fatora
            </button>
            <button
              onClick={onSend}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-lg hover:shadow-xl"
            >
              <SendIcon />
              Send Fatora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewFatora;
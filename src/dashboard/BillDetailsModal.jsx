import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { format } from 'date-fns';

const BillDetailsModal = ({ isOpen, onClose, bill }) => {
  if (!isOpen || !bill) return null;
return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background backdrop */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-3 sm:px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-xl sm:rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl lg:max-w-2xl w-full mx-3 sm:mx-0">
          <div className="bg-white px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 sm:mb-5 border-b border-gray-100 pb-3 sm:pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-normal text-gray-800" id="modal-title">
                  Bill <span className="text-gray-400 mx-1">#</span>{bill.bill_number}
                </h3>
                <div className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium capitalize
                    ${bill.status === 'paid' ? 'bg-green-50 text-green-600 border border-green-100' :
                    bill.status === 'unpaid' ? 'bg-red-50 text-red-600 border border-red-100' :
                      bill.status === 'sent' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-gray-50 text-gray-600 border border-gray-100'}`}>
                  {bill.status}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50 transition focus:outline-none"
              >
                <IoMdClose className="w-5 h-5 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 sm:space-y-5 max-h-[70vh] overflow-y-auto pr-1 -mr-1">
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50/50 p-3 sm:p-4 rounded-lg border border-gray-100/80">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">Customer</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">{bill.customer_name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{bill.customer_phone}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">{bill.customer_email}</p>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">Payment</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 capitalize">{bill.payment_method}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Created: {bill.created_at ? format(new Date(bill.created_at), 'PP') : '-'}</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-2.5">Items</h4>
                <div className="border border-gray-100/80 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="px-2 sm:px-3 py-2 text-left text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-wider">Item</th>
                          <th className="px-2 sm:px-3 py-2 text-center text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-wider">Qty</th>
                          <th className="px-2 sm:px-3 py-2 text-right text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-wider">Price</th>
                          <th className="px-2 sm:px-3 py-2 text-right text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {bill.items?.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-gray-50/30">
                            <td className="px-2 sm:px-3 py-2 sm:py-2.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] sm:text-xs text-gray-600 truncate max-w-[80px] sm:max-w-[120px]">
                                  {item.title || item.product_name || 'Item'}
                                </span>
                                {item.type === 'manual' && (
                                  <span className="text-[7px] sm:text-[8px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded uppercase">M</span>
                                )}
                              </div>
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-2.5 text-center text-[10px] sm:text-xs text-gray-500">{item.quantity}</td>
                            <td className="px-2 sm:px-3 py-2 sm:py-2.5 text-right text-[10px] sm:text-xs text-gray-500">{item.unit_price}</td>
                            <td className="px-2 sm:px-3 py-2 sm:py-2.5 text-right text-[10px] sm:text-xs font-medium text-gray-700">{item.line_total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full sm:w-2/3 lg:w-1/2 space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-600">{bill.subtotal} {bill.currency}</span>
                  </div>
                  {Number(bill.discount_amount) > 0 && (
                    <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
                      <span>Discount</span>
                      <span className="font-medium text-gray-600">-{bill.discount_amount} {bill.currency}</span>
                    </div>
                  )}
                  {Number(bill.tip_amount) > 0 && (
                    <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
                      <span>Tip</span>
                      <span className="font-medium text-gray-600">+{bill.tip_amount} {bill.currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-800 border-t border-gray-100 pt-1.5 sm:pt-2 mt-1 sm:mt-1.5">
                    <span>Total</span>
                    <span>{bill.total_amount} {bill.currency}</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              {bill.note && (
                <div className="bg-blue-50/30 p-2.5 sm:p-3 rounded-lg border border-blue-100/50">
                  <p className="text-[8px] sm:text-[9px] font-medium text-blue-500 uppercase tracking-wider mb-0.5">Note</p>
                  <p className="text-[10px] sm:text-xs text-blue-700/80">{bill.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetailsModal;

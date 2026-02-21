import React, { useEffect, useState } from "react";
import { FaTimes, FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import { sendProductNotification, getContacts, getImageUrl } from "../companyDashboardApi";
import { showToast } from "../utils/showToast";

export default function NotifyHighlightsModalSales({
  selectedType,
  products,
  onClose
}) {
  const [notifyStep, setNotifyStep] = useState(1);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [notifyFormData, setNotifyFormData] = useState({ title: "", body: "" });
  const [contacts, setContacts] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await getContacts();
      const data =
        res.data?.data?.contacts ||
        res.data?.data ||
        res.data ||
        [];
      setContacts(data);
    } catch (err) {
      console.error(err);
      setContacts([]);
    }
  };

  const handleNext = () => {
    if (notifyStep === 1 && selectedProductIds.length === 0) {
      return showToast("Select at least one product", { type: "error" });
    }
    if (notifyStep === 2 && selectedCustomerIds.length === 0) {
      return showToast("Select at least one customer", { type: "error" });
    }
    if (notifyStep === 3) {
      if (!notifyFormData.title || !notifyFormData.body) {
        return showToast("Fill title and message", { type: "error" });
      }
      return handleSend();
    }
    setNotifyStep(prev => prev + 1);
  };

  const handleSend = async () => {
    try {
      setIsSending(true);

      await sendProductNotification({
        title: notifyFormData.title,
        body: notifyFormData.body,
        product_ids: selectedProductIds,
        customer_ids: selectedCustomerIds,
        send_to_all: false,
        category: selectedType
      });

      setNotifyStep(4);
    } catch (err) {
      console.error(err);
      showToast("Failed to send notification", { type: "error" });
    } finally {
      setIsSending(false);
    }
  };


  const allCustomerIds = contacts.map(
  c => c.contact_user_id || c.id
);

const isAllSelected =
  allCustomerIds.length > 0 &&
  allCustomerIds.every(id => selectedCustomerIds.includes(id));

const handleToggleSelectAll = () => {
  if (isAllSelected) {
    setSelectedCustomerIds([]);
  } else {
    setSelectedCustomerIds(allCustomerIds);
  }
};

return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4">
    <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden relative border border-gray-100">

      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-600 z-50 bg-gray-50 hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-colors"
      >
        <FaTimes size={14} className="sm:w-4 sm:h-4" />
      </button>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        
      {/* Step Indicator */}
<div className="flex items-center justify-center mb-8 select-none">
  {[1, 2, 3].map((step, index) => (
    <React.Fragment key={step}>
      
      {/* Circle */}
      <div
        className={`
          relative z-10
          w-5 h-5 sm:w-7 sm:h-7
          rounded-full
          flex items-center justify-center
          text-xs sm:text-sm font-semibold
          transition-all duration-300
          ${
            notifyStep >= step
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 text-gray-500"
          }
        `}
      >
        {step}
      </div>

      {/* Animated Line */}
      {index < 2 && (
        <div className="relative w-12 sm:w-20 h-0.5 mx-2 bg-gray-200 overflow-hidden">
          <div
            className={`
              absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500
              ${
                notifyStep > step ? "w-full" : "w-0"
              }
            `}
          />
        </div>
      )}
    </React.Fragment>
  ))}
</div>
<h2 className="text-center text-sm sm:text-base font-semibold text-blue-600 tracking-wide uppercase mb-6">
  {selectedType.replace(/_/g, " ")}
</h2>


        {notifyStep === 1 && (
          <>
            <h3 className="text-xs sm:text-sm font-semibold mb-4 sm:mb-6 text-gray-900 text-center">
              Select Products
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {products.map(p => {
                const selected = selectedProductIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() =>
                      setSelectedProductIds(prev =>
                        selected
                          ? prev.filter(id => id !== p.id)
                          : [...prev, p.id]
                      )
                    }
                    className={`relative rounded-xl border p-1.5 sm:p-2 cursor-pointer transition-all duration-200 ${
                      selected
                        ? "border-blue-500 bg-blue-50/50 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-1.5 sm:mb-2">
                      <img
                        src={getImageUrl(p.image)}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-gray-900 truncate">
                      {p.name_en || p.name}
                    </p>
                    {selected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <FaCheckCircle size={8} className="text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {notifyStep === 2 && (
          <>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
  <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
    Select Customers
  </h3>

  <button
    onClick={handleToggleSelectAll}
    className={`text-[10px] sm:text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
      isAllSelected
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {isAllSelected ? "Unselect All" : "Select All"}
  </button>
</div>


            <div className="space-y-2 max-h-[250px] sm:max-h-[350px] overflow-y-auto pr-1">
              {contacts.map(c => {
                const id = c.contact_user_id || c.id;
                const selected = selectedCustomerIds.includes(id);

                return (
                  <div
                    key={id}
                    onClick={() =>
                      setSelectedCustomerIds(prev =>
                        selected
                          ? prev.filter(x => x !== id)
                          : [...prev, id]
                      )
                    }
                    className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selected
                        ? "border-blue-500 bg-blue-50/50 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                        selected 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {c.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {c.name}
                        </p>
                        {c.email && (
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            {c.email}
                          </p>
                        )}
                      </div>
                      {selected && (
                        <FaCheckCircle className="text-blue-500 w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {notifyStep === 3 && (
          <>
            <h3 className="text-xs sm:text-sm font-semibold mb-4 sm:mb-6 text-gray-900 text-center">
              Message
            </h3>

            <div className="space-y-3 sm:space-y-4 max-w-md mx-auto">
              <div>
                <label className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Notification title"
                  value={notifyFormData.title}
                  onChange={e =>
                    setNotifyFormData({ ...notifyFormData, title: e.target.value })
                  }
                  className="w-full p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-blue-500 focus:outline-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase mb-1 block">
                  Message
                </label>
                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  value={notifyFormData.body}
                  onChange={e =>
                    setNotifyFormData({ ...notifyFormData, body: e.target.value })
                  }
                  className="w-full p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-blue-500 focus:outline-none text-xs sm:text-sm resize-none"
                />
              </div>
            </div>
          </>
        )}

        {notifyStep === 4 && (
          <div className="flex flex-col items-center justify-center py-6 sm:py-10">
            {/* Animated Success Check */}
            <div className="relative mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 success-check"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Notification Sent
            </h3>
            
            <p className="text-xs sm:text-sm text-gray-400 text-center max-w-[200px] sm:max-w-xs mb-6 sm:mb-8">
              Your notification has been sent successfully to selected customers
            </p>
            
            <button
              onClick={onClose}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {notifyStep < 4 && (
        <div className="p-3 sm:p-4 md:p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <button
              onClick={() =>
                notifyStep > 1 ? setNotifyStep(notifyStep - 1) : onClose()
              }
              className="px-4 sm:px-6 py-2 text-gray-400 hover:text-gray-600 text-xs sm:text-sm font-medium transition-colors"
            >
              {notifyStep > 1 ? "Back" : "Cancel"}
            </button>

            <button
              onClick={handleNext}
              disabled={isSending}
              className="px-5 sm:px-8 py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending</span>
                </span>
              ) : (
                notifyStep === 3 ? "Send" : "Next"
              )}
            </button>
          </div>
        </div>
      )}
    </div>

    {/* CSS Animation */}
    <style >{`
      .success-check {
        animation: drawCheck 0.4s ease-in-out forwards;
        stroke-dasharray: 30;
        stroke-dashoffset: 30;
      }
      
      @keyframes drawCheck {
        to {
          stroke-dashoffset: 0;
        }
      }
    `}</style>
  </div>
);
}

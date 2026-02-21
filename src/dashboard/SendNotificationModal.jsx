import React, { useState, useEffect } from 'react';
import {
  FaCheck,
  FaTimes,
  FaTag,
  FaRocket,
  FaCrown,
  FaExclamationTriangle,
  FaSearch,
  FaArrowLeft,
  FaUserCircle
} from 'react-icons/fa';
import { getImageUrl, sendProductNotification, getContacts, getSpecialMarks } from '../companyDashboardApi';

const SendNotificationModal = ({
  isOpen,
  onClose,
  products = [],
  availableTags = [],
  customers = []
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    special_mark_id: null,
    send_to_all: false,
    customer_ids: [],
    product_ids: []
  });

  const [localCustomers, setLocalCustomers] = useState(customers || []);
  const [localTags, setLocalTags] = useState(availableTags || []);

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    try {
      const [contRes, tagRes] = await Promise.all([
        getContacts(),
        getSpecialMarks()
      ]);

      if (contRes.data?.data) setLocalCustomers(contRes.data.data);
      else if (Array.isArray(contRes.data)) setLocalCustomers(contRes.data);

      if (tagRes.data?.data) setLocalTags(tagRes.data.data);
      else if (Array.isArray(tagRes.data)) setLocalTags(tagRes.data);
    } catch (err) {
      console.error("Error loading notification data:", err);
    }
  };

  // Sync props if they change externally (optional but good for consistency)
  useEffect(() => {
    if (customers?.length) setLocalCustomers(customers);
  }, [customers]);

  useEffect(() => {
    if (availableTags?.length) setLocalTags(availableTags);
  }, [availableTags]);

  // Icon mapping for Special Marks
  const getTagIcon = (tagName) => {
    const name = tagName?.toLowerCase() || '';
    if (name.includes('sale')) return <FaTag className="text-blue-500" />;
    if (name.includes('new') || name.includes('arrival')) return <FaRocket className="text-blue-500" />;
    if (name.includes('limited') || name.includes('crown') || name.includes('best')) return <FaCrown className="text-blue-500" />;
    if (name.includes('stock') || name.includes('low')) return <FaExclamationTriangle className="text-blue-500" />;
    return <FaTag className="text-blue-500" />;
  };

  // Step 1: Select Category (Special Marks)
  const renderStep1 = () => (
    <div className="space-y-6">
      <p className="text-gray-600 text-center text-sm mb-4">
        Select what you want to notify your customers with
      </p>
      <div className="grid grid-cols-2 gap-4">
        {localTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setFormData({ ...formData, special_mark_id: tag.id })}
            className={`flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all duration-300 text-left ${formData.special_mark_id === tag.id
              ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
              : 'border-white bg-gray-50/50 hover:bg-gray-100/80'
              }`}
          >
            <div className={`p-3 rounded-2xl ${formData.special_mark_id === tag.id ? 'bg-white shadow-sm' : 'bg-white'}`}>
              {getTagIcon(tag.name)}
            </div>
            <span className={`text-sm font-black ${formData.special_mark_id === tag.id ? 'text-blue-600' : 'text-gray-700'}`}>
              {tag.name}
            </span>
          </button>
        ))}
        {localTags.length === 0 && (
          <div className="col-span-2 text-center py-8 text-gray-400 font-medium">No special marks available</div>
        )}
      </div>
    </div>
  );

  // Step 2: Select Contacts
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-black text-gray-900">{formData.customer_ids.length} selected</span>
          <div className="flex items-center gap-3 bg-white p-1.5 px-3 rounded-full border border-gray-100 shadow-sm">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.send_to_all}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  const allValidIds = localCustomers
                    .map(c => c.user_id || c.contact_user_id || c.id || c.user?.id)
                    .filter(id => id != null);
                  setFormData({
                    ...formData,
                    send_to_all: isChecked,
                    customer_ids: isChecked ? allValidIds : []
                  });
                }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
            <span className="text-[10px] font-black text-blue-600">Send to All</span>
          </div>
        </div>
        <button
          onClick={() => {
            const allValidIds = localCustomers
              .map(c => c.user_id || c.contact_user_id || c.id || c.user?.id)
              .filter(id => id != null);
            const isAllSelected = formData.customer_ids.length === allValidIds.length && allValidIds.length > 0;
            setFormData({
              ...formData,
              customer_ids: isAllSelected ? [] : allValidIds,
              send_to_all: !isAllSelected
            });
          }}
          className="text-xs font-black text-blue-600 hover:text-blue-700"
        >
          {formData.customer_ids.length === localCustomers.filter(c => (c.user_id || c.contact_user_id || c.id || c.user?.id) != null).length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {localCustomers.map((item) => {
          // Handle both direct contact structure and nested user structures
          const user = item.user || item;
          // Priority check for IDs
          const contactId = item.user_id || item.contact_user_id || item.id || user.id;

          if (!contactId) return null; // Skip invalid entries

          const isSelected = formData.customer_ids.includes(contactId);

          return (
            <div
              key={contactId}
              onClick={() => {
                const ids = isSelected
                  ? formData.customer_ids.filter(id => id !== contactId)
                  : [...formData.customer_ids, contactId];

                setFormData({
                  ...formData,
                  customer_ids: ids,
                  send_to_all: false // Manual selection unsets "Send to All"
                });
              }}
              className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${isSelected
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-transparent bg-gray-50/50 hover:bg-gray-100'
                }`}
            >
              <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-200' : 'border-gray-200 bg-white'
                }`}>
                {isSelected && <FaCheck className="text-white text-[10px]" />}
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 text-2xl overflow-hidden shrink-0">
                {user.avatar ? <img src={getImageUrl(user.avatar)} className="w-full h-full object-cover" /> : <FaUserCircle />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-base font-black text-gray-900 truncate">{user.name || (user.first_name + ' ' + (user.last_name || ''))}</h4>
                <p className="text-xs font-bold text-gray-500">{user.phone || user.mobile || 'No phone'}</p>
              </div>
            </div>
          );
        })}

        {localCustomers.length === 0 && (
          <div className="text-center py-16 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200">
            <FaSearch className="text-4xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-black">No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );

  // Step 3: Select Product and Enter Title/Body
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-black text-gray-900">{formData.product_ids.length} products selected</span>
          <button 
            onClick={() => {
              const allIds = products.map(p => p.id);
              const isAllSelected = formData.product_ids.length === allIds.length;
              setFormData({ ...formData, product_ids: isAllSelected ? [] : allIds });
            }}
            className="text-xs font-black text-blue-600 hover:text-blue-700"
          >
            {formData.product_ids.length === products.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar border-b border-gray-100 pb-6">
          {products.map((p) => {
            const isSelected = formData.product_ids.includes(p.id);
            let imgSrc = "";
            try {
              if (typeof p.image === 'string' && p.image.startsWith('{')) imgSrc = getImageUrl(JSON.parse(p.image));
              else imgSrc = getImageUrl(p.image);
            } catch (e) { imgSrc = getImageUrl(p.image); }

            return (
              <div
                key={p.id}
                onClick={() => {
                  const ids = isSelected
                    ? formData.product_ids.filter(id => id !== p.id)
                    : [...formData.product_ids, p.id];
                  setFormData({ ...formData, product_ids: ids });
                }}
                className={`p-3 rounded-[24px] border-2 transition-all duration-300 cursor-pointer ${isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-transparent bg-gray-50/30 hover:bg-gray-100/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white border border-gray-100 shrink-0">
                    <img src={imgSrc} className="w-full h-full object-cover" alt="" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-600/60 flex items-center justify-center">
                        <FaCheck className="text-white text-[10px]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-black text-gray-900 truncate">{p.name || p.name_en}</h4>
                    <p className="text-[10px] text-blue-600 font-black mt-0.5">QAR {p.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-5 pt-2">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-600 ml-1">Notification Title</label>
          <input
            type="text"
            placeholder="e.g., Big Sale at Our Store!"
            className="w-full p-4.5 bg-white border border-gray-200 rounded-[20px] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all font-bold text-gray-900 shadow-sm placeholder:text-gray-400"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-600 ml-1">Message Content</label>
          <textarea
            placeholder="Write your message here..."
            rows="4"
            className="w-full p-4.5 bg-white border border-gray-200 rounded-[20px] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all font-bold text-gray-900 shadow-sm resize-none placeholder:text-gray-400"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    if (!formData.title || !formData.body) {
      setError("Please fill in title and message");
      return;
    }
    if (!formData.send_to_all && formData.customer_ids.length === 0) {
      setError("Please select at least one customer");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Find selected tag name and format it
      const selectedTag = localTags.find(t => t.id === formData.special_mark_id);
      let categoryName = "";
      if (selectedTag) {
        const lowerName = selectedTag.name.toLowerCase().trim();

        if (lowerName.includes('best') || lowerName.includes('seller')) {
          categoryName = "best_sellers";
        } else if (lowerName.includes('low')) {
          categoryName = "low_in_stock";
        } else if (lowerName.includes('limited')) {
          categoryName = "limited_stocks";
        } else if (lowerName.includes('out')) {
          categoryName = "out_in_stock";
        } else {
          // Fallback to snake_case if no specific match
          categoryName = lowerName.replace(/\s+/g, '_');
        }
      }

      const payload = {
        title: formData.title,
        body: formData.body,
        product_ids: formData.product_ids,
        send_to_all: formData.send_to_all,
        customer_ids: formData.customer_ids,
        special_mark_id: formData.special_mark_id,
        category: categoryName
      };
      const res = await sendProductNotification(payload);
      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          reset();
        }, 2000);
      } else {
        setError(res.data?.message || "Failed to send notification");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setFormData({
      title: '',
      body: '',
      special_mark_id: null,
      send_to_all: false,
      customer_ids: [],
      product_ids: []
    });
    setSuccess(false);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-xl flex items-center justify-center p-4 z-[2000] animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-[48px] w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER SECTION */}
        <div className="pt-10 px-10 pb-6 shrink-0">
          <div className="flex justify-center items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-700 ${s <= step
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200'
                    : 'bg-gray-100 text-gray-400'
                    }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-[4px] rounded-full transition-all duration-1000 ${s < step ? 'bg-blue-600' : 'bg-gray-100'
                    }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="text-center relative">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {step === 1 ? 'Notification Tag' : step === 2 ? 'Target Audience' : 'Craft Message'}
            </h2>
            <p className="text-gray-400 font-bold text-sm mt-1">
              {step === 1 ? 'Choose the nature of your update' : step === 2 ? 'Who should receive this update?' : 'The final details for your customers'}
            </p>
          </div>

          <button
            onClick={() => { onClose(); reset(); }}
            className="absolute top-8 right-8 w-12 h-12 bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-90"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto px-10 pb-8 custom-scrollbar">
          {success ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[32px] flex items-center justify-center text-4xl animate-bounce shadow-xl shadow-green-100 border-4 border-white">
                <FaCheck />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-gray-900">Broadcast Success!</h3>
                <p className="text-gray-500 font-bold mt-2">Your notification is being delivered to your chosen audience.</p>
              </div>
            </div>
          ) : (
              <>
                {error && (
                  <div className="mb-8 p-5 bg-red-50 border-2 border-red-100 rounded-[30px] flex items-center gap-4 animate-in slide-in-from-top duration-300">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <FaExclamationTriangle className="text-red-500" />
                    </div>
                    <p className="text-sm font-black text-red-700">{error}</p>
                  </div>
                )}
              {step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}
            </>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        {!success && (
          <div className="p-10 bg-gray-50/50 backdrop-blur-md border-t border-gray-100 flex gap-5 shrink-0">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-5 rounded-[24px] font-black text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95"
              >
                <FaArrowLeft className="text-xs" />
                Step Back
              </button>
            ) : (
              <button
                onClick={() => { onClose(); reset(); }}
                className="flex-1 py-5 rounded-[24px] font-black text-gray-600 bg-white border-2 border-gray-100 hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all active:scale-95 shadow-sm"
              >
                Dismiss
              </button>
            )}

            <button 
              onClick={step === 3 ? handleSubmit : () => {
                if (step === 1 && !formData.special_mark_id) {
                  setError("Please select a notification tag first");
                  return;
                }
                setStep(step + 1);
                setError(null);
              }}
              disabled={loading}
              className="flex-[1.5] py-5 bg-blue-600 text-white rounded-[24px] font-black hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 disabled:opacity-50 active:scale-[0.98] transform"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Broadcasting...</span>
                </div>
              ) : (
                step === 3 ? 'Send Notification' : 'Continue'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendNotificationModal;

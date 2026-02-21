import React, { useState, useEffect } from 'react';


import {
  getContacts,
  createBill,
  editBill,
  addBillItem,
  sendBill,
  getBillDetails,
  getCategories
} from '../companyDashboardApi';
import { toast } from 'react-hot-toast';
import { ChevronDown, Plus, Trash2, User, FileText, CheckCircle, ArrowRight } from 'lucide-react';

function CreateBills({ onBack, products = [], editBillId = null }) {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Bill State
  const [billId, setBillId] = useState(editBillId);
  const [billData, setBillData] = useState({
    customer_id: '',
    payment_method: 'cash',
    currency: 'qar',
    discount_percent: 0,
    tip_amount: 0,
    valid_for_hours: 24,
    note: '',
    customer_name: '',
    customer_first_name: '',
    customer_surname: '',
    customer_email: '',
    customer_phone: ''
  });

  const [items, setItems] = useState([]);
  const [newItemProduct, setNewItemProduct] = useState({ product_id: '', quantity: 1 });
  const [newItemService, setNewItemService] = useState({ title: '', unit_price: '', quantity: 1 });

  // Fetch Data
  useEffect(() => {
    fetchContacts();
    fetchCategories();
    if (editBillId) fetchBillDetails(editBillId);
  }, [editBillId]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const resetForm = () => {
    setBillId(null);
    setBillData({
      customer_id: '',
      payment_method: 'cash',
      currency: 'qar',
      discount_percent: 0,
      tip_amount: 0,
      valid_for_hours: 24,
      note: '',
      customer_name: '',
      customer_first_name: '',
      customer_surname: '',
      customer_email: '',
      customer_phone: ''
    });
    setItems([]);
    setNewItemProduct({ product_id: '', quantity: 1 });
    setNewItemService({ title: '', unit_price: '', quantity: 1 });
    // Keep contacts and categories
  };

  const fetchBillDetails = async (id) => {
    try {
      setLoading(true);
      const res = await getBillDetails(id);
      const bill = res.data?.data || res.data;
      if (bill) {
        setBillId(bill.id);
        const [first, ...rest] = (bill.customer_name || '').split(' ');
        setBillData({
          customer_id: bill.customer_id,
          payment_method: bill.payment_method || 'cash',
          currency: bill.currency || 'qar',
          discount_percent: bill.discount_value || 0,
          tip_amount: bill.tip_amount || 0,
          valid_for_hours: 24,
          note: bill.note || '',
          customer_name: bill.customer_name || '',
          customer_first_name: first || '',
          customer_surname: rest.join(' ') || '',
          customer_email: bill.customer_email || '',
          customer_phone: bill.customer_phone || ''
        });
        if (bill.items && Array.isArray(bill.items)) {
          setItems(bill.items.map(item => ({
            id: item.id,
            product_id: item.product_id,
            title: item.product_name || item.title,
            quantity: item.quantity,
            price: item.unit_price,
            total: item.line_total,
            type: item.type || (item.product_id ? 'product' : 'manual')
          })));
        }
        setStep(2); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await getContacts();
      setContacts(res.data?.data || res.data || []);
    } catch (error) { }
  };

  const handleContactSelect = (e) => {
    const contactId = e.target.value;
    const contact = contacts.find(c => String(c.contact_user_id) === String(contactId));
    if (contact) {
      const [first, ...rest] = (contact.name || '').split(' ');
      setBillData(prev => ({
        ...prev,
        customer_id: contactId,
        customer_name: contact.name,
        customer_first_name: first || '',
        customer_surname: rest.join(' ') || '',
        customer_email: contact.email,
        customer_phone: contact.phone
      }));
    } else {
      setBillData(prev => ({ ...prev, customer_id: contactId, customer_name: '', customer_first_name: '', customer_surname: '', customer_email: '', customer_phone: '' }));
    }
  };

  /* SINGLE STEP FLOW REFACTOR */

  // Remove step state, keep relevant states
  // const [step, setStep] = useState(1); // REMOVED



  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    toast.success("Item removed");
  };

  const handleCreateAndSend = async () => {
    if (!billData.customer_id) return toast.error("Please select a recipient");
    if (items.length === 0) return toast.error("Please add at least one item");

    setLoading(true);
    try {
      // 1. Create Bill
      const billPayload = {
        customer_id: billData.customer_id,
        payment_method: billData.payment_method,
        currency: billData.currency,
        note: billData.note,
        discount_percent: billData.discount_percent,
        discount_value: billData.discount_percent,
        discount: billData.discount_percent,
        tip_amount: billData.tip_amount,
        valid_for_hours: billData.valid_for_hours
      };

      let currentBillId = billId;

      if (!currentBillId) {
        const createRes = await createBill(billPayload);
        const createdBill = createRes.data?.data || createRes.data;
        if (!createdBill?.id) throw new Error("Failed to create bill");
        currentBillId = createdBill.id;
      } else {
        // If editing, update metadata first (optional per user request, but good practice)
        await editBill(currentBillId, billPayload);
      }

      // 2. Add Items (Sequentially to ensure order or handle errors)
      // Note: If editing, we assume these are NEW items or we need to handle diff. 
      // For this user flow "create bill... add product", we assume clean slate creation usually.
      // We will loop through ALL local items.
      // IMPORTANT: If we are editing and items already exist on server, we might duplicate them if we re-add.
      // Filter out items that already have an 'id' (presumed existing from fetch).
      const itemsToAdd = items.filter(i => !i.id);

      // But wait! User might want ONE CLICK flow.
      // If fetching details populated `items` with `id`, we skip adding them again?
      // Yes, `fetchBillDetails` sets `id` on items.

      for (const item of itemsToAdd) {
        const itemPayload = item.type === 'product'
          ? { type: 'product', product_id: item.product_id, quantity: item.quantity }
          : { type: 'manual', title: item.title, unit_price: item.price, quantity: item.quantity };
        await addBillItem(currentBillId, itemPayload);
      }

      // 3. Send Bill
      await sendBill(currentBillId);

      toast.success("Bill Created & Sent! Ready for next.");
      resetForm();

    } catch (error) {
      console.error("Action Error:", error);
      toast.error(error.response?.data?.message || "Failed to process bill");
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="animate-fadeIn pb-16  px-4 sm:px-5 border-2 border-gray-100 p-6 rounded-xl">
      {/* PAGE TITLE */}
      <div className="flex items-center gap-2 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-gray-800 tracking-tight">{editBillId ? 'Edit & Send Bill' : 'Create New Bill'}</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Fill in the details below to generate a new invoice.</p>
        </div>
      </div>

      {/* SECTION 1: GENERAL INFO */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-4">
        <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex items-center gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-normal text-gray-700">General Information</h3>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Recipient Input */}
          <div>
            <label className="block text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">Recipient</label>
            <div className="relative">
              <select
                className="w-full bg-white border border-gray-200/80 focus:border-blue-500 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-gray-600 outline-none appearance-none transition-colors"
                value={billData.customer_id}
                onChange={handleContactSelect}
              >
                <option value="">Select Customer</option>
                {contacts.map(c => <option key={c.contact_user_id} value={c.contact_user_id}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5 pointer-events-none" />
            </div>

            {/* User Details Display */}
            {billData.customer_id && (
              <div className="mt-2.5 p-2.5 bg-gray-50/80 rounded-lg border border-gray-100 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-normal text-gray-600">{billData.customer_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-gray-400 pl-4">{billData.customer_email || 'No email available'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">Payment Method</label>
            <div className="flex gap-2">
              <button
                onClick={() => setBillData({ ...billData, payment_method: 'cash' })}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${billData.payment_method === 'cash' ? 'border-blue-500 bg-blue-50/50 text-blue-600' : 'border-gray-200/80 bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                CASH
              </button>
              <button
                disabled
                className="flex-1 py-2 rounded-lg text-xs font-medium border border-gray-200/80 bg-gray-50/30 text-gray-300 cursor-not-allowed"
              >
                ONLINE
              </button>
            </div>
          </div>

          {/* Details & Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Discount Card */}
            <div className="bg-white p-3.5 rounded-lg border border-gray-200/60">
              <h4 className="flex items-center gap-1.5 font-normal text-gray-500 text-xs mb-2">
                <div className="w-1 h-1 rounded-full bg-gray-300" /> Discount
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400">Percentage</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    className="w-14 bg-white border border-gray-200/80 rounded-md py-1 px-1.5 text-center text-xs font-normal text-gray-600 outline-none focus:border-blue-500"
                    placeholder="0"
                    value={billData.discount_percent}
                    onChange={e => setBillData({ ...billData, discount_percent: parseFloat(e.target.value) || 0 })}
                  />
                  <span className="text-gray-300 text-[10px]">%</span>
                </div>
              </div>
            </div>

            {/* Note Area */}
            <div className="bg-white p-3.5 rounded-lg border border-gray-200/60">
              <h4 className="flex items-center gap-1.5 font-normal text-gray-500 text-xs mb-1.5">
                <div className="w-1 h-1 rounded-full bg-gray-300" /> Note
              </h4>
              <textarea
                className="w-full bg-white border border-gray-200/80 rounded-md px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 resize-none placeholder:text-gray-300"
                rows="2"
                placeholder="Add a note..."
                value={billData.note}
                onChange={e => setBillData({ ...billData, note: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ITEMS */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex items-center gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-normal text-gray-700">Items & Breakdown</h3>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Add Product Section */}
          <div className="bg-white p-3.5 rounded-lg border border-gray-200/60">
            <h4 className="text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2.5">Add Product</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <div className="relative">
                  <select
                    className="w-full bg-white border border-gray-200/80 focus:border-blue-500 rounded-md px-2.5 py-2 text-xs text-gray-600 outline-none appearance-none"
                    value={newItemProduct.product_id}
                    onChange={e => setNewItemProduct({ ...newItemProduct, product_id: e.target.value })}
                  >
                    <option value="">Select product...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.price} QR)</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 w-3 h-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center w-24 bg-white border border-gray-200/80 rounded-md overflow-hidden">
                <button onClick={() => setNewItemProduct(p => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs">-</button>
                <div className="flex-1 text-center text-xs font-normal text-gray-600">{newItemProduct.quantity}</div>
                <button onClick={() => setNewItemProduct(p => ({ ...p, quantity: p.quantity + 1 }))} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs">+</button>
              </div>

              <button
                onClick={() => {
                  if (!newItemProduct.product_id) return toast.error("Select a product");
                  const prod = products.find(p => String(p.id) === String(newItemProduct.product_id));
                  if (!prod) return;
                  const newItem = {
                    type: 'product',
                    product_id: newItemProduct.product_id,
                    title: prod.name,
                    quantity: parseInt(newItemProduct.quantity),
                    price: parseFloat(prod.price),
                    total: parseFloat(prod.price) * parseInt(newItemProduct.quantity)
                  };
                  setItems([...items, newItem]);
                  setNewItemProduct({ product_id: '', quantity: 1 });
                  toast.success("Product added");
                }}
              className="px-3 py-2 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-1 text-center w-full sm:w-auto"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          </div>

          {/* Add Service Section */}
          <div className="bg-white p-3.5 rounded-lg border border-gray-200/60">
            <h4 className="text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2.5">Add Service</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full bg-white border border-gray-200/80 focus:border-blue-500 rounded-md px-2.5 py-2 text-xs text-gray-600 outline-none placeholder:text-gray-300"
                  placeholder="Service name"
                  value={newItemService.title}
                  onChange={e => setNewItemService({ ...newItemService, title: e.target.value })}
                />
              </div>

              <div className="w-24">
                <input
                  type="number"
                  className="w-full bg-white border border-gray-200/80 rounded-md px-2.5 py-2 text-xs text-gray-600 outline-none text-center"
                  placeholder="Price"
                  value={newItemService.unit_price}
                  onChange={e => setNewItemService({ ...newItemService, unit_price: e.target.value })}
                />
              </div>

              <div className="flex items-center w-24 bg-white border border-gray-200/80 rounded-md overflow-hidden">
                <button onClick={() => setNewItemService(s => ({ ...s, quantity: Math.max(1, s.quantity - 1) }))} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs">-</button>
                <div className="flex-1 text-center text-xs font-normal text-gray-600">{newItemService.quantity}</div>
                <button onClick={() => setNewItemService(s => ({ ...s, quantity: s.quantity + 1 }))} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs">+</button>
              </div>

              <button
                onClick={() => {
                  if (!newItemService.title || !newItemService.unit_price) return toast.error("Enter service details");
                  const newItem = {
                    type: 'manual',
                    title: newItemService.title,
                    quantity: parseInt(newItemService.quantity),
                    price: parseFloat(newItemService.unit_price),
                    total: parseFloat(newItemService.unit_price) * parseInt(newItemService.quantity)
                  };
                  setItems([...items, newItem]);
                  setNewItemService({ title: '', unit_price: '', quantity: 1 });
                  toast.success("Service added");
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-1 text-center w-full sm:w-auto"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          </div>

          {/* Added Items List */}
          {items.length > 0 && (
            <div className="border border-gray-200/60 rounded-lg overflow-hidden">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-normal text-gray-600">{item.title}</span>
                      <span className="text-[7px] font-medium px-1 py-0.5 rounded bg-gray-100 text-gray-500 uppercase">{item.type}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Qty: {item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-normal text-gray-700">{parseFloat(item.price).toFixed(2)} QR</span>
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-gray-300 hover:text-gray-500 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FINAL ACTION BAR */}
          <div className="bg-gray-50 rounded-lg p-3.5 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border border-gray-200/60">
            <div className="text-center sm:text-left">
              <div className="text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total Payable</div>
              <div className="text-lg sm:text-xl font-normal text-gray-800">
                {(() => {
                  const subtotal = items.reduce((acc, i) => acc + (parseFloat(i.price) * i.quantity), 0);
                  const discount = subtotal * ((billData.discount_percent || 0) / 100);
                  const total = subtotal - discount;
                  return total.toFixed(2);
                })()} <span className="text-xs opacity-60">QR</span>
              </div>
            </div>

            <button
              onClick={handleCreateAndSend}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-xs font-medium shadow-sm hover:bg-blue-600 transition-all flex items-center gap-1.5 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> Confirm & Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBills;
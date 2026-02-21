import React, { useState, useEffect } from "react";
import { FaApple } from "react-icons/fa";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  CashIcon,
  PlusCircleIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon
} from "./Svgicons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";


import { getPublicBill} from "../api";


function PaymentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { publicToken } = useParams(); 
  
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [tipOption, setTipOption] = useState("no");
  const [tipAmount, setTipAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("apple-pay");
  const [showAddCard, setShowAddCard] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [note, setNote] = useState("");
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);

  useEffect(() => {
    // First check if we have data from state (existing flow)
    if (state?.fatora) {
      setBillData({ bill: state.fatora });
      setLoading(false);
      return;
    }
    
    // If no state data but we have publicToken, fetch from API
    if (publicToken) {
      fetchBillData();
    } else {
      navigate("/customer", { replace: true });
    }
  }, [publicToken, state, navigate]);

  const fetchBillData = async () => {
    try {
      setLoading(true);
      const response = await getPublicBill(publicToken);
      setBillData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching bill:", err);
      setError("Failed to load bill. Please check the link and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPaymentMethod("cash");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bill information...</p>
        </div>
      </div>
    );
  }

  if (error || !billData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Bill</h2>
          <p className="text-gray-600 mb-6">{error || "Bill data not found"}</p>
          <button
            onClick={() => navigate("/customer")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const bill = billData.bill;
  const company = billData.company || bill.company;
  
  const userInfo = {
    name: bill.customer_name || "Demo User",
    email: bill.customer_email || "demo@gmail.com",
    phone: bill.customer_phone || "1234123412"
  };

  const items = bill.items || [];
  const products = items.filter(item => item.type === "product");
  const services = items.filter(item => item.type === "manual");

  const subtotal = bill.subtotal || 0;
  const discountPercent = bill.discount_percent || 0;
  const discountAmount = bill.discount_amount || (subtotal * discountPercent) / 100;
  const tipValue = tipOption === "yes" && tipAmount ? parseFloat(tipAmount) || 0 : 0;
  const finalTotal = bill.total_amount ? bill.total_amount + tipValue : subtotal - discountAmount + tipValue;
  const currency = bill.currency || "QAR";

  const formatCurrency = (amount) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const handlePayment = () => {
    const paymentData = {
      fatoraId: bill.id,
      fatoraNumber: bill.bill_number,
      customer: userInfo,
      items: items,
      subtotal: subtotal,
      discountPercent: discountPercent,
      discountAmount: discountAmount,
      tipAmount: tipValue,
      totalAmount: finalTotal,
      currency: currency,
      paymentMethod: paymentMethod,
      companyName: company?.name || company?.name_en || "Company"
    };

    console.log("Processing payment:", paymentData);
    
    // If there's a checkout URL and payment is online, redirect to payment gateway
    if (paymentMethod === "online" && billData.checkout_url) {
      window.location.href = billData.checkout_url;
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button - Responsive */}
      <button
        onClick={() => navigate(-1)}
        className="
          fixed z-10 
          top-[clamp(12px,3vw,24px)] 
          left-[clamp(12px,3vw,24px)]
          flex items-center gap-[clamp(4px,1vw,8px)] 
          px-[clamp(12px,2vw,16px)] 
          py-[clamp(8px,1.5vw,10px)] 
          rounded-[clamp(8px,1.5vw,12px)] 
          bg-white/95 backdrop-blur-sm 
          border border-white/80 
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          text-gray-700 
          hover:bg-white 
          transition-all duration-200
          text-[clamp(11px,3vw,14px)]
        "
      >
        <ArrowLeftIcon className="w-[clamp(12px,3vw,14px)] h-[clamp(12px,3vw,14px)]" />
        <span className="font-medium whitespace-nowrap">Back</span>
      </button>

      {/* Main Container - Responsive */}
      <div className="
        w-full 
        px-[clamp(12px,3vw,24px)] 
        pt-[clamp(64px,15vw,80px)] 
        pb-[clamp(32px,8vw,48px)]
        max-w-7xl 
        mx-auto
      ">
        {/* Header */}
        <div className="text-center mb-[clamp(24px,6vw,32px)]">
          <h1 className="
            text-[clamp(20px,6vw,32px)] 
            font-semibold text-gray-900 
            tracking-tight 
            mb-[clamp(4px,1vw,8px)]
          ">
            Pay Now
          </h1>
          <p className="
            text-[clamp(14px,4vw,18px)]
            text-gray-600 font-normal
          ">
            {company?.name || company?.name_en || "Company"}
          </p>
          {bill.bill_number && (
            <p className="
              text-[clamp(11px,3vw,14px)] 
              text-gray-500 mt-1
            ">
              Invoice: {bill.bill_number}
            </p>
          )}
          {bill.valid_until && (
            <p className="
              text-[clamp(11px,3vw,12px)] 
              text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full mt-2
            ">
               Valid until: {new Date(bill.valid_until).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Grid Layout for larger screens */}
        <div className="
          grid 
          lg:grid-cols-2 
          lg:gap-[clamp(24px,6vw,40px)]
        ">
          {/* Left Column */}
          <div className="space-y-[clamp(16px,4vw,24px)]">
            {/* User Information Card */}
            <div className="
              bg-white/95 backdrop-blur-xl
              rounded-[clamp(12px,3vw,16px)]
              border border-white/80
              shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.05)]
              p-[clamp(16px,4vw,24px)]
              glass-effect
            ">
              <h2 className="
                text-[clamp(16px,4.5vw,20px)]
                font-light text-gray-900 
                mb-[clamp(16px,4vw,24px)]
                tracking-[-0.01em]
              ">
                My Information
              </h2>
              
              <div className="space-y-[clamp(12px,3vw,16px)]">
                <div className="flex items-start gap-[clamp(8px,2vw,12px)]">
                  <div className="
                    w-[clamp(24px,6vw,32px)] h-[clamp(24px,6vw,32px)]
                    rounded-full 
                    bg-blue-50 
                    flex items-center justify-center 
                    flex-shrink-0
                    mt-0.5
                  ">
                    <LocationIcon className="
                      w-[clamp(12px,3vw,16px)] h-[clamp(12px,3vw,16px)]
                      text-blue-500
                    " />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="
                      text-[clamp(11px,3vw,14px)]
                      text-gray-500 font-medium
                      leading-tight
                    ">
                      Name
                    </p>
                    <p className="
                      text-[clamp(13px,3.5vw,16px)]
                      text-gray-900
                      truncate
                      leading-tight
                    ">
                      {userInfo.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-[clamp(8px,2vw,12px)]">
                  <div className="
                    w-[clamp(24px,6vw,32px)] h-[clamp(24px,6vw,32px)]
                    rounded-full 
                    bg-blue-50 
                    flex items-center justify-center 
                    flex-shrink-0
                    mt-0.5
                  ">
                    <MailIcon className="
                      w-[clamp(12px,3vw,16px)] h-[clamp(12px,3vw,16px)]
                      text-blue-500
                    "/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="
                      text-[clamp(11px,3vw,14px)]
                      text-gray-500 font-medium
                      leading-tight
                    ">
                      Email
                    </p>
                    <p className="
                      text-[clamp(13px,3.5vw,16px)]
                      text-gray-900
                      truncate
                      leading-tight
                    ">
                      {userInfo.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-[clamp(8px,2vw,12px)]">
                  <div className="
                    w-[clamp(24px,6vw,32px)] h-[clamp(24px,6vw,32px)]
                    rounded-full 
                    bg-blue-50 
                    flex items-center justify-center 
                    flex-shrink-0
                    mt-0.5
                  ">
                    <PhoneIcon className="
                      w-[clamp(12px,3vw,16px)] h-[clamp(12px,3vw,16px)]
                      text-blue-500
                    " />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="
                      text-[clamp(11px,3vw,14px)]
                      text-gray-500 font-medium
                      leading-tight
                    ">
                      Phone
                    </p>
                    <p className="
                      text-[clamp(13px,3.5vw,16px)]
                      text-gray-900
                      truncate
                      leading-tight
                    ">
                      {userInfo.phone}
                    </p>
                  </div>
                </div>
              </div>

              <button className="
                w-full 
                mt-[clamp(16px,4vw,24px)] 
                py-[clamp(10px,2.5vw,12px)]
                rounded-[clamp(8px,2vw,12px)]
                bg-white
                border border-gray-200
                text-blue-600 
                text-[clamp(13px,3.5vw,16px)] font-medium
                hover:bg-blue-50
                transition-all duration-200
              ">
                Edit Address
              </button>
            </div>

            {/* Tip Selection */}
            <div className="
              bg-white/95 backdrop-blur-xl
              rounded-[clamp(12px,3vw,16px)]
              border border-white/80
              shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.05)]
              p-[clamp(16px,4vw,24px)]
              glass-effect
            ">
              <h3 className="
                text-[clamp(16px,4.5vw,20px)]
                font-light text-gray-900 
                mb-[clamp(16px,4vw,24px)]
                tracking-[-0.01em]
              ">
                Would you like to add a tip?
              </h3>
              
              <div className="
                flex flex-col sm:flex-row 
                gap-[clamp(8px,2vw,12px)] 
                mb-[clamp(16px,4vw,24px)]
              ">
                <button
                  onClick={() => setTipOption("yes")}
                  className={`
                    flex-1 py-[clamp(12px,3vw,16px)]
                    rounded-[clamp(8px,2vw,12px)]
                    border
                    text-[clamp(13px,3.5vw,16px)] font-medium
                    transition-all duration-200
                    ${tipOption === "yes" 
                      ? "bg-blue-50 border-blue-500/50 text-blue-600 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]"
                      : "bg-white border-gray-200 text-gray-700 hover:border-blue-300/50 hover:bg-blue-50/50"
                    }
                  `}
                >
                  Yes
                </button>

                <button
                  onClick={() => {
                    setTipOption("no");
                    setTipAmount("");
                  }}
                  className={`
                    flex-1 py-[clamp(12px,3vw,16px)]
                    rounded-[clamp(8px,2vw,12px)]
                    border
                    text-[clamp(13px,3.5vw,16px)] font-medium
                    transition-all duration-200
                    ${tipOption === "no" 
                      ? "bg-blue-50 border-blue-500/50 text-blue-600 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]"
                      : "bg-white border-gray-200 text-gray-700 hover:border-blue-300/50 hover:bg-blue-50/50"
                    }
                  `}
                >
                  No
                </button>
              </div>

              {/* Tip Amount Input */}
              {tipOption === "yes" && (
                <div className="space-y-[clamp(8px,2vw,12px)]">
                  <label className="
                    block 
                    text-[clamp(11px,3vw,14px)]
                    font-medium text-gray-700 
                    mb-[clamp(4px,1vw,8px)]
                  ">
                    Enter tip amount
                  </label>
                  <div className="relative">
                    <div className="
                      absolute left-[clamp(12px,3vw,16px)] 
                      top-1/2 -translate-y-1/2
                      text-gray-400 
                      text-[clamp(13px,3.5vw,16px)] font-medium
                    ">
                      {currency}
                    </div>
                    <input
                      type="number"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="
                        w-full
                        pl-[clamp(40px,10vw,48px)] 
                        pr-[clamp(12px,3vw,16px)] 
                        py-[clamp(12px,3vw,16px)]
                        rounded-[clamp(8px,2vw,12px)]
                        bg-white
                        border border-gray-200
                        text-[clamp(14px,4vw,18px)] 
                        font-medium text-gray-900
                        placeholder:text-gray-400
                        focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                        transition-all duration-200
                      "
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="
              bg-white/95 backdrop-blur-xl
              rounded-[clamp(12px,3vw,16px)]
              border border-white/80
              shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.05)]
              p-[clamp(16px,4vw,24px)]
            ">
              <h3 className="
                text-[clamp(16px,4.5vw,20px)]
                font-light text-gray-900 
                mb-[clamp(16px,4vw,24px)]
                tracking-[-0.01em]
              ">
                Payment Method
              </h3>

              <div className="space-y-[clamp(8px,2vw,12px)]">
                {/* Apple Pay */}
                <button
                  type="button"
                  disabled
                  className="
                    w-full 
                    flex items-center justify-between 
                    p-[clamp(12px,3vw,20px)]
                    rounded-[clamp(8px,2vw,12px)] 
                    border border-gray-100 
                    bg-gray-50/50 
                    opacity-80 
                    cursor-not-allowed 
                    hover:bg-gray-50 
                    transition-colors duration-150
                  "
                >
                  <div className="flex items-center gap-[clamp(8px,2vw,16px)]">
                    <div className="
                      w-[clamp(32px,8vw,48px)] h-[clamp(32px,8vw,48px)]
                      rounded-full 
                      bg-gray-900 
                      flex items-center justify-center
                    ">
                      <FaApple className="
                        text-white 
                        text-[clamp(13px,3.5vw,16px)]
                      " />
                    </div>
                    <div>
                      <div className="
                        text-[clamp(11px,3vw,16px)]
                        font-medium text-gray-900
                      ">
                        Apple Pay
                      </div>
                    </div>
                  </div>
                  <div className="
                    text-[clamp(11px,3vw,14px)]
                    font-medium text-gray-400 
                    px-[clamp(8px,2vw,12px)] py-[clamp(4px,1vw,4px)]
                    bg-white/70 
                    rounded-full 
                    border border-gray-200
                    whitespace-nowrap
                  ">
                    Coming Soon
                  </div>
                </button>

                  <div className="
                  w-full 
                  flex items-center justify-between 
                  p-[clamp(12px,3vw,20px)]
                  rounded-[clamp(8px,2vw,12px)] 
                  border border-gray-100 
                  bg-gray-50/50 
                  opacity-80 
                  cursor-not-allowed
                ">
                  <div className="flex items-center gap-[clamp(8px,2vw,16px)]">
                    <div className="
                      w-[clamp(32px,8vw,48px)] h-[clamp(32px,8vw,48px)]
                      rounded-full 
                      bg-gray-100 
                      flex items-center justify-center 
                      border border-gray-200
                    ">
                      <span className="
                        text-[clamp(11px,3vw,14px)] font-semibold text-gray-500
                      ">
                        VISA
                      </span>
                    </div>
                    <div className="
                      text-[clamp(11px,3vw,16px)]
                      font-medium text-gray-900
                    ">
                      Credit Card
                    </div>
                  </div>
                  <div className="
                    text-[clamp(11px,3vw,14px)]
                    font-medium text-gray-400 
                    px-[clamp(8px,2vw,12px)] py-[clamp(4px,1vw,4px)]
                    bg-white/70 
                    rounded-full 
                    border border-gray-200
                    whitespace-nowrap
                  ">
                    Coming Soon
                  </div>
                </div>

                {/* Online Payment */}
                {billData.checkout_url && (
                  <button
                    onClick={() => {
                      setPaymentMethod("online");
                      // If user selects online, we can immediately redirect or show confirmation
                    }}
                    className={`
                      w-full 
                      flex items-center justify-between 
                      p-[clamp(12px,3vw,20px)]
                      rounded-[clamp(8px,2vw,12px)] 
                      border 
                      transition-all duration-150
                      ${paymentMethod === "online"
                        ? "border-blue-500/30 bg-blue-50/30"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-[clamp(8px,2vw,16px)]">
                      <div className={`
                        w-[clamp(32px,8vw,48px)] h-[clamp(32px,8vw,48px)]
                        rounded-full 
                        flex items-center justify-center 
                        border
                        ${paymentMethod === "online"
                          ? "bg-white border-gray-200"
                          : "bg-gray-50 border-gray-200"
                        }
                      `}>
                        <CreditCardIcon className={`
                          w-[clamp(16px,4vw,20px)] h-[clamp(16px,4vw,20px)]
                          transition-colors
                          ${paymentMethod === "online"
                            ? "text-gray-900"
                            : "text-gray-600"
                          }
                        `} />
                      </div>
                      <div className="
                        text-[clamp(11px,3vw,16px)]
                        font-medium text-gray-900
                      ">
                        Credit/Debit Card
                      </div>
                    </div>
                    {paymentMethod === "online" && (
                      <div className="
                        w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)]
                        rounded-full 
                        bg-blue-500 
                        flex items-center justify-center
                      ">
                        <div className="
                          w-[clamp(6px,1.5vw,8px)] h-[clamp(6px,1.5vw,8px)]
                          rounded-full bg-white
                        " />
                      </div>
                    )}
                  </button>
                )}

                {/* Add New Card */}
                <button
                  type="button"
                  disabled
                  className="
                    w-full 
                    flex items-center justify-between 
                    p-[clamp(12px,3vw,20px)]
                    rounded-[clamp(8px,2vw,12px)] 
                    border border-gray-100 
                    bg-gray-50/50 
                    opacity-80 
                    cursor-not-allowed 
                    hover:bg-gray-50 
                    transition-colors duration-150
                  "
                >
                  <div className="flex items-center gap-[clamp(8px,2vw,16px)]">
                    <div className="
                      w-[clamp(32px,8vw,48px)] h-[clamp(32px,8vw,48px)]
                      rounded-full 
                      bg-gray-50 
                      flex items-center justify-center 
                      border border-gray-200
                    ">
                      <PlusCircleIcon className="
                        w-[clamp(16px,4vw,20px)] h-[clamp(16px,4vw,20px)]
                        text-gray-500
                      " />
                    </div>
                    <div className="
                      text-[clamp(11px,3vw,16px)]
                      font-medium text-gray-700
                    ">
                      Add New Card
                    </div>
                  </div>
                  <div className="
                    text-[clamp(11px,3vw,14px)]
                    font-medium text-gray-400 
                    px-[clamp(8px,2vw,12px)] py-[clamp(4px,1vw,4px)]
                    bg-white/70 
                    rounded-full 
                    border border-gray-200
                    whitespace-nowrap
                  ">
                    Coming Soon
                  </div>
                </button>

                {/* Cash */}
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`
                    w-full 
                    flex items-center justify-between 
                    p-[clamp(12px,3vw,20px)]
                    rounded-[clamp(8px,2vw,12px)] 
                    border 
                    transition-all duration-150
                    ${paymentMethod === "cash"
                      ? "border-blue-500/30 bg-blue-50/30"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-[clamp(8px,2vw,16px)]">
                    <div className={`
                      w-[clamp(32px,8vw,48px)] h-[clamp(32px,8vw,48px)]
                      rounded-full 
                      flex items-center justify-center 
                      border
                      ${paymentMethod === "cash"
                        ? "bg-white border-gray-200"
                        : "bg-gray-50 border-gray-200"
                      }
                    `}>
                      <CashIcon className={`
                        w-[clamp(16px,4vw,20px)] h-[clamp(16px,4vw,20px)]
                        transition-colors
                        ${paymentMethod === "cash"
                          ? "text-gray-900"
                          : "text-gray-600"
                        }
                      `} />
                    </div>
                    <div className="
                      text-[clamp(11px,3vw,16px)]
                      font-medium text-gray-900
                    ">
                      Cash Payment
                    </div>
                  </div>
                  {paymentMethod === "cash" && (
                    <div className="
                      w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)]
                      rounded-full 
                      bg-blue-500 
                      flex items-center justify-center
                    ">
                      <div className="
                        w-[clamp(6px,1.5vw,8px)] h-[clamp(6px,1.5vw,8px)]
                        rounded-full bg-white
                      " />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="mt-[clamp(16px,4vw,24px)] lg:mt-0 flex flex-col h-full">
            {/* Payment Summary */}
            <div className="
              bg-white/95 backdrop-blur-xl
              rounded-[clamp(12px,3vw,16px)]
              border border-white/80
              shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.05)]
              p-[clamp(16px,4vw,24px)]
              glass-effect
              flex flex-col
              flex-1
            ">
              <h3 className="
                text-[clamp(16px,4.5vw,20px)]
                font-light text-gray-900 
                mb-[clamp(16px,4vw,24px)]
                tracking-[-0.01em]
              ">
                Payment Summary
              </h3>

              {/* Payment Method Display at Top */}
              <div className="
                mb-[clamp(20px,5vw,24px)] 
                p-[clamp(12px,3vw,16px)] 
                bg-blue-50/30 
                rounded-[clamp(10px,2.5vw,12px)] 
                border border-blue-100 
                w-full
              ">
                <p className="
                  text-[clamp(11px,3vw,14px)]
                  text-gray-600 
                  font-medium 
                  mb-[clamp(8px,2vw,8px)]
                ">
                  Selected Payment Method
                </p>
                <div className="flex items-center gap-[clamp(8px,2vw,8px)] mb-[clamp(12px,3vw,12px)]">
                  <div className="
                    w-[clamp(32px,8vw,36px)] h-[clamp(32px,8vw,36px)]
                    rounded-full 
                    bg-gray-50 
                    border border-gray-200 
                    flex items-center justify-center
                  ">
                    {paymentMethod === "cash" ? (
                      <CashIcon className="w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)] text-gray-700" />
                    ) : (
                      <CreditCardIcon className="w-[clamp(16px,4vw,18px)] h-[clamp(16px,4vw,18px)] text-gray-700" />
                    )}
                  </div>
                  <span className="
                    text-[clamp(14px,4vw,18px)]
                    font-semibold text-gray-900
                  ">
                    {paymentMethod === "cash" ? "Cash" : "Online Payment"}
                  </span>
                </div>
                <p className="
                  text-[clamp(11px,3vw,14px)]
                  text-gray-500
                ">
                  {paymentMethod === "cash" 
                    ? "You'll pay with cash upon delivery"
                    : "You'll be redirected to secure payment gateway"}
                </p>
              </div>

              {/* Items Table */}
              <div className="mb-[clamp(16px,4vw,24px)]">
                <h4 className="
                  text-[clamp(11px,3vw,14px)]
                  font-medium text-gray-500 
                  mb-[clamp(8px,2vw,12px)]
                ">
                  Items
                </h4>
                {items.length > 0 ? (
                  <div className="
                    overflow-auto
                    rounded-[clamp(6px,1.5vw,8px)] 
                    border border-gray-200
                    -mx-[clamp(4px,1vw,0px)]
                  ">
                    <table className="w-full min-w-[280px]">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="
                            text-left 
                            py-[clamp(8px,2vw,12px)] px-[clamp(8px,2vw,16px)]
                            text-[clamp(11px,3vw,14px)]
                            font-medium text-gray-700
                          ">
                            Item
                          </th>
                          <th className="
                            text-left 
                            py-[clamp(8px,2vw,12px)] px-[clamp(8px,2vw,16px)]
                            text-[clamp(11px,3vw,14px)]
                            font-medium text-gray-700
                          ">
                            Type
                          </th>
                          <th className="
                            text-left 
                            py-[clamp(8px,2vw,12px)] px-[clamp(8px,2vw,16px)]
                            text-[clamp(11px,3vw,14px)]
                            font-medium text-gray-700
                          ">
                            Qty
                          </th>
                          <th className="
                            text-left 
                            py-[clamp(8px,2vw,12px)] px-[clamp(8px,2vw,16px)]
                            text-[clamp(11px,3vw,14px)]
                            font-medium text-gray-700
                          ">
                            Price
                          </th>
                          <th className="
                            text-left 
                            py-[clamp(8px,2vw,12px)] px-[clamp(8px,2vw,16px)]
                            text-[clamp(11px,3vw,14px)]
                            font-medium text-gray-700
                          ">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={item.id || index} className="border-t border-gray-100">
                            <td className="
                              py-[clamp(8px,2vw,12px)] px-[clamp(8px,2vw,16px)]
                              text-[clamp(11px,3vw,16px)]
                              text-gray-900
                              truncate max-w-[100px]
                            ">
                              {item.title}
                            </td>
                            <td className="
                              py-[clamp(8px,2vw,12px)] px-[clamp(8px,2vw,16px)]
                              text-[clamp(11px,3vw,14px)]
                              text-gray-600
                            ">
                              <span className={`
                                px-2 py-1 rounded-full text-xs font-medium
                                ${item.type === 'product' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                                }
                              `}>
                                {item.type === 'product' ? 'Product' : 'Service'}
                              </span>
                            </td>
                            <td className="
                              py-[clamp(8px,2vw,12px)] px-[clamp(8px,2vw,16px)]
                              text-[clamp(11px,3vw,16px)]
                              text-gray-900
                            ">
                              {item.quantity || 1}
                            </td>
                            <td className="
                              py-[clamp(8px,2vw,12px)] px-[clamp(8px,2vw,16px)]
                              text-[clamp(11px,3vw,16px)]
                              text-gray-900
                              whitespace-nowrap
                            ">
                              {formatCurrency(item.unit_price)}
                            </td>
                            <td className="
                              py-[clamp(8px,2vw,12px)] px-[clamp(8px,2vw,16px)]
                              text-[clamp(11px,3vw,16px)]
                              text-gray-900
                              whitespace-nowrap
                              font-medium
                            ">
                              {formatCurrency(item.line_total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="
                    text-gray-500 
                    text-center 
                    py-[clamp(12px,3vw,16px)]
                    text-[clamp(13px,3.5vw,14px)]
                  ">
                    No items in this bill
                  </p>
                )}
              </div>

              {/* Note Section */}
              {bill.note && (
                <div className="mb-[clamp(16px,4vw,24px)] p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Note from {company?.name || company?.name_en}:</h4>
                  <p className="text-gray-600 text-sm">{bill.note}</p>
                </div>
              )}

              {/* Discount and Total */}
              <div className="space-y-[clamp(8px,2vw,16px)] mt-auto pt-[clamp(16px,4vw,40px)]">
                <div className="flex items-center justify-between py-[clamp(4px,1vw,8px)]">
                  <span className="
                    text-[clamp(13px,3.5vw,16px)]
                    font-medium text-gray-700
                  ">
                    Subtotal
                  </span>
                  <span className="
                    text-[clamp(13px,3.5vw,16px)]
                    font-medium text-gray-900
                  ">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between py-[clamp(4px,1vw,8px)]">
                    <span className="
                      text-[clamp(13px,3.5vw,16px)]
                      font-medium text-gray-700
                    ">
                      Discount
                    </span>
                    <span className="
                      text-[clamp(13px,3.5vw,16px)]
                      font-medium text-green-600
                    ">
                      {discountPercent > 0 ? `${discountPercent}%` : ''} ({formatCurrency(discountAmount)})
                    </span>
                  </div>
                )}

                {tipOption === "yes" && tipAmount && (
                  <div className="flex items-center justify-between py-[clamp(4px,1vw,8px)]">
                    <span className="
                      text-[clamp(13px,3.5vw,16px)]
                      font-medium text-gray-700
                    ">
                      Tip
                    </span>
                    <span className="
                      text-[clamp(13px,3.5vw,16px)]
                      font-medium text-blue-600
                    ">
                      {formatCurrency(tipValue)}
                    </span>
                  </div>
                )}
                
                <div className="
                  flex items-center justify-between 
                  border-t border-gray-200 
                  pt-[clamp(16px,4vw,40px)] pb-[clamp(20px,5vw,40px)]
                ">
                  <span className="
                    text-[clamp(16px,4.5vw,20px)]
                    font-semibold text-gray-900
                  ">
                    Total Amount
                  </span>
                  <span className="
                    text-[clamp(20px,6vw,24px)]
                    font-bold text-gray-900
                  ">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="
              flex flex-col sm:flex-row 
              gap-[clamp(11px,2vw,15px)]
              mt-[clamp(24px,6vw,32px)]
            ">
              {/* Reject */}
              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                className="
                  w-full 
                  py-[clamp(12px,3vw,20px)]
                  rounded-[clamp(10px,2.5vw,12px)]
                  bg-white
                  border border-gray-300
                  text-gray-700 
                  text-[clamp(14px,4vw,18px)] font-semibold
                  hover:bg-gray-50
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                Reject
              </button>

              {/* Accept */}
              <button
                onClick={handlePayment}
                className="
                  w-full 
                  py-[clamp(12px,3vw,20px)]
                  rounded-[clamp(10px,2.5vw,12px)]
                  bg-gradient-to-r from-blue-500 to-blue-600
                  text-white 
                  text-[clamp(14px,4vw,18px)] font-semibold
                  shadow-[0_8px_30px_rgba(59,130,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]
                  hover:shadow-[0_12px_40px_rgba(59,130,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]
                  active:scale-[0.98]
                  transition-all duration-200
                  relative overflow-hidden group
                "
              >
                <div className="
                  absolute inset-0 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent 
                  -translate-x-full 
                  group-hover:translate-x-full 
                  transition-transform duration-700
                " />
                <span className="relative">
                  {paymentMethod === "online" ? "Pay Online" : "Accept"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/40 backdrop-blur-sm
          p-[clamp(12px,3vw,16px)]
        ">
          <div className="
            w-full max-w-md
            bg-white
            rounded-[clamp(10px,2.5vw,12px)]
            shadow-[0_20px_60px_rgba(0,0,0,0.2)]
            p-[clamp(16px,4vw,24px)]
            animate-scaleIn
          ">
            <h3 className="
              text-[clamp(14px,4vw,18px)]
              font-semibold text-blue-600 
              mb-[clamp(12px,3vw,16px)]
            ">
              Tell us why you reject our bill
            </h3>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter your reason..."
              className="
                w-full h-[clamp(96px,24vw,112px)]
                p-[clamp(12px,3vw,12px)]
                rounded-[clamp(6px,1.5vw,8px)]
                border border-gray-300
                focus:outline-none focus:border-blue-500
                resize-none
                text-[clamp(13px,3.5vw,16px)]
              "
            />

            <div className="
              flex justify-end 
              gap-[clamp(8px,2vw,12px)] 
              mt-[clamp(16px,4vw,20px)]
            ">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="
                  px-[clamp(16px,4vw,24px)] 
                  py-[clamp(8px,2vw,10px)]
                  rounded-[clamp(6px,1.5vw,8px)]
                  bg-gray-300
                  text-gray-800
                  text-[clamp(13px,3.5vw,16px)] font-medium
                  hover:bg-gray-400
                "
              >
                Cancel
              </button>

              <button
               onClick={() => {
                  console.log("Reject reason:", rejectReason);

                  // TODO: API call here
                  // Example: await rejectBill(bill.id, rejectReason);

                  setShowRejectModal(false);
                  setRejectReason("");
                  setShowRejectSuccess(true); 
                }}
                disabled={!rejectReason.trim()}
                className="
                  px-[clamp(16px,4vw,24px)] 
                  py-[clamp(8px,2vw,10px)]
                  rounded-[clamp(6px,1.5vw,8px)]
                  bg-blue-600
                  text-white
                  text-[clamp(13px,3.5vw,16px)] font-medium
                  hover:bg-blue-700
                  disabled:opacity-50
                "
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectSuccess && (
        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/40 backdrop-blur-sm
          p-[clamp(12px,3vw,16px)]
        ">
          <div className="
            w-full max-w-md
            bg-white
            rounded-[clamp(12px,3vw,16px)]
            shadow-[0_20px_60px_rgba(0,0,0,0.2)]
            p-[clamp(20px,5vw,28px)]
            text-center
            animate-scaleIn
          ">
            <h3 className="
              text-[clamp(16px,4.5vw,20px)]
              font-semibold text-blue-600
              mb-[clamp(12px,3vw,16px)]
            ">
              Request Sent
            </h3>

            <p className="
              text-[clamp(13px,3.5vw,16px)]
              text-gray-700
              leading-relaxed
              mb-[clamp(20px,5vw,28px)]
            ">
              We're sorry you're rejecting{" "}
              <span className="font-semibold">
                {company?.name || company?.name_en || "Company"}
              </span>
              's bill.
              <br />
              <span className="font-semibold">
                {company?.name || company?.name_en || "Company"}
              </span>{" "}
              is reviewing your issue and may revise your bill.
            </p>

            <button
              onClick={() => {
                setShowRejectSuccess(false);
                navigate(-1);
              }}
              className="
                w-full
                py-[clamp(12px,3vw,16px)]
                rounded-[clamp(10px,2.5vw,12px)]
                bg-blue-600
                text-white
                text-[clamp(14px,4vw,18px)]
                font-semibold
                hover:bg-blue-700
                transition-all
              "
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
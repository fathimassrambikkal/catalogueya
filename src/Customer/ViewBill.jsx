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
import CancelBillModal from "./CancelBillModal";
import { getPublicBill, rejectPublicBill } from "../api";

// Skeleton Loader Component
function ViewBillSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button Skeleton */}
      <div className="
        fixed z-20
        top-2 xs:top-3 sm:top-4 md:top-5 lg:top-6
        left-2 xs:left-3 sm:left-4 md:left-5 lg:left-6
        flex items-center gap-1 xs:gap-1.5 sm:gap-2
        px-2 xs:px-2.5 sm:px-3 md:px-3.5 lg:px-4
        py-1 xs:py-1.5 sm:py-2
        rounded-lg xs:rounded-lg sm:rounded-xl
        bg-white/95 
        border border-white/80
      ">
        <div className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4 bg-gray-200 rounded animate-pulse" />
        <div className="w-8 xs:w-10 sm:w-12 h-3 xs:h-3.5 sm:h-4 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Main Container */}
      <div className="
        w-full
        px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6
        pt-12 xs:pt-14 sm:pt-16 md:pt-20 lg:pt-24
        pb-4 xs:pb-6 sm:pb-8 md:pb-10 lg:pb-12
        max-w-[1400px] 2xl:max-w-[1600px]
        mx-auto
      ">
        {/* Header Skeleton */}
        <div className="text-center mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8">
          <div className="h-6 xs:h-7 sm:h-8 md:h-9 lg:h-10 w-32 xs:w-36 sm:w-40 md:w-44 lg:w-48 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 xs:h-5 sm:h-6 w-24 xs:w-28 sm:w-32 md:w-36 lg:w-40 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
          <div className="h-3 xs:h-4 w-20 xs:w-24 sm:w-28 bg-gray-200 rounded-lg mx-auto mt-2 animate-pulse"></div>
        </div>

        {/* Grid Layout */}
        <div className="
          grid 
          grid-cols-1
          lg:grid-cols-2
          gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8
        ">
          {/* Left Column */}
          <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
            {/* User Information Card Skeleton */}
            <div className="
              bg-white/95 backdrop-blur-xl
              rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl
              border border-white/80
              p-3 xs:p-4 sm:p-5 md:p-6
            ">
              <div className="h-5 xs:h-6 sm:h-7 w-28 xs:w-32 sm:w-36 bg-gray-200 rounded mb-3 xs:mb-4 sm:mb-5 md:mb-6 animate-pulse"></div>
              
              <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                    <div className="
                      w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8
                      rounded-full bg-gray-200 animate-pulse
                    "></div>
                    <div className="flex-1">
                      <div className="h-2 xs:h-2.5 sm:h-3 w-8 xs:w-10 sm:w-12 bg-gray-200 rounded mb-1 animate-pulse"></div>
                      <div className="h-3 xs:h-3.5 sm:h-4 w-24 xs:w-28 sm:w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="
                w-full 
                mt-3 xs:mt-4 sm:mt-5 md:mt-6
                py-2 xs:py-2.5 sm:py-3
                rounded-lg xs:rounded-lg sm:rounded-xl
                bg-gray-200 animate-pulse
              "></div>
            </div>

            {/* Payment Methods Skeleton */}
            <div className="
              bg-white/95 backdrop-blur-xl
              rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl
              border border-white/80
              p-3 xs:p-4 sm:p-5 md:p-6
            ">
              <div className="h-5 xs:h-6 sm:h-7 w-32 xs:w-36 sm:w-40 bg-gray-200 rounded mb-3 xs:mb-4 sm:mb-5 md:mb-6 animate-pulse"></div>
              
              <div className="space-y-2 xs:space-y-2.5 sm:space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="
                    w-full 
                    flex items-center justify-between 
                    p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5
                    rounded-lg xs:rounded-lg sm:rounded-xl
                    border border-gray-100 
                    bg-gray-50/50
                  ">
                    <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                      <div className="
                        w-8 xs:w-9 sm:w-10 md:w-12 h-8 xs:h-9 sm:h-10 md:h-12
                        rounded-full bg-gray-200 animate-pulse
                      "></div>
                      <div className="h-4 xs:h-5 sm:h-6 w-20 xs:w-24 sm:w-28 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-5 xs:h-6 w-16 xs:w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="mt-3 xs:mt-4 sm:mt-5 lg:mt-0">
            {/* Payment Summary Skeleton */}
            <div className="
              bg-white/95 backdrop-blur-xl
              rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl
              border border-white/80
              p-3 xs:p-4 sm:p-5 md:p-6
            ">
              <div className="h-5 xs:h-6 sm:h-7 w-36 xs:w-40 sm:w-44 bg-gray-200 rounded mb-3 xs:mb-4 sm:mb-5 md:mb-6 animate-pulse"></div>

              {/* Payment Method Display Skeleton */}
              <div className="
                mb-3 xs:mb-4 sm:mb-5 md:mb-6
                p-2 xs:p-2.5 sm:p-3 md:p-4
                bg-blue-50/30 
                rounded-lg xs:rounded-lg sm:rounded-xl
                border border-blue-100
              ">
                <div className="h-3 xs:h-3.5 w-24 xs:w-28 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-4 xs:h-5 w-16 xs:w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-3 w-32 xs:w-36 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Items Section Skeleton - Mobile */}
              <div className="mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                <div className="h-4 w-12 bg-gray-200 rounded mb-3 animate-pulse"></div>
                
                {/* Mobile skeleton (visible on small screens) */}
                <div className="block sm:hidden space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-14 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="flex justify-between">
                          <div className="h-3 w-10 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table skeleton (hidden on mobile) */}
                <div className="hidden sm:block">
                  <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Discount and Total Skeleton */}
              <div className="space-y-2 xs:space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between py-1">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-28 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Cancel Button Skeleton */}
            <div className="mt-3 xs:mt-4 sm:mt-5 md:mt-6">
              <div className="
                w-full 
                py-2 xs:py-2.5 sm:py-3 md:py-4
                rounded-lg xs:rounded-lg sm:rounded-xl
                bg-gray-200 animate-pulse
              "></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewBill() {
  const navigate = useNavigate();
  const { publicToken } = useParams();

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        if (!publicToken) {
          navigate("/customer", { replace: true });
          return;
        }

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

    fetchBillData();
  }, [publicToken, navigate]);

  useEffect(() => {
    setPaymentMethod("cash");
  }, []);

  // Show skeleton loader while loading
  if (loading) {
    return <ViewBillSkeleton />;
  }

  if (error || !billData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-3 xs:p-4 sm:p-6">
        <div className="text-center w-full max-w-[280px] xs:max-w-sm sm:max-w-md mx-auto">
          <div className="text-red-500 text-2xl xs:text-3xl sm:text-4xl mb-2 xs:mb-3 sm:mb-4">
            ⚠️
          </div>
          <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 mb-1 xs:mb-2">
            Unable to Load Bill
          </h2>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-4 xs:mb-5 sm:mb-6">
            {error || "Bill data not found"}
          </p>
          <button
            onClick={() => navigate("/customer")}
            className="w-full sm:w-auto px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg text-xs xs:text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors"
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
  const subtotal = bill.subtotal || 0;
  const discountPercent = bill.discount_percent || 0;
  const discountAmount = bill.discount_amount || (subtotal * discountPercent) / 100;
  const finalTotal = bill.total_amount || subtotal - discountAmount;
  const currency = bill.currency || "QAR";

  const formatCurrency = (amount) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button - Ultra Responsive */}
      <button
        onClick={() => navigate(-1)}
        className="
          fixed z-20
          top-2 xs:top-3 sm:top-4 md:top-5 lg:top-6
          left-2 xs:left-3 sm:left-4 md:left-5 lg:left-6
          flex items-center gap-1 xs:gap-1.5 sm:gap-2
          px-2 xs:px-2.5 sm:px-3 md:px-3.5 lg:px-4
          py-1 xs:py-1.5 sm:py-2
          rounded-lg xs:rounded-lg sm:rounded-xl
          bg-white/95 backdrop-blur-sm 
          border border-white/80 
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          text-gray-700 
          hover:bg-white 
          transition-all duration-200
          text-[10px] xs:text-xs sm:text-sm
        "
      >
        <ArrowLeftIcon className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4" />
        <span className="font-medium">Back</span>
      </button>

      {/* Main Container - Fully Responsive */}
      <div className="
        w-full
        px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6
        pt-12 xs:pt-14 sm:pt-16 md:pt-20 lg:pt-24
        pb-4 xs:pb-6 sm:pb-8 md:pb-10 lg:pb-12
        max-w-[1400px] 2xl:max-w-[1600px]
        mx-auto
      ">
        {/* Header - Responsive */}
        <div className="text-center mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8">
          <h1 className="
            text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl
            font-semibold text-gray-900 
            tracking-tight 
            mb-1 xs:mb-1.5 sm:mb-2
          ">
            View Bill
          </h1>
          <p className="
            text-xs xs:text-sm sm:text-base md:text-lg
            text-gray-600
          ">
            {company?.name || company?.name_en || "Company"}
          </p>
          {bill.bill_number && (
            <p className="
              text-[10px] xs:text-xs sm:text-sm
              text-gray-500 mt-0.5 xs:mt-1
            ">
              Invoice: {bill.bill_number}
            </p>
          )}
          {bill.valid_until && (
            <p className="
              text-[10px] xs:text-xs
              text-blue-600 bg-blue-50 inline-block px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1 rounded-full mt-1 xs:mt-1.5 sm:mt-2
            ">
              Valid until: {new Date(bill.valid_until).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Grid Layout - Fully Responsive */}
        <div className="
          grid 
          grid-cols-1
          lg:grid-cols-2
          gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8
        ">
          {/* Left Column */}
          <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
            {/* User Information Card */}
            <div className="
              bg-white/95 backdrop-blur-xl
              rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl
              border border-white/80
              shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.05)]
              p-3 xs:p-4 sm:p-5 md:p-6
              glass-effect
            ">
              <h2 className="
                text-sm xs:text-base sm:text-lg md:text-xl
                font-light text-gray-900 
                mb-3 xs:mb-4 sm:mb-5 md:mb-6
                tracking-[-0.01em]
              ">
                My Information
              </h2>
              
              <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4">
                {/* Name */}
                <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                  <div className="
                    w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8
                    rounded-full 
                    bg-blue-50 
                    flex items-center justify-center 
                    flex-shrink-0
                    mt-0.5
                  ">
                    <LocationIcon className="
                      w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4
                      text-blue-500
                    " />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="
                      text-[10px] xs:text-xs sm:text-sm
                      text-gray-500 font-medium
                    ">
                      Name
                    </p>
                    <p className="
                      text-xs xs:text-sm sm:text-base
                      text-gray-900
                      truncate
                    ">
                      {userInfo.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                  <div className="
                    w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8
                    rounded-full 
                    bg-blue-50 
                    flex items-center justify-center 
                    flex-shrink-0
                    mt-0.5
                  ">
                    <MailIcon className="
                      w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4
                      text-blue-500
                    "/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="
                      text-[10px] xs:text-xs sm:text-sm
                      text-gray-500 font-medium
                    ">
                      Email
                    </p>
                    <p className="
                      text-xs xs:text-sm sm:text-base
                      text-gray-900
                      truncate
                    ">
                      {userInfo.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                  <div className="
                    w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8
                    rounded-full 
                    bg-blue-50 
                    flex items-center justify-center 
                    flex-shrink-0
                    mt-0.5
                  ">
                    <PhoneIcon className="
                      w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4
                      text-blue-500
                    " />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="
                      text-[10px] xs:text-xs sm:text-sm
                      text-gray-500 font-medium
                    ">
                      Phone
                    </p>
                    <p className="
                      text-xs xs:text-sm sm:text-base
                      text-gray-900
                      truncate
                    ">
                      {userInfo.phone}
                    </p>
                  </div>
                </div>
              </div>

              <button className="
                w-full 
                mt-3 xs:mt-4 sm:mt-5 md:mt-6
                py-2 xs:py-2.5 sm:py-3
                rounded-lg xs:rounded-lg sm:rounded-xl
                bg-white
                border border-gray-200
                text-blue-600 
                text-xs xs:text-sm sm:text-base font-medium
                hover:bg-blue-50
                transition-all duration-200
              ">
                Edit Address
              </button>
            </div>

            {/* Payment Methods */}
            <div className="
              bg-white/95 backdrop-blur-xl
              rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl
              border border-white/80
              shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.05)]
              p-3 xs:p-4 sm:p-5 md:p-6
            ">
              <h3 className="
                text-sm xs:text-base sm:text-lg md:text-xl
                font-light text-gray-900 
                mb-3 xs:mb-4 sm:mb-5 md:mb-6
                tracking-[-0.01em]
              ">
                Payment Method
              </h3>

              <div className="space-y-2 xs:space-y-2.5 sm:space-y-3">
                {/* Apple Pay - Disabled */}
                <button
                  type="button"
                  disabled
                  className="
                    w-full 
                    flex items-center justify-between 
                    p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5
                    rounded-lg xs:rounded-lg sm:rounded-xl
                    border border-gray-100 
                    bg-gray-50/50 
                    opacity-80 
                    cursor-not-allowed 
                    hover:bg-gray-50 
                    transition-colors duration-150
                  "
                >
                  <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                    <div className="
                      w-8 xs:w-9 sm:w-10 md:w-12 h-8 xs:h-9 sm:h-10 md:h-12
                      rounded-full 
                      bg-gray-900 
                      flex items-center justify-center
                    ">
                      <FaApple className="
                        text-white 
                        text-sm xs:text-base sm:text-lg md:text-xl
                      " />
                    </div>
                    <div>
                      <div className="
                        text-xs xs:text-sm sm:text-base md:text-lg
                        font-medium text-gray-900
                      ">
                        Apple Pay
                      </div>
                    </div>
                  </div>
                  <div className="
                    text-[10px] xs:text-xs
                    font-medium text-gray-400 
                    px-2 xs:px-2.5 sm:px-3 py-1
                    bg-white/70 
                    rounded-full 
                    border border-gray-200
                    whitespace-nowrap
                  ">
                    Coming Soon
                  </div>
                </button>

                {/* Credit Card - Disabled */}
                <div className="
                  w-full 
                  flex items-center justify-between 
                  p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5
                  rounded-lg xs:rounded-lg sm:rounded-xl
                  border border-gray-100 
                  bg-gray-50/50 
                  opacity-80 
                  cursor-not-allowed
                ">
                  <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                    <div className="
                      w-8 xs:w-9 sm:w-10 md:w-12 h-8 xs:h-9 sm:h-10 md:h-12
                      rounded-full 
                      bg-gray-100 
                      flex items-center justify-center 
                      border border-gray-200
                    ">
                      <span className="
                        text-[10px] xs:text-xs
                        font-semibold text-gray-500
                      ">
                        VISA
                      </span>
                    </div>
                    <div className="
                      text-xs xs:text-sm sm:text-base md:text-lg
                      font-medium text-gray-900
                    ">
                      Credit Card
                    </div>
                  </div>
                  <div className="
                    text-[10px] xs:text-xs
                    font-medium text-gray-400 
                    px-2 xs:px-2.5 sm:px-3 py-1
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
                    onClick={() => setPaymentMethod("online")}
                    className={`
                      w-full 
                      flex items-center justify-between 
                      p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5
                      rounded-lg xs:rounded-lg sm:rounded-xl
                      border 
                      transition-all duration-150
                      ${paymentMethod === "online"
                        ? "border-blue-500/30 bg-blue-50/30"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                      <div className={`
                        w-8 xs:w-9 sm:w-10 md:w-12 h-8 xs:h-9 sm:h-10 md:h-12
                        rounded-full 
                        flex items-center justify-center 
                        border
                        ${paymentMethod === "online"
                          ? "bg-white border-gray-200"
                          : "bg-gray-50 border-gray-200"
                        }
                      `}>
                        <CreditCardIcon className={`
                          w-4 xs:w-4.5 sm:w-5 md:w-6 h-4 xs:h-4.5 sm:h-5 md:h-6
                          transition-colors
                          ${paymentMethod === "online"
                            ? "text-gray-900"
                            : "text-gray-600"
                          }
                        `} />
                      </div>
                      <div className="
                        text-xs xs:text-sm sm:text-base md:text-lg
                        font-medium text-gray-900
                      ">
                        Credit/Debit Card
                      </div>
                    </div>
                    {paymentMethod === "online" && (
                      <div className="
                        w-4 xs:w-4.5 sm:w-5 md:w-6 h-4 xs:h-4.5 sm:h-5 md:h-6
                        rounded-full 
                        bg-blue-500 
                        flex items-center justify-center
                      ">
                        <div className="
                          w-1.5 xs:w-2 h-1.5 xs:h-2
                          rounded-full bg-white
                        " />
                      </div>
                    )}
                  </button>
                )}

                {/* Add New Card - Disabled */}
                <button
                  type="button"
                  disabled
                  className="
                    w-full 
                    flex items-center justify-between 
                    p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5
                    rounded-lg xs:rounded-lg sm:rounded-xl
                    border border-gray-100 
                    bg-gray-50/50 
                    opacity-80 
                    cursor-not-allowed 
                    hover:bg-gray-50 
                    transition-colors duration-150
                  "
                >
                  <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                    <div className="
                      w-8 xs:w-9 sm:w-10 md:w-12 h-8 xs:h-9 sm:h-10 md:h-12
                      rounded-full 
                      bg-gray-50 
                      flex items-center justify-center 
                      border border-gray-200
                    ">
                      <PlusCircleIcon className="
                        w-4 xs:w-4.5 sm:w-5 md:w-6 h-4 xs:h-4.5 sm:h-5 md:h-6
                        text-gray-500
                      " />
                    </div>
                    <div className="
                      text-xs xs:text-sm sm:text-base md:text-lg
                      font-medium text-gray-700
                    ">
                      Add New Card
                    </div>
                  </div>
                  <div className="
                    text-[10px] xs:text-xs
                    font-medium text-gray-400 
                    px-2 xs:px-2.5 sm:px-3 py-1
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
                    p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5
                    rounded-lg xs:rounded-lg sm:rounded-xl
                    border 
                    transition-all duration-150
                    ${paymentMethod === "cash"
                      ? "border-blue-500/30 bg-blue-50/30"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                    <div className={`
                      w-8 xs:w-9 sm:w-10 md:w-12 h-8 xs:h-9 sm:h-10 md:h-12
                      rounded-full 
                      flex items-center justify-center 
                      border
                      ${paymentMethod === "cash"
                        ? "bg-white border-gray-200"
                        : "bg-gray-50 border-gray-200"
                      }
                    `}>
                      <CashIcon className={`
                        w-4 xs:w-4.5 sm:w-5 md:w-6 h-4 xs:h-4.5 sm:h-5 md:h-6
                        transition-colors
                        ${paymentMethod === "cash"
                          ? "text-gray-900"
                          : "text-gray-600"
                        }
                      `} />
                    </div>
                    <div className="
                      text-xs xs:text-sm sm:text-base md:text-lg
                      font-medium text-gray-900
                    ">
                      Cash Payment
                    </div>
                  </div>
                  {paymentMethod === "cash" && (
                    <div className="
                      w-4 xs:w-4.5 sm:w-5 md:w-6 h-4 xs:h-4.5 sm:h-5 md:h-6
                      rounded-full 
                      bg-blue-500 
                      flex items-center justify-center
                    ">
                      <div className="
                        w-1.5 xs:w-2 h-1.5 xs:h-2
                        rounded-full bg-white
                      " />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="mt-3 xs:mt-4 sm:mt-5 lg:mt-0 flex flex-col h-full">
            {/* Payment Summary */}
            <div className="
              bg-white/95 backdrop-blur-xl
              rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl
              border border-white/80
              shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.05)]
              p-3 xs:p-4 sm:p-5 md:p-6
              glass-effect
              flex flex-col
              flex-1
            ">
              <h3 className="
                text-sm xs:text-base sm:text-lg md:text-xl
                font-light text-gray-900 
                mb-3 xs:mb-4 sm:mb-5 md:mb-6
                tracking-[-0.01em]
              ">
                Payment Summary
              </h3>

              {/* Payment Method Display */}
              <div className="
                mb-3 xs:mb-4 sm:mb-5 md:mb-6
                p-2 xs:p-2.5 sm:p-3 md:p-4
                bg-blue-50/30 
                rounded-lg xs:rounded-lg sm:rounded-xl
                border border-blue-100 
                w-full
              ">
                <p className="
                  text-[10px] xs:text-xs
                  text-gray-600 
                  font-medium 
                  mb-1 xs:mb-1.5 sm:mb-2
                ">
                  Selected Payment Method
                </p>
                <div className="flex items-center gap-2 xs:gap-2 sm:gap-2.5 mb-1 xs:mb-1.5 sm:mb-2">
                  <div className="
                    w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8
                    rounded-full 
                    bg-gray-50 
                    border border-gray-200 
                    flex items-center justify-center
                  ">
                    {paymentMethod === "cash" ? (
                      <CashIcon className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4 text-gray-700" />
                    ) : (
                      <CreditCardIcon className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4 text-gray-700" />
                    )}
                  </div>
                  <span className="
                    text-xs xs:text-sm sm:text-base md:text-lg
                    font-semibold text-gray-900
                  ">
                    {paymentMethod === "cash" ? "Cash" : "Online Payment"}
                  </span>
                </div>
                <p className="
                  text-[10px] xs:text-xs sm:text-sm
                  text-gray-500
                ">
                  {paymentMethod === "cash" 
                    ? "You'll pay with cash upon delivery"
                    : "You'll be redirected to secure payment gateway"}
                </p>
              </div>

              {/* Items Section */}
              <div className="mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                <h4 className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-500 mb-2 xs:mb-2.5 sm:mb-3">
                  Items
                </h4>

                {items.length > 0 ? (
                  <>
                    {/* Mobile Layout (No Scroll) */}
                    <div className="block sm:hidden space-y-3">
                      {items.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="border border-gray-200 rounded-lg p-3 bg-gray-50/40"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-medium text-gray-900">
                              {item.title}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-medium
                              ${
                                item.type === "product"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.type === "product" ? "Product" : "Service"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-y-1 text-[10px] text-gray-600">
                            <span>Qty:</span>
                            <span className="text-right">{item.quantity || 1}</span>

                            <span>Price:</span>
                            <span className="text-right">
                              {formatCurrency(item.unit_price)}
                            </span>

                            <span className="font-medium text-gray-800">Total:</span>
                            <span className="text-right font-medium text-gray-900">
                              {formatCurrency(item.line_total)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Table Layout (sm and above) */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full border-collapse min-w-[500px]">
                        <thead>
                          <tr className="bg-gray-50/50 border-b border-gray-200">
                            <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                              Item
                            </th>
                            <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                              Type
                            </th>
                            <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                              Qty
                            </th>
                            <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                              Price
                            </th>
                            <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr
                              key={item.id || index}
                              className="border-b border-gray-100 last:border-b-0"
                            >
                              <td className="py-3 px-3 text-sm text-gray-900">
                                {item.title}
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium
                                  ${
                                    item.type === "product"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {item.type === "product" ? "Product" : "Service"}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-sm text-gray-900">
                                {item.quantity || 1}
                              </td>
                              <td className="py-3 px-3 text-sm text-gray-900 whitespace-nowrap">
                                {formatCurrency(item.unit_price)}
                              </td>
                              <td className="py-3 px-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                                {formatCurrency(item.line_total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4 text-sm">
                    No items in this bill
                  </p>
                )}
              </div>

              {/* Note Section */}
              {bill.note && (
                <div className="mb-3 xs:mb-4 sm:mb-5 p-2 xs:p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Note from {company?.name || company?.name_en}:
                  </h4>
                  <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm">
                    {bill.note}
                  </p>
                </div>
              )}

              {/* Discount and Total */}
              <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 mt-auto pt-3 xs:pt-4 sm:pt-5 md:pt-6">
                <div className="flex items-center justify-between py-1 xs:py-1.5">
                  <span className="
                    text-xs xs:text-sm sm:text-base
                    font-medium text-gray-700
                  ">
                    Subtotal
                  </span>
                  <span className="
                    text-xs xs:text-sm sm:text-base
                    font-medium text-gray-900
                  ">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between py-1 xs:py-1.5">
                    <span className="
                      text-xs xs:text-sm sm:text-base
                      font-medium text-gray-700
                    ">
                      Discount
                    </span>
                    <span className="
                      text-xs xs:text-sm sm:text-base
                      font-medium text-green-600
                    ">
                      {discountPercent > 0 ? `${discountPercent}%` : ''} ({formatCurrency(discountAmount)})
                    </span>
                  </div>
                )}
                
                <div className="
                  flex items-center justify-between 
                  border-t border-gray-200 
                  pt-3 xs:pt-4 sm:pt-5 md:pt-6
                  pb-2 xs:pb-3 sm:pb-4
                ">
                  <span className="
                    text-sm xs:text-base sm:text-lg md:text-xl
                    font-semibold text-gray-900
                  ">
                    Total Amount
                  </span>
                  <span className="
                    text-base xs:text-lg sm:text-xl md:text-2xl
                    font-bold text-gray-900
                  ">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Cancel Button */}
            <div className="
              mt-3 xs:mt-4 sm:mt-5 md:mt-6
            ">
              <button
                type="button"
                onClick={() => setIsCancelOpen(true)}
                className="
                  w-full 
                  py-2 xs:py-2.5 sm:py-3 md:py-4
                  rounded-lg xs:rounded-lg sm:rounded-xl
                  bg-gradient-to-r from-red-500 to-red-600
                  text-white 
                  text-xs xs:text-sm sm:text-base md:text-lg font-semibold
                  shadow-[0_8px_30px_rgba(239,68,68,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]
                  hover:shadow-[0_12px_40px_rgba(239,68,68,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]
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
                  Cancel Bill
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - Fully Responsive */}
      {showRejectSuccess && (
        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/40 backdrop-blur-sm
          p-2 xs:p-3 sm:p-4
        ">
          <div className="
            w-full max-w-[260px] xs:max-w-[300px] sm:max-w-[350px] md:max-w-[400px]
            bg-white
            rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl
            shadow-[0_20px_60px_rgba(0,0,0,0.2)]
            p-4 xs:p-5 sm:p-6 md:p-7
            text-center
            animate-scaleIn
          ">
            <h3 className="
              text-sm xs:text-base sm:text-lg md:text-xl
              font-semibold text-blue-600
              mb-2 xs:mb-3 sm:mb-4
            ">
              Request Sent
            </h3>

            <p className="
              text-xs xs:text-sm sm:text-base
              text-gray-700
              leading-relaxed
              mb-4 xs:mb-5 sm:mb-6 md:mb-7
            ">
              We're sorry you're canceling{" "}
              <span className="font-semibold">
                {company?.name || company?.name_en || "Company"}
              </span>
              's bill.
              <br />
              <span className="font-semibold">
                {company?.name || company?.name_en || "Company"}
              </span>{" "}
              is reviewing your request.
            </p>

            <button
              onClick={() => {
                setShowRejectSuccess(false);
                navigate(-1);
              }}
              className="
                w-full
                py-2 xs:py-2.5 sm:py-3 md:py-4
                rounded-lg xs:rounded-lg sm:rounded-xl
                bg-blue-600
                text-white
                text-xs xs:text-sm sm:text-base md:text-lg
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

      <CancelBillModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        companyName={company?.name || company?.name_en}
        onSubmit={async (reason) => {
          try {
            await rejectPublicBill(publicToken, reason);
            setIsCancelOpen(false);
            setShowRejectSuccess(true);
          } catch (error) {
            console.error("Cancel failed:", error);
            alert("Failed to cancel bill");
          }
        }}
      />
    </div>
  );
}

export default ViewBill;
import React, { useState, useEffect } from "react";
import { getSubscription, getPlans, requestPlanChange } from "../companyDashboardApi";
import { toast } from "react-hot-toast";
import { useFixedWords } from "../hooks/useFixedWords";
import { useTranslation } from "react-i18next";

// Back Icon Component
export const BackIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

function SettingsPlan({ onBack, onTabChange }) {
  const [autoRenew, setAutoRenew] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [requestingChange, setRequestingChange] = useState(false);

  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await getSubscription();
      if (res.data?.status) {
        setSubscription(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlans = async () => {
    setIsChangingPlan(true);
    try {
      const res = await getPlans();
      if (res.data?.status) {
        setPlans(res.data.data || []);
        setShowPlansModal(true);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error(fw.failed_load_plans || "Failed to load plans");
    } finally {
      setIsChangingPlan(false);
    }
  };

  const handleRequestChange = async () => {
    if (!selectedPlanId) {
      toast.error(fw.select_plan_first || "Please select a plan first");
      return;
    }

    setRequestingChange(true);
    try {
      const res = await requestPlanChange(selectedPlanId);
      if (res.data?.status) {
        toast.success(res.data.message || fw.plan_change_success || "Plan will change after current subscription ends");
        setShowPlansModal(false);
        fetchSubscription();
      } else {
        toast.error(res.data?.message || fw.plan_change_failed || "Failed to request plan change");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || fw.plan_change_failed || "Failed to request plan change");
    } finally {
      setRequestingChange(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return fw.na || "N/A";
    return new Date(dateStr).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAutoRenewToggle = () => {
    setAutoRenew(!autoRenew);
  };

  if (loading) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white px-6 pt-16">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-3">
            <div className="h-8 w-48 bg-gray-200 rounded-lg" />
            <div className="h-4 w-72 bg-gray-200 rounded-lg" />
          </div>

          {/* Main Card Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
              {/* Price Row */}
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="h-6 w-32 bg-gray-200 rounded-md" />
                <div className="h-6 w-24 bg-gray-200 rounded-md" />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-5 w-40 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                </div>

                <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-5 w-36 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-5 w-28 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Toggle Skeleton */}
              <div className="h-10 w-40 bg-gray-200 rounded-full" />
            </div>

            {/* Right Action Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-xl" />
              <div className="h-10 w-full bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white px-[clamp(0.75rem,4vw,2rem)] sm:px-[clamp(1rem,5vw,2.5rem)] lg:px-[clamp(1.5rem,6vw,3rem)] pt-[clamp(3rem,8vw,4rem)] md:pt-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="py-[clamp(1.5rem,4vw,2rem)] px-[clamp(0.75rem,4vw,1rem)] sm:px-0">
      <div className={`flex items-center gap-2 mb-6 mt-4 md:mt-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {onBack && (
            <button
      onClick={onBack}
      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6 mt-4 group ltr"
      dir="ltr"
    >
      <BackIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      {fw.back || "Back"}
    </button>
            )}
          </div>
          
          <div className={`max-w-3xl ${isRTL ? 'text-right' : ''}`}>
            <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] sm:text-[clamp(2rem,5vw,2.5rem)] font-semibold text-gray-900 tracking-tight">
              {fw.your_plan || "Your Plan"}
            </h1>
            <p className="text-[clamp(0.875rem,2vw,1.125rem)] text-gray-600 mt-[clamp(0.25rem,1vw,0.5rem)]">
              {fw.manage_subscription_billing_details || "Manage your subscription and billing details"}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[clamp(1rem,3vw,2rem)] lg:gap-[clamp(1.5rem,4vw,2.5rem)] pb-[clamp(2rem,8vw,4rem)]">
          {/* Current Plan Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[clamp(1.25rem,3vw,2rem)] shadow-sm border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div className="px-[clamp(1.5rem,4vw,2rem)] py-[clamp(1rem,3vw,1.5rem)] border-b border-gray-100">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h2 className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-semibold text-gray-900">
                      {fw.current_plan || "Current Plan"}
                    </h2>
                    <p className="text-gray-500 text-[clamp(0.7rem,1.2vw,0.875rem)] mt-[clamp(0.15rem,0.5vw,0.25rem)]">
                      {(subscription?.subscription_status === 'active' ? (fw.active || 'Active') : (subscription?.subscription_status || fw.inactive || 'Inactive'))} • {fw.auto_renewal || "Auto-renewal"} {autoRenew ? (fw.on || 'ON') : (fw.off || 'OFF')}
                    </p>
                  </div>
                  <div className={`flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[clamp(1.25rem,3vw,2rem)] font-bold text-gray-900">{subscription?.currency || 'QR'} {parseFloat(subscription?.plan_price || 0).toFixed(0)}</span>
                    <span className="text-gray-500 text-[clamp(0.75rem,1.2vw,1rem)]">/{subscription?.plan_interval === 'month' ? fw.month || 'mo' : fw.year || 'yr'}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-[clamp(1.5rem,4vw,2rem)]">
                {/* Plan Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.5rem,4vw,2rem)]">
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-[clamp(0.65rem,1vw,0.875rem)] font-semibold text-gray-500 uppercase tracking-wider mb-[clamp(0.75rem,2vw,1rem)]">
                      {fw.plan_details || "Plan Details"}
                    </h3>
                    <div className="space-y-[clamp(0.75rem,2vw,1rem)]">
                      <div>
                        <p className="text-[clamp(0.7rem,1.2vw,0.875rem)] text-gray-500">{fw.plan_name || "Plan Name"}</p>
                        <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-medium text-gray-900 mt-[clamp(0.15rem,0.5vw,0.25rem)]">
                          {subscription?.plan_name || fw.na || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[clamp(0.7rem,1.2vw,0.875rem)] text-gray-500">{fw.storage || "Storage"}</p>
                        <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-medium text-gray-900 mt-[clamp(0.15rem,0.5vw,0.25rem)]">
                          {fw.unlimited || "Unlimited"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[clamp(0.7rem,1.2vw,0.875rem)] text-gray-500">{fw.status || "Status"}</p>
                        <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-medium text-gray-900 mt-[clamp(0.15rem,0.5vw,0.25rem)] capitalize">
                          {subscription?.subscription_status?.replace('_', ' ') || fw.na || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-[clamp(0.65rem,1vw,0.875rem)] font-semibold text-gray-500 uppercase tracking-wider mb-[clamp(0.75rem,2vw,1rem)]">
                      {fw.billing_details || "Billing Details"}
                    </h3>
                    <div className="space-y-[clamp(0.75rem,2vw,1rem)]">
                      <div>
                        <p className="text-[clamp(0.7rem,1.2vw,0.875rem)] text-gray-500">{fw.next_renewal || "Next Renewal"}</p>
                        <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-medium text-gray-900 mt-[clamp(0.15rem,0.5vw,0.25rem)]">
                          {formatDate(subscription?.subscription_ends_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[clamp(0.7rem,1.2vw,0.875rem)] text-gray-500">{fw.billing_cycle || "Billing Cycle"}</p>
                        <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-medium text-gray-900 mt-[clamp(0.15rem,0.5vw,0.25rem)] capitalize">
                          {subscription?.plan_interval === 'month' ? fw.monthly || 'Monthly' : 
                           subscription?.plan_interval === 'year' ? fw.yearly || 'Yearly' : 
                           subscription?.plan_interval || fw.na || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[clamp(0.7rem,1.2vw,0.875rem)] text-gray-500">{fw.payment_method || "Payment Method"}</p>
                        <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-medium text-gray-900 mt-[clamp(0.15rem,0.5vw,0.25rem)]">
                          •••• 4242
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auto Renewal Toggle */}
                <div className="mt-[clamp(2rem,6vw,3rem)] pt-[clamp(1.5rem,4vw,2rem)] border-t border-gray-100">
                  <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[clamp(0.75rem,2vw,1rem)] ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : ''}>
                      <h4 className="text-[clamp(0.875rem,2vw,1rem)] font-semibold text-gray-900">
                        {fw.auto_renewal || "Auto Renewal"}
                      </h4>
                      <p className="text-[clamp(0.7rem,1.2vw,0.875rem)] text-gray-500 mt-[clamp(0.15rem,0.5vw,0.25rem)]">
                        {fw.auto_renew_description || "Your plan will automatically renew each"} {subscription?.plan_interval === 'month' ? fw.month || 'month' : fw.year || 'year'}
                      </p>
                    </div>
                    
                    {/* Toggle Button */}
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {/* ON Text */}
                      <span
                        className={`text-[clamp(0.6rem,1vw,0.75rem)] font-semibold transition-colors duration-200 ${
                          autoRenew ? "text-blue-600" : "text-gray-400"
                        }`}
                      >
                        {fw.on || "ON"}
                      </span>

                      <button
                        onClick={handleAutoRenewToggle}
                        className="relative inline-flex h-[clamp(1.5rem,4vw,2rem)] w-[clamp(2.5rem,6vw,4rem)] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        role="switch"
                        aria-checked={autoRenew}
                      >
                        <span className="sr-only">
                          {fw.auto_renewal || "Auto Renewal"} {autoRenew ? (fw.on || 'ON') : (fw.off || 'OFF')}
                        </span>

                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-[clamp(1.3rem,3.5vw,1.75rem)] w-[clamp(1.3rem,3.5vw,1.75rem)] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            autoRenew ? (isRTL ? '-translate-x-[clamp(1.2rem,3vw,1.8rem)]' : 'translate-x-[clamp(1.2rem,3vw,1.8rem)]') : 'translate-x-0'
                          } ${autoRenew ? 'bg-blue-500' : ''}`}
                        >
                          <div
                            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                              autoRenew ? "opacity-0" : "opacity-100"
                            }`}
                          >
                            <div className="h-[clamp(0.5rem,1.5vw,0.75rem)] w-0.5 bg-gray-400" />
                          </div>
                          <div
                            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                              autoRenew ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            <svg
                              className="h-[clamp(0.5rem,1.5vw,0.75rem)] w-[clamp(0.5rem,1.5vw,0.75rem)] text-white"
                              fill="none"
                              viewBox="0 0 12 12"
                            >
                              <path
                                d="M3.5 6.5L5 8l3.5-3.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </span>
                      </button>

                      {/* OFF Text */}
                      <span
                        className={`text-[clamp(0.6rem,1vw,0.75rem)] font-semibold transition-colors duration-200 ${
                          !autoRenew ? "text-blue-600" : "text-gray-400"
                        }`}
                      >
                        {fw.off || "OFF"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-[clamp(1rem,2vw,1.5rem)]">
              {/* Action Card */}
              <div className="bg-white rounded-[clamp(1.25rem,3vw,2rem)] border border-gray-200 shadow-sm p-[clamp(1rem,3vw,1.5rem)]">
                <h3 className="text-[clamp(0.875rem,2vw,1.125rem)] font-semibold text-gray-900 mb-[clamp(0.75rem,2vw,1rem)]">
                  {fw.plan_actions || "Plan Actions"}
                </h3>
                <div className="space-y-[clamp(0.5rem,1.5vw,0.75rem)]">
                  <button
                    onClick={handleOpenPlans}
                    disabled={isChangingPlan}
                    className="w-full py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(0.75rem,2vw,1rem)] bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-[clamp(0.75rem,1.5vw,1rem)] transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[clamp(0.75rem,1.5vw,1rem)]"
                  >
                    {isChangingPlan ? (
                      <>
                        <svg className="animate-spin h-[clamp(0.875rem,1.5vw,1rem)] w-[clamp(0.875rem,1.5vw,1rem)] text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        {fw.processing || "Processing..."}
                      </>
                    ) : (
                      fw.change_plan || 'Change Plan'
                    )}
                  </button>

                  <button
                    className="w-full py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(0.75rem,2vw,1rem)] bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-medium rounded-[clamp(0.75rem,1.5vw,1rem)] transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-[clamp(0.75rem,1.5vw,1rem)]"
                  >
                    {fw.cancel_plan || "Cancel Plan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PLANS MODAL */}
      {showPlansModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-[clamp(0.5rem,2vw,1.5rem)]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPlansModal(false)}
          ></div>

          <div className={`bg-white w-full max-w-[clamp(280px,50vw,800px)] rounded-[clamp(1rem,2vw,1.5rem)] shadow-xl overflow-hidden relative flex flex-col max-h-[90vh] ${isRTL ? 'text-right' : ''}`}>
            <div className={`p-[clamp(1rem,2vw,1.5rem)] border-b border-gray-100 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-[clamp(1.1rem,2vw,1.5rem)] font-bold text-gray-900">{fw.select_plan || "Select a Plan"}</h2>
              <button
                onClick={() => setShowPlansModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-[clamp(1.25rem,2vw,1.75rem)] h-[clamp(1.25rem,2vw,1.75rem)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-[clamp(1rem,2vw,1.5rem)] space-y-[clamp(0.75rem,1.5vw,1rem)]">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-[clamp(1rem,1.5vw,1.25rem)] rounded-[clamp(0.75rem,1.5vw,1rem)] border-2 cursor-pointer transition-all ${selectedPlanId === plan.id
                    ? 'border-blue-500 bg-blue-50/30'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : ''}>
                      <h3 className="font-bold text-gray-900 text-[clamp(0.9rem,1.5vw,1.1rem)]">{plan.name}</h3>
                      <p className="text-[clamp(0.65rem,1vw,0.75rem)] text-gray-500 uppercase tracking-wider font-semibold">
                        {plan.interval === 'month' ? fw.monthly || 'Monthly' : fw.yearly || 'Yearly'}
                      </p>
                    </div>
                    <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                      <p className="text-[clamp(1rem,2vw,1.25rem)] font-bold text-blue-500">{plan.currency} {parseFloat(plan.price).toFixed(0)}</p>
                      <p className="text-[clamp(0.5rem,0.8vw,0.625rem)] text-gray-400 font-bold uppercase">{fw.per_month || "per"} {plan.interval === 'month' ? fw.month || 'month' : fw.year || 'year'}</p>
                    </div>
                  </div>
                  {selectedPlanId === plan.id && (
                    <div className={`mt-3 flex items-center gap-2 text-blue-500 text-[clamp(0.7rem,1.2vw,0.875rem)] font-bold ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <svg className="w-[clamp(0.875rem,1.5vw,1rem)] h-[clamp(0.875rem,1.5vw,1rem)]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {fw.selected || "Plan Selected"}
                    </div>
                  )}
                </div>
              ))}

              {plans.length === 0 && (
                <p className="text-center text-gray-500 py-10 text-[clamp(0.8rem,1.5vw,1rem)]">{fw.no_plans_available || "No other plans available."}</p>
              )}
            </div>

            <div className="p-[clamp(1rem,2vw,1.5rem)] bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleRequestChange}
                disabled={!selectedPlanId || requestingChange}
                className="w-full py-[clamp(0.75rem,1.5vw,1rem)] bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-[clamp(0.75rem,1.5vw,1rem)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-[clamp(0.8rem,1.5vw,1rem)]"
              >
                {requestingChange ? (
                  <>
                    <svg className="animate-spin h-[clamp(1rem,1.5vw,1.25rem)] w-[clamp(1rem,1.5vw,1.25rem)] text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {fw.processing || "Processing..."}
                  </>
                ) : (
                  fw.proceed_plan_change || 'Proceed with Plan Change'
                )}
              </button>
              <p className="text-[clamp(0.5rem,0.8vw,0.625rem)] text-center text-gray-400 font-medium mt-3">
                {fw.plan_change_note || "* Plan will change after your current subscription ends"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPlan;
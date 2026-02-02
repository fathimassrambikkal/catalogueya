import React, { useState } from "react";

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

function SettingsPlan({ onBack }) {
  const [autoRenew, setAutoRenew] = useState(true);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleAutoRenewToggle = () => {
    setAutoRenew(!autoRenew);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8 pt-16 md:pt-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="py-8 px-4 sm:px-0">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
            >
              <BackIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
          )}
          
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
              Your Plan
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage your subscription and billing details
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-16">
          {/* Current Plan Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <div className="px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Current Plan
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Active • Auto-renewal {autoRenew ? 'ON' : 'OFF'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">QR 350</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                {/* Plan Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Plan Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Plan Name</p>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                          Month to Month Plan
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Storage</p>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                          Unlimited
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Subscribed Since</p>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                          October 7, 2022
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Billing Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Next Renewal</p>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                          January 7, 2027
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Billing Cycle</p>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                          Monthly
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                          •••• 4242
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auto Renewal Toggle */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">
                        Auto Renewal
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Your plan will automatically renew each month
                      </p>
                    </div>
                    
                    {/* Apple-style Toggle Button */}
                    <button
                      onClick={handleAutoRenewToggle}
                      className="relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      role="switch"
                      aria-checked={autoRenew}
                    >
                      <span className="sr-only">
                        Auto Renewal {autoRenew ? 'ON' : 'OFF'}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          autoRenew
                            ? 'translate-x-8 bg-blue-500'
                            : 'translate-x-0'
                        }`}
                      >
                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                          autoRenew ? 'opacity-0' : 'opacity-100'
                        }`}>
                          <div className="h-4 w-0.5 bg-gray-400" />
                        </div>
                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                          autoRenew ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
                            <path d="M3.5 6.5L5 8l3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Glass Effect Card */}
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Plan Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsChangingPlan(true)}
                    disabled={isChangingPlan}
                    className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isChangingPlan ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Change Plan'
                    )}
                  </button>

                  <button
                    onClick={() => setIsCancelling(true)}
                    disabled={isCancelling}
                    className="w-full py-3 px-4 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-medium rounded-xl transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Plan'}
                  </button>
                </div>
              </div>

              {/* Billing History Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Billing History
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">December 2023</p>
                        <p className="text-sm text-gray-500">QR 350.00</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">November 2023</p>
                        <p className="text-sm text-gray-500">QR 350.00</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>

                <button className="mt-4 w-full py-2.5 text-blue-600 hover:text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                  View All Billing History
                </button>
              </div>

              
            </div>
          </div>
        </div>

        {/* Footer Note */}
        
      </div>
    </div>
  );
}

export default SettingsPlan;
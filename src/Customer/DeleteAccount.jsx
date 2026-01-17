import React, { useState } from 'react';

function DeleteAccount({ onBack, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState('');

  return (
    <div className="
      min-h-screen w-full overflow-x-hidden
      p-3 xs:p-4 sm:p-6
      

     mb-6 mt-10 ">
      {/* Header */}
      <div className="flex items-center gap-3  sm:mb-6 mb-6 mt-10">
        <button
          onClick={onBack}
          className="mr-3  hover:text-blue-500 
               p-2
              rounded-xl
              bg-white/95 backdrop-blur-xl
              border border-white/90
              text-gray-600
              shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.4)]
              hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(0,0,0,0.04)]
              active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center
              group"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h1 className="text-base sm:text-xl md:text-2xl font-bold truncate text-red-600">
          Delete My Account
        </h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Warning */}
        <div className="p-4 sm:p-5 bg-white/80 border rounded-xl sm:rounded-2xl shadow">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Are you sure you want to delete your account?
            <br className="hidden sm:block"/>
            You won't be able to access it again.
          </p>
        </div>

        {/* Reasons */}
        <div className="p-4 sm:p-5 bg-white/80 border rounded-xl sm:rounded-2xl shadow">
          <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">
            Why are you leaving?
          </h3>

          <div className="space-y-2 sm:space-y-3">
            {[
              { value: "another-account", label: "I have another account" },
              { value: "not-shopping", label: "I'm not shopping from here anymore" },
              { value: "not-using", label: "I don't use this account anymore" },
              { value: "too-many-emails", label: "Too many emails/notifications" },
              { value: "security", label: "Security concerns" },
              { value: "other", label: "None of the above" },
            ].map((x, i) => (
              <label
                key={i}
                className="
                  flex items-start gap-3
                  p-3 sm:p-4
                  bg-white rounded-xl
                  border shadow
                  cursor-pointer
                  text-sm sm:text-base
                "
              >
                <input
                  type="radio"
                  name="reason"
                  checked={selectedReason === x.value}
                  value={x.value}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0"
                />
                <span className="flex-1">{x.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={onConfirm}
          className="
            w-full py-3 sm:py-4
            rounded-xl sm:rounded-2xl
            bg-red-600 text-white
            text-sm sm:text-base font-medium
            shadow
            active:scale-95 transition
          "
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
}

export default DeleteAccount;
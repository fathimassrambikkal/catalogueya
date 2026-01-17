import React from 'react';

function DeleteConfirm({ onBack }) {
  return (
    <div className="
      min-h-screen w-full overflow-x-hidden
      p-3 xs:p-4 sm:p-6
      

     mb-6 mt-10 ">
      {/* Header */}
      <div className="flex items-center gap-3  sm:mb-6 mb-6 mt-10">
        <button
          onClick={onBack}
          className="mr-3 p-2 rounded-xl  hover:text-blue-500 
      
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
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-base sm:text-xl md:text-2xl font-bold truncate text-red-600">
          Confirm Deletion
        </h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="p-4 sm:p-5 bg-white/80 border rounded-xl sm:rounded-2xl shadow">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            This action is permanent.
            <br className="hidden sm:block"/>
            You cannot undo this.
          </p>
        </div>

        <button
          className="
            w-full py-3 sm:py-4
            bg-red-600
            rounded-xl sm:rounded-2xl
            text-white
            text-sm sm:text-base font-medium
            shadow
            active:scale-95 transition
          "
        >
          Confirm Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirm;
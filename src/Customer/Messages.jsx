import React, { useState } from 'react'

function Messages() {
  const [activeView, setActiveView] = useState('main');

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">My Messages</h1>
      
      <div className="space-y-4 max-w-2xl mx-auto">
       
        <div 
          onClick={() => setActiveView('alRyhan')}
          className="flex items-center p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
            hover:border-blue-200/60 hover:scale-[1.02]"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
            <span className="text-white font-semibold text-sm">3</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">AlRyhan</h3>
            <p className="text-gray-600 text-sm">You have a new message</p>
          </div>
          <div className="text-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Empty state for other messages */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="text-center p-8 rounded-2xl
          bg-white/60 backdrop-blur-lg border border-gray-200/50
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4
            shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
            <span className="text-gray-400 text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Other Messages</h3>
          <p className="text-gray-600 text-sm">Your other conversations will appear here</p>
        </div>
      </div>
    </div>
  );

  const renderAlRyhanChat = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center mb-6 max-w-4xl mx-auto">
        <button 
          onClick={() => setActiveView('main')}
          className="mr-4 p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex items-center flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AlRyhan</h1>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <p className="text-green-600 text-sm font-medium">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto">
        <div className="border-t border-gray-200/60 my-6"></div>
      </div>

      {/* Chat messages area */}
      <div className="max-w-4xl mx-auto mb-24">
        {/* Sample messages */}
      </div>

      {/* Message input - Fixed bottom */}
      <div className="absolute bottom-1 left-4 right-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:max-w-2xl">
        <div className="p-2 rounded-2xl
          bg-white/80 backdrop-blur-lg border border-gray-200/60
          shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 px-4 py-2 placeholder-gray-500"
            />
            <button className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200
              shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render appropriate view based on activeView state
  switch (activeView) {
    case 'alRyhan':
      return renderAlRyhanChat();
    default:
      return renderMainView();
  }
}

export default Messages;
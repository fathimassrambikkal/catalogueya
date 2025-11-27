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
    <div className="h-full flex flex-col bg-white max-w-md mx-auto w-full shadow-2xl">
      {/* Simple Header */}
      <div className="flex items-center p-4 border-b border-gray-100 bg-white">
        <button 
          onClick={() => setActiveView('main')}
          className="mr-3 p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex items-center flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AlRyhan</h1>
            <p className="text-green-600 text-xs font-medium">Online</p>
          </div>
        </div>
      </div>

      {/* Chat Area - No Scroll */}
      <div className="flex-1  p-4 overflow-hidden">
        <div className=" flex flex-col justify-end space-y-3">
          {/* Incoming Message */}
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
              <p className="text-gray-800 text-sm">Hello! How can I help you today?</p>
              <span className="text-xs text-gray-500 mt-1 block">10:30 AM</span>
            </div>
          </div>

          {/* Outgoing Message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] bg-blue-500 rounded-2xl rounded-br-none px-4 py-3">
              <p className="text-white text-sm">I need assistance with my account</p>
              <span className="text-xs text-blue-100 mt-1 block">10:31 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm"
            />
          </div>
          <button className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
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
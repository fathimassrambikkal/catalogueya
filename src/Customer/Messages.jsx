import React, { useState } from 'react'

function Messages() {
  const [activeView, setActiveView] = useState('main');

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 w-full">
      <div className="w-full mx-auto">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 break-words">
          My Messages
        </h1>
        
        <div className="space-y-4 w-full">
          <div 
            onClick={() => setActiveView('alRyhan')}
            className="flex items-center p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
              hover:border-blue-200/60 hover:scale-[1.02] w-full"
          >
            {/* Avatar */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg flex-shrink-0">
              <span className="text-white font-semibold text-sm">3</span>
            </div>
            
            {/* Content area */}
            <div className="flex-1 min-w-0 mr-3">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 truncate">
                AlRyhan
              </h3>
              <p className="text-gray-600 text-sm truncate">
                You have a new message
              </p>
            </div>
            
            {/* Chevron */}
            <div className="text-blue-500 flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Empty state for other messages */}
        <div className="w-full mx-auto mt-6 sm:mt-8">
          <div className="text-center p-5 sm:p-8 rounded-2xl
            bg-white/60 backdrop-blur-lg border border-gray-200/50
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5
              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
              <span className="text-gray-400 text-xl sm:text-2xl">💬</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 break-words">
              No Other Messages
            </h3>
            <p className="text-gray-600 text-sm px-3 break-words max-w-md mx-auto">
              Your other conversations will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlRyhanChat = () => (
    <div className="h-full flex flex-col bg-white w-full mx-auto">
      {/* Header */}
      <div className="flex items-center p-4 sm:p-5 border-b border-gray-100 bg-white w-full">
        <button 
          onClick={() => setActiveView('main')}
          className="mr-3 p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <div className="flex items-center flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
          
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              AlRyhan
            </h1>
            <p className="text-green-600 text-sm font-medium truncate">
              Online
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 sm:p-5 w-full">
        <div className="flex flex-col justify-end space-y-3 sm:space-y-4 w-full">
          {/* Incoming Message */}
          <div className="flex justify-start w-full">
            <div className="max-w-full sm:max-w-[85%] bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
              <p className="text-gray-800 text-sm sm:text-base break-words leading-relaxed whitespace-pre-wrap">
                Hello! How can I help you today?
              </p>
              <span className="text-xs text-gray-500 mt-2 block">10:30 AM</span>
            </div>
          </div>

          {/* Outgoing Message */}
          <div className="flex justify-end w-full">
            <div className="max-w-full sm:max-w-[85%] bg-blue-500 rounded-2xl rounded-br-none px-4 py-3">
              <p className="text-white text-sm sm:text-base break-words leading-relaxed whitespace-pre-wrap">
                I need assistance with my account
              </p>
              <span className="text-xs text-blue-100 mt-2 block">10:31 AM</span>
            </div>
          </div>

          {/* Additional sample messages */}
          <div className="flex justify-start w-full">
            <div className="max-w-full sm:max-w-[85%] bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
              <p className="text-gray-800 text-sm sm:text-base break-words leading-relaxed whitespace-pre-wrap">
                Sure, I'd be happy to help you with your account issues. What seems to be the problem?
              </p>
              <span className="text-xs text-gray-500 mt-2 block">10:32 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-5 border-t border-gray-100 bg-white w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 min-w-0 bg-gray-100 rounded-2xl px-4 py-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
            />
          </div>
          
          <button className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex-shrink-0 w-12 h-12 flex items-center justify-center">
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
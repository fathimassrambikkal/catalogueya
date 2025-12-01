import React, { useState } from "react";

function Messages() {
  const [activeView, setActiveView] = useState("main");

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">My Messages</h1>

        <div className="space-y-4 w-full">
          <button
            onClick={() => setActiveView("alRyhan")}
            className="flex items-start p-4 rounded-2xl w-full bg-white/80 border border-gray-200/60 hover:shadow-md transition"
          >
         
            <div className="flex-1 min-w-0 mr-3 overflow-hidden">
              <h3 className="font-semibold text-gray-900 truncate">AlRyhan</h3>
              <p className="text-gray-600 text-sm truncate">You have a new message</p>
            </div>
            <div className="text-blue-500 flex-shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        <div className="mt-6">
          <div className="text-center p-6 bg-white/60 rounded-2xl border">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">💬</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Other Messages</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">Your other conversations will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlRyhanChat = () => (
    <div className="h-full flex flex-col bg-white w-full overflow-x-hidden">
      <div className="flex items-start p-4 border-b">
        <button onClick={() => setActiveView("main")} className="mr-3 p-2 rounded-xl bg-white text-gray-600">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="flex items-center flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3 text-white flex-shrink-0">A</div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold truncate">AlRyhan</h1>
            <p className="text-green-600 text-sm truncate">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-start">
            <div className="max-w-full sm:max-w-[85%] bg-gray-100 rounded-2xl px-4 py-3 break-words">
              <p className="text-gray-800">Hello! How can I help you today?</p>
              <span className="text-xs text-gray-500 block mt-2">10:30 AM</span>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="max-w-full sm:max-w-[85%] bg-blue-500 text-white rounded-2xl px-4 py-3 break-words">
              <p>I need assistance with my account</p>
              <span className="text-xs block mt-2 text-blue-100">10:31 AM</span>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-full sm:max-w-[85%] bg-gray-100 rounded-2xl px-4 py-3 break-words">
              <p>Sure, I'd be happy to help you. What seems to be the problem?</p>
              <span className="text-xs text-gray-500 block mt-2">10:32 AM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0 bg-gray-100 rounded-2xl px-4 py-3">
            <input className="w-full bg-transparent outline-none" placeholder="Type a message." />
          </div>
          <button className="p-3 bg-blue-500 text-white rounded-xl w-12 h-12 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );

  return activeView === "alRyhan" ? renderAlRyhanChat() : renderMainView();
}

export default Messages;

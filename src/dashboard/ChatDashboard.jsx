// src/dashboard/ChatDashboard.jsx
import React from "react";
import { ChevronLeft } from "lucide-react";

function ChatDashboard({ chat, onBack }) {
  if (!chat) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>

        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-10 h-10 rounded-full"
        />

        <div>
          <h2 className="font-semibold">{chat.name}</h2>
          <p className="text-xs text-gray-500">
            {chat.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
              msg.sender === "me"
                ? "ml-auto bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            {msg.text}
            <div className="text-[10px] opacity-70 mt-1 text-right">
              {msg.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatDashboard;

// src/components/chat/ChatHeader.jsx
import React from "react";
import { ChevronLeft } from "lucide-react";

function ChatHeader({ name, online, onBack }) {
  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <button
        onClick={onBack}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        <ChevronLeft />
      </button>

      <div>
        <h2 className="font-semibold">{name}</h2>
        <p className="text-xs text-gray-500">
          {online ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}

export default ChatHeader;

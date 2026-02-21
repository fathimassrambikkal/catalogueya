// src/components/chat/ChatHeader.jsx
import React, { useState } from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";

function ChatHeader({ name, online, onBack, onAddContact, isContact }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 border-b relative">
      <div className="flex items-center gap-3">
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

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical size={20} className="text-gray-600" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100 py-1 z-50">
            <button
              onClick={() => {
                onAddContact();
                setShowMenu(false);
              }}
              disabled={isContact}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isContact ? "Contact Saved" : "Add to Contacts"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;

// src/components/chat/ChatInput.jsx
import React, { useState } from "react";
import { Send } from "lucide-react";

function ChatInput({ onSend }) {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Type a message…"
        className="flex-1 px-4 py-2 border rounded-xl focus:outline-none"
      />
      <button
        onClick={send}
        className="p-3 bg-blue-500 text-white rounded-xl"
      >
        <Send size={16} />
      </button>
    </div>
  );
}

export default ChatInput;

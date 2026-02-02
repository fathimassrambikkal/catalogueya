// src/dashboard/ChatDashboard.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "../Customer/MessageList";

// TEMP — later replace with API / store
const conversations = [
  {
    id: 1,
    name: "Mona Faheem Alharmy",
    online: false,
    messages: [
      {
        id: 1,
        body: "Hi I wana know if you can delever to my House",
        created_at: new Date(),
        sender_id: "them",
      },
    ],
  },
];

function ChatDashboard() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const chat = useMemo(
    () => conversations.find(c => c.id === Number(conversationId)),
    [conversationId]
  );

  const [messages, setMessages] = useState(chat?.messages || []);

  if (!chat) return <div className="p-6">Chat not found</div>;

  const sendMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        body: text,
        created_at: new Date(),
        sender_id: "me",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-white rounded-2xl shadow-lg">
      <ChatHeader
        name={chat.name}
        online={chat.online}
        onBack={() => navigate(-1)}
      />

      <MessageList
        messages={messages}
        currentUserId="me"
      />

      <ChatInput onSend={sendMessage} />
    </div>
  );
}

export default ChatDashboard;

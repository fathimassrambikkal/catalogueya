// src/dashboard/ChatDashboard.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addContact, getContacts } from "../companyDashboardApi";
import { toast } from "react-hot-toast";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "../Customer/MessageList";

// TEMP — later replace with API / store
const conversations = [
  {
    id: 1,
    name: "Mona Faheem Alharmy",
    online: false,
    // Assuming we have participant ID here
    participant_id: 62, 
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
  const [isContact, setIsContact] = useState(false);

  const chat = useMemo(
    () => conversations.find(c => c.id === Number(conversationId)),
    [conversationId]
  );

  const [messages, setMessages] = useState(chat?.messages || []);

  useEffect(() => {
    // Check if this chat user is already in contacts
    if (chat?.participant_id) {
      checkContactStatus(chat.participant_id);
    }
  }, [chat]);

  const checkContactStatus = async (userId) => {
    try {
      const res = await getContacts();
      const contacts = res.data?.data || res.data || [];
      const exists = contacts.some(c => String(c.contact_user_id) === String(userId));
      setIsContact(exists);
    } catch (err) {
      console.error(err);
    }
  };

  if (!chat) return <div className="p-6">Chat not found</div>;

  const handleAddContact = async () => {
    if (!chat.participant_id) return;
    try {
      await addContact(chat.participant_id);
      toast.success("Contact added successfully");
      setIsContact(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add contact");
    }
  };

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
        onAddContact={handleAddContact}
        isContact={isContact}
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

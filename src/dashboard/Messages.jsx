// src/dashboard/Messages.jsx
import React, { useState, useEffect, useRef } from "react";
import { Search, Send, Paperclip, Check, CheckCheck, MoreHorizontal, UserPlus, Star } from "lucide-react";
import {
  getConversations,
  getConversation,
  sendMessage,
  markConversationRead,
  getImageUrl,
  addContact
} from "../companyDashboardApi";
import { FaUserPlus } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import LinkPreview from "../components/LinkPreview";
import ReviewRequestModal from "./ReviewRequestModal";
import { useNavigate } from "react-router-dom";
import ChatWindow from "./ChatWindow";
const extractUrl = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text?.match(urlRegex);
  return match ? match[0] : null;
};

export default function Messages({ companyId, lastMessageEvent, onUnreadChange, targetConversationId, setTargetConversationId,onChatOpen  }) {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  
const navigate = useNavigate();
  // Auto-select conversation based on targetConversationId from Notifications

useEffect(() => {
  if (onChatOpen) {
    onChatOpen(!!selectedChat);
  }
}, [selectedChat]);

  useEffect(() => {
    if (targetConversationId && conversations.length > 0) {
      const match = conversations.find(c => String(c.id) === String(targetConversationId));
      if (match) {
        setSelectedChat(match);
        // We set to null after a small delay to ensure it's processed but doesn't loop
        setTargetConversationId(null);
      }
    }
  }, [targetConversationId, conversations]);


  const [selectedChatMessages, setSelectedChatMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);
  const [showReviewModal, setShowReviewModal] = useState(false);



  // Get current company ID from localStorage
  const getCurrentCompanyId = () => {
    try {
      const company = JSON.parse(localStorage.getItem("company") || "{}");
      return company?.id || companyId;
    } catch {
      return companyId;
    }
  };

  // Listen for global message events from parent
  useEffect(() => {
    if (!lastMessageEvent) return;

    const { message, conversation_id } = lastMessageEvent;

    // 1. If this message belongs to the currently selected chat, append it
    if (selectedChat && String(selectedChat.id) === String(conversation_id)) {
      setSelectedChatMessages(prev => {
        // Prevent duplicates if by chance
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
        scrollToBottom();
      // Mark as read immediately since we are looking at it
      markConversationRead(conversation_id);
    } 

    // 2. Update conversation list for ALL events
    // We re-fetch to get updated previews and ordering. 
    // Optimization: could manually shift the conversation to top.
    fetchConversations();

  }, [lastMessageEvent]);

  // Update parent with unread count whenever conversations change
  useEffect(() => {
    if (!conversations) return;
    const count = conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);
    if (onUnreadChange) onUnreadChange(count);
  }, [conversations]);

  // Poll for conversation list
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (!selectedChat) return;
    fetchChatMessages(selectedChat.id, false);
  }, [selectedChat]);

  // Scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [selectedChatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const res = await getConversations();
      let list = [];
      if (res.data?.data) {
        list = Array.isArray(res.data.data) ? res.data.data : (res.data.data.conversations || []);
      } else if (Array.isArray(res.data)) {
        list = res.data;
      }
      setConversations(list);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchChatMessages = async (id, silent = false) => {
    if (!silent) setLoadingChat(true);
    try {
      const res = await getConversation(id);

      // Extract messages from the response
      let msgs = [];
      if (res.data?.messages) {
        msgs = res.data.messages;
      } else if (res.data?.data?.messages) {
        msgs = res.data.data.messages;
      } else if (Array.isArray(res.data)) {
        msgs = res.data;
      }

      setSelectedChatMessages(msgs);

      if (!silent) {
        // Mark read
        markConversationRead(id);
        // Update local unread count
        setConversations(prev => {
          const next = prev.map(c => c.id === id ? { ...c, unread_count: 0 } : c);
          // Calculate new total
          const count = next.reduce((acc, c) => acc + (c.unread_count || 0), 0);
          if (onUnreadChange) onUnreadChange(count);
          return next;
        });
      }
    } catch (error) {
      console.error("Error fetching messages", error);
    } finally {
      if (!silent) setLoadingChat(false);
    }
  };

  const handleAddContact = async () => {
    const participant = getParticipantInfo(selectedChat);
    if (!participant || !participant.id) {
      // Try falling back to sender_id logic if participant info missing or chat structure different
      // This depends on how `getParticipantInfo` works.
      // Keep simple for now.
      toast.error("Contact information missing");
      return;
    }

    try {
      await addContact(participant.id);
      toast.success("Contact added successfully");
      setShowMenu(false);
    } catch (error) {
      console.error("Error adding contact", error);
      toast.error("Failed to add contact");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageBody.trim() && attachments.length === 0) return;
    if (!selectedChat) return;

    const formData = new FormData();
    formData.append("body", messageBody);
    attachments.forEach(file => {
      formData.append("attachments[]", file);
    });

    // Optimistic update
    const tempMsg = {
      id: Date.now(),
      body: messageBody,
      created_at: new Date().toISOString(),
      sender_type: "App\\Models\\company",
      sender_id: getCurrentCompanyId(),
      attachments: [],
      isTemp: true
    };
    setSelectedChatMessages(prev => [...prev, tempMsg]);
    setMessageBody("");
    setAttachments([]);

    try {
      await sendMessage(selectedChat.id, formData);
      fetchChatMessages(selectedChat.id, true);
    } catch (error) {
      console.error("Error sending message", error);
      alert("Failed to send message");
    }
  };

  const filteredConversations = conversations.filter(chat => {
    const otherParticipant = chat.other_participant;
    const name = otherParticipant?.name_en || otherParticipant?.name || chat.title || "Customer";
    const lastMsg = chat.last_message?.body || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastMsg.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Helper to get participant info
  const getParticipantInfo = (chat) => {
    return chat.other_participant || {};
  };

  const getAvatar = (chat) => {
    const participant = getParticipantInfo(chat);
    const avatarPath = participant?.image || participant?.avatar;
    return avatarPath ? getImageUrl(avatarPath) : null;
  };

  const getName = (chat) => {
    const participant = getParticipantInfo(chat);
    return participant?.name_en || participant?.name || chat.title || "Customer";
  };

  const formatTime = (time) => {
    if (!time) return "";
    const d = new Date(time);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString();
  };

  return (
    <div className="flex h-[calc(100vh-80px)]  overflow-hidden ">
      {/* LEFT: Conversation List */}
      <div className={`flex flex-col w-full md:w-1/3 bg-white/80 backdrop-blur-lg   ${selectedChat ? 'hidden md:flex' : 'flex'}`}>

        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mt-20 md:mt-4 ">
            Messages
          </h1>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {loadingList ? (
            <div className="text-center p-4 text-gray-500">Loading...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center p-4 text-gray-500">No conversations</div>
          ) : (
            filteredConversations.map(chat => {
              const name = getName(chat);
              const lastMsg = chat.last_message?.body || "No messages";
              const time = chat.last_message?.created_at || chat.updated_at;
              const unread = chat.unread_count || 0;
              const avatar = getAvatar(chat);
              const participant = getParticipantInfo(chat);
              const isOnline = chat.other_participant_status === "online";

              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200 border' : 'hover:bg-gray-50 border border-transparent'}`}
                >
                  <div className="relative">
                    {avatar ? (
                      <img src={avatar} className="w-12 h-12 rounded-full object-cover border border-gray-100" alt={name} />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{formatTime(time)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 truncate">{lastMsg}</p>
                      {unread > 0 && <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">{unread}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

   {/* RIGHT: Chat Window */}
<div
  className={`flex flex-col flex-1 overflow-hidden mt-4  ${
    selectedChat ? "flex" : "hidden md:flex"
  }`}
>
  <ChatWindow
    selectedChat={selectedChat}
    messages={selectedChatMessages}
    loadingChat={loadingChat}
    messageBody={messageBody}
    setMessageBody={setMessageBody}
    attachments={attachments}
    setAttachments={setAttachments}
    handleSendMessage={handleSendMessage}
    handleAddContact={handleAddContact}
    getAvatar={getAvatar}
    getName={getName}
    getCurrentCompanyId={getCurrentCompanyId}
    formatTime={formatTime}
    onBack={() => setSelectedChat(null)}
    
  />
</div>

      {selectedChat && (
        <ReviewRequestModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          customerId={getParticipantInfo(selectedChat)?.id}
          customerName={getName(selectedChat)}
        />
      )}
    </div>
  );
}

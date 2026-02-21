// src/dashboard/Messages.jsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Hardcoded messages data
const conversations = [
  {
    id: 1,
    name: "Mona Faheem Alharmy",
    lastMessage: "Hi I wana know if you can delever to my House",
    time: "11:39 AM",
    unread: 12,
    online: false,
    messages: [
      {
        id: 1,
        text: "Hi I wana know if you can delever to my House",
        time: "11:39 AM",
        sender: "them",
      },
    ],
  },
  {
    id: 2,
    name: "Mona Faheem Alharmy",
    lastMessage: "Hi I wana know if you can delever to my House",
    time: "09:34 AM",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        text: "Hi I wana know if you can delever to my House",
        time: "09:34 AM",
        sender: "them",
      },
    ],
  },
  {
    id: 3,
    name: "Mona Faheem Alharmy",
    lastMessage: "Hi I wana know if you can delever to my House",
    time: "Yesterday",
    unread: 12,
    online: false,
    messages: [
      {
        id: 1,
        text: "Hi I wana know if you can delever to my House",
        time: "Yesterday",
        sender: "them",
      },
    ],
  },
  {
    id: 4,
    name: "Mona Faheem Alharmy",
    lastMessage: "Hi I wana know if you can delever to my House",
    time: "Monday",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        text: "Hi I wana know if you can delever to my House",
        time: "Monday",
        sender: "them",
      },
    ],
  },
];

function Messages() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredConversations = conversations.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen md:p-6">
      <div className="flex flex-col w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 mr-4">

        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Messages
          </h1>

          {/* Search */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredConversations.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 mb-2 ${
                selectedChat.id === chat.id
                  ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg shadow-blue-200"
                  : "hover:bg-blue-50/50"
              }`}
              onClick={() => {
                setSelectedChat(chat);
                navigate(`/company-dashboard/chat/${chat.id}`);
              }}
            >
              <div className="flex items-center">
                <div className="relative">
                  {/* 🔒 SAFE placeholder, UI unchanged */}
                  <img
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                    alt={chat.name}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />

                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-semibold truncate ${
                      selectedChat.id === chat.id ? "text-white" : "text-gray-900"
                    }`}>
                      {chat.name}
                    </h3>
                    <span className={`text-xs ${
                      selectedChat.id === chat.id ? "text-white/80" : "text-gray-500"
                    }`}>
                      {chat.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className={`truncate text-sm ${
                      selectedChat.id === chat.id ? "text-white/90" : "text-gray-600"
                    }`}>
                      {chat.lastMessage}
                    </p>

                    {chat.unread > 0 && (
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedChat.id === chat.id
                          ? "bg-white text-blue-500"
                          : "bg-blue-500 text-white"
                      }`}>
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Messages;

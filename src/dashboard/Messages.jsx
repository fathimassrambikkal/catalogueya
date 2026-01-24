// src/dashboard/Messages.jsx
import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronLeft,
  Check,
  CheckCheck,
  Paperclip,
  Mic,
  Smile,
  Send,
  Phone,
  Video,
  Info
} from "lucide-react";
import ChatDashboard from "./ChatDashboard";

// Hardcoded messages data
const conversations = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    lastMessage: "Hey! The design files are ready for review",
    time: "10:30 AM",
    unread: 2,
    online: true,
    messages: [
      { id: 1, text: "Hi Alex!", time: "9:45 AM", sender: "me" },
      { id: 2, text: "Hey! The design files are ready for review", time: "10:30 AM", sender: "them" },
      { id: 3, text: "That's great! Can you share them with me?", time: "10:32 AM", sender: "me" },
      { id: 4, text: "Already did! Check your email", time: "10:33 AM", sender: "them" },
    ]
  },
  {
    id: 2,
    name: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    lastMessage: "Meeting rescheduled to 3 PM tomorrow",
    time: "Yesterday",
    unread: 0,
    online: true,
    messages: [
      { id: 1, text: "Hi Emma, about our meeting tomorrow...", time: "Yesterday", sender: "me" },
      { id: 2, text: "Meeting rescheduled to 3 PM tomorrow", time: "Yesterday", sender: "them" },
      { id: 3, text: "Perfect, thanks for letting me know!", time: "Yesterday", sender: "me" },
    ]
  },
  {
    id: 3,
    name: "Design Team",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Design",
    lastMessage: "Sarah: I've updated the color palette",
    time: "2 days ago",
    unread: 5,
    online: false,
    isGroup: true,
    messages: [
      { id: 1, text: "Team, let's discuss the new project", time: "2 days ago", sender: "me" },
      { id: 2, text: "I've updated the color palette", time: "2 days ago", sender: "Sarah" },
      { id: 3, text: "Looks great! The blue tones are perfect", time: "1 day ago", sender: "Mike" },
    ]
  },
  {
    id: 4,
    name: "Michael Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    lastMessage: "Thanks for your help with the project!",
    time: "3 days ago",
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: "Hi Michael, I've completed the backend integration", time: "3 days ago", sender: "me" },
      { id: 2, text: "Thanks for your help with the project!", time: "3 days ago", sender: "them" },
    ]
  },
  {
    id: 5,
    name: "Sarah Parker",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "Can we catch up tomorrow morning?",
    time: "1 week ago",
    unread: 0,
    online: true,
    messages: [
      { id: 1, text: "Hey Sarah, how's everything going?", time: "1 week ago", sender: "me" },
      { id: 2, text: "All good! Can we catch up tomorrow morning?", time: "1 week ago", sender: "them" },
    ]
  }
];

// Additional messages for more realism
const additionalMessages = [
  "The new update looks amazing!",
  "Can you review my latest changes?",
  "Let's schedule a call to discuss this",
  "I've sent you the documents",
  "What time works for you tomorrow?",
  "Great work on the presentation!",
  "The deadline has been extended",
  "Check out this article I found",
  "Need your feedback on this design",
  "Conference call at 2 PM today",
  "The files have been uploaded",
  "Thanks for your quick response!",
  "Looking forward to our meeting",
  "Can you share the access credentials?",
  "I'll send the details shortly"
];

function Messages() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
const [activeChat, setActiveChat] = useState(null);

  const filteredConversations = conversations.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const updatedChat = {
      ...selectedChat,
      messages: [
        ...selectedChat.messages,
        {
          id: selectedChat.messages.length + 1,
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: "me"
        }
      ],
      lastMessage: newMessage,
      time: "Just now"
    };
    
    setSelectedChat(updatedChat);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-6">
      {/* Left Sidebar - Conversations List */}
      <div className="flex flex-col w-full  bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 mr-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Messages
            </h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                <Filter className="w-5 h-5 text-blue-600" />
              </button>
              <button className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              onClick={() => setActiveChat(chat)}

            >
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                  {chat.isGroup && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-white">G</span>
                    </div>
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
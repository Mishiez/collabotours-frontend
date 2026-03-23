import { useState } from 'react';
import Button from '../../components/common/Button';

// Sample conversations for tourist
const conversations = [
  {
    id: 1,
    business: 'Safari Kenya',
    avatar: 'SK',
    lastMessage: 'Hello! Yes, we have availability for March 15th. Would you like to book?',
    time: '10:30 AM',
    unread: 1,
    online: true,
    type: 'business'
  },
  {
    id: 2,
    business: 'Beach Paradise',
    avatar: 'BP',
    lastMessage: 'Your booking has been confirmed. We look forward to hosting you!',
    time: 'Yesterday',
    unread: 0,
    online: false,
    type: 'business'
  },
  {
    id: 3,
    business: 'Cultural Tours',
    avatar: 'CT',
    lastMessage: 'The cooking class starts at 10 AM. Please arrive 15 minutes early.',
    time: 'Mar 22',
    unread: 0,
    online: true,
    type: 'business'
  }
];

// Sample messages for selected conversation
const sampleMessages = {
  1: [
    { id: 101, sender: 'tourist', text: "Hi, I'm interested in the Masai Mara Safari for March 15th. Do you have availability?', time: '10:15 AM" },
    { id: 102, sender: 'business', text: 'Hello! Yes, we have availability for March 15th. Would you like to book?', time: '10:30 AM' },
    { id: 103, sender: 'tourist', text: 'Yes please! It will be 2 people. What time does it start?', time: '10:32 AM' },
    { id: 104, sender: 'business', text: 'The tour starts at 8 AM. We offer complimentary pickup from your hotel.', time: '10:35 AM' }
  ]
};

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.business.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    console.log('Sending message:', messageInput);
    // Will connect to backend later
    setMessageInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)]">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex overflow-hidden">
        
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-100 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                    selectedConversation?.id === conv.id ? 'bg-[#EDAE49]/5' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-[#003D5B] flex items-center justify-center text-white font-bold text-sm">
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-[#003D5B] truncate">{conv.business}</h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{conv.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">Tour Operator</p>
                    <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-[#EDAE49] text-[#003D5B] text-xs font-bold flex items-center justify-center">
                      {conv.unread}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400">No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-[#003D5B] flex items-center justify-center text-white font-bold text-sm">
                    {selectedConversation.avatar}
                  </div>
                  {selectedConversation.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-[#003D5B]">{selectedConversation.business}</h3>
                  <p className="text-xs text-gray-400">
                    {selectedConversation.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-[#003D5B] transition-colors">
                ℹ️
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(sampleMessages[selectedConversation.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'tourist' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.sender === 'tourist'
                        ? 'bg-[#EDAE49] text-[#003D5B] rounded-tr-none'
                        : 'bg-gray-100 text-[#003D5B] rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                />
                <button 
                  className="p-3 text-gray-400 hover:text-[#003D5B] transition-colors"
                  onClick={() => alert('File attachment coming soon!')}
                >
                  📎
                </button>
                <button 
                  className="p-3 bg-[#EDAE49] text-[#003D5B] rounded-xl hover:bg-[#e5a23e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-[#003D5B] mb-2">No conversation selected</h3>
              <p className="text-gray-400">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
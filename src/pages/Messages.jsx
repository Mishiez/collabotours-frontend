// // Messages.jsx
// export default function Messages() {
//   return <div className="p-8"><h1 className="text-2xl font-bold text-[#003D5B]">Messages</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>;
// }

import { useState } from 'react';
import Button from '../components/common/Button';

const conversations = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    avatar: 'SM',
    lastMessage: 'Hi, I was wondering if you have availability for the safari tour next week?',
    time: '10:30 AM',
    unread: 2,
    online: true,
    role: 'Customer',
  },
  {
    id: 2,
    name: 'James Omondi',
    avatar: 'JO',
    lastMessage: 'Thanks for the quick response! I\'d like to book the beach package.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    role: 'Customer',
  },
  {
    id: 3,
    name: 'Savannah Guides Ltd',
    avatar: 'SG',
    lastMessage: 'We\'re interested in partnering for the upcoming high season.',
    time: 'Yesterday',
    unread: 1,
    online: true,
    role: 'Partner',
  },
  {
    id: 4,
    name: 'Aisha Kamau',
    avatar: 'AK',
    lastMessage: 'Can I change my booking date for the city walk?',
    time: 'Mar 22',
    unread: 0,
    online: false,
    role: 'Customer',
  },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00798C] mb-1">
            Communications
          </p>
          <h1 className="text-3xl font-bold text-[#003D5B]">Messages</h1>
        </div>
        <Button variant="primary" size="md" icon="✎">New Message</Button>
      </div>

      {/* Messages Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-100 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
            />
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
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
                    <h3 className="font-semibold text-[#003D5B] truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{conv.role}</p>
                  <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-[#EDAE49] text-[#003D5B] text-xs font-bold flex items-center justify-center">
                    {conv.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation && (
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
                  <h3 className="font-semibold text-[#003D5B]">{selectedConversation.name}</h3>
                  <p className="text-xs text-gray-400">{selectedConversation.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-[#003D5B] transition-colors">📞</button>
                <button className="p-2 text-gray-400 hover:text-[#003D5B] transition-colors">ℹ️</button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Sample messages - will be dynamic with real data */}
              <div className="flex justify-start">
                <div className="max-w-[70%]">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2">
                    <p className="text-sm text-[#003D5B]">Hi there! I'm interested in booking your safari tour.</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">10:30 AM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[70%]">
                  <div className="bg-[#003D5B] rounded-2xl rounded-tr-none px-4 py-2">
                    <p className="text-sm text-white">Hello! Thanks for reaching out. Which date are you interested in?</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">10:32 AM</p>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                />
                <button className="p-3 text-gray-400 hover:text-[#003D5B] transition-colors">📎</button>
                <button className="p-3 bg-[#EDAE49] text-[#003D5B] rounded-xl hover:bg-[#e5a23e] transition-colors">
                  ➤
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
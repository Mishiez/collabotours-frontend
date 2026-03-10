import { useState, useEffect, useRef } from 'react';
import Button from '../components/common/Button';
import MessageBubble from '../components/modals/MessageBubble';
import TypingIndicator from '../components/modals/TypingIndicator';
import NewMessageModal from '../components/modals/NewMessageModal';
import ContactInfoModal from '../components/modals/ContactInfoModal';

// Initial conversations data
const initialConversations = [
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

// Initial messages data
const initialMessages = {
  1: [
    { id: 101, sender: 'them', text: 'Hi, I was wondering if you have availability for the safari tour next week?', time: '10:30 AM', status: 'read' },
    { id: 102, sender: 'me', text: 'Hello Sarah! Yes, we have availability. Which date were you thinking?', time: '10:32 AM', status: 'read' },
    { id: 103, sender: 'them', text: 'Great! Looking at March 15th for 2 people.', time: '10:33 AM', status: 'read' },
    { id: 104, sender: 'them', text: 'Also, do you offer pickup from hotels?', time: '10:34 AM', status: 'read' },
    { id: 105, sender: 'me', text: 'Yes, we provide complimentary pickup from most hotels in Nairobi.', time: '10:36 AM', status: 'delivered' },
  ],
  2: [
    { id: 201, sender: 'them', text: 'Thanks for the quick response! I\'d like to book the beach package.', time: '2:15 PM', status: 'read' },
    { id: 202, sender: 'me', text: 'Excellent choice! The beach package includes 3 nights at Diani Beach.', time: '2:17 PM', status: 'read' },
  ],
  3: [
    { id: 301, sender: 'them', text: 'We\'re interested in partnering for the upcoming high season.', time: '11:20 AM', status: 'read' },
    { id: 302, sender: 'me', text: 'That sounds interesting. What type of partnership did you have in mind?', time: '11:25 AM', status: 'read' },
  ],
};

export default function Messages() {
  const [conversations, setConversations] = useState(initialConversations);
  const [messages, setMessages] = useState(initialMessages);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation, messages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (selectedConversation && selectedConversation.unread > 0) {
      // Clear unread count
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, unread: 0 }
            : conv
        )
      );
      
      // Mark messages as read
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id]?.map(msg =>
          msg.sender === 'them' ? { ...msg, status: 'read' } : msg
        )
      }));
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    // Add message to conversation
    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
    }));

    // Update last message in conversations list
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: messageInput, time: 'Just now' }
          : conv
      )
    );

    setMessageInput('');

    // Simulate typing indicator and reply (for demo)
    setTimeout(() => {
      setIsTyping(true);
      scrollToBottom();
    }, 1000);

    setTimeout(() => {
      setIsTyping(false);
      
      const reply = {
        id: Date.now() + 1,
        sender: 'them',
        text: 'Thanks for your message! I\'ll get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), reply]
      }));
      
      scrollToBottom();
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartConversation = ({ contact, firstMessage }) => {
    const newConv = {
      id: Date.now(),
      name: contact.name,
      avatar: contact.avatar,
      lastMessage: firstMessage,
      time: 'Just now',
      unread: 0,
      online: contact.lastActive === 'Online',
      role: contact.role,
    };

    setConversations(prev => [newConv, ...prev]);
    
    setMessages(prev => ({
      ...prev,
      [newConv.id]: [
        {
          id: Date.now(),
          sender: 'me',
          text: firstMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
        }
      ]
    }));

    setSelectedConversation(newConv);
  };

  const handleAttachFile = () => {
    // In a real app, this would open file picker
    alert('File attachment coming soon!');
  };

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
        <Button 
          variant="primary" 
          size="md" 
          icon="✎"
          onClick={() => setIsNewMessageModalOpen(true)}
        >
          New Message
        </Button>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
            />
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
                  <h3 className="font-semibold text-[#003D5B]">{selectedConversation.name}</h3>
                  <p className="text-xs text-gray-400">{selectedConversation.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="p-2 text-gray-400 hover:text-[#003D5B] transition-colors"
                  onClick={() => alert('Call feature coming soon!')}
                >
                  📞
                </button>
                <button 
                  className="p-2 text-gray-400 hover:text-[#003D5B] transition-colors"
                  onClick={() => setIsContactInfoModalOpen(true)}
                >
                  ℹ️
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages[selectedConversation.id]?.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.text}
                  isMine={msg.sender === 'me'}
                  timestamp={msg.time}
                  status={msg.status}
                />
              ))}
              
              {isTyping && <TypingIndicator />}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                />
                <button 
                  className="p-3 text-gray-400 hover:text-[#003D5B] transition-colors"
                  onClick={handleAttachFile}
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
              <p className="text-gray-400 mb-4">Choose a conversation from the list or start a new one</p>
              <Button 
                variant="primary" 
                onClick={() => setIsNewMessageModalOpen(true)}
              >
                New Message
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <NewMessageModal 
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        onStartConversation={handleStartConversation}
      />

      <ContactInfoModal 
        isOpen={isContactInfoModalOpen}
        onClose={() => setIsContactInfoModalOpen(false)}
        contact={selectedConversation}
      />
    </div>
  );
}
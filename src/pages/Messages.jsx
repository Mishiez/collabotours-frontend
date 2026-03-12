import { useState, useEffect, useRef } from 'react';
import Button from '../components/common/Button';
import MessageBubble from '../components/modals/MessageBubble';
import TypingIndicator from '../components/modals/TypingIndicator';
import NewMessageModal from '../components/modals/NewMessageModal';
import ContactInfoModal from '../components/modals/ContactInfoModal';
import { 
  fetchConversations, 
  sendMessage,
  createConversation,
} from '../services/api';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Helper function to get conversation display name
  const getConversationName = (conv) => {
    if (conv.participants && conv.participants.length > 0) {
      // Filter out the current user (assuming current user is ID 1 for now)
      const otherParticipants = conv.participants.filter(p => p.id !== 1);
      if (otherParticipants.length > 0) {
        return otherParticipants.map(p => p.username).join(', ');
      }
      return conv.participants.map(p => p.username).join(', ');
    }
    return `Conversation ${conv.id}`;
  };

  // Helper function to get avatar initials
  const getAvatarInitials = (conv) => {
    const name = getConversationName(conv);
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Helper function to get last message
  const getLastMessage = (conv) => {
    if (conv.last_message) {
      return conv.last_message.content;
    }
    if (conv.messages && conv.messages.length > 0) {
      return conv.messages[conv.messages.length - 1].content;
    }
    return 'No messages yet';
  };

  // Helper function to get last message time
  const getLastMessageTime = (conv) => {
    if (conv.last_message) {
      const date = new Date(conv.last_message.created_at);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (conv.messages && conv.messages.length > 0) {
      const date = new Date(conv.messages[conv.messages.length - 1].created_at);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  };

  // Helper function to get unread count
  const getUnreadCount = (conv) => {
    if (conv.unread_count !== undefined) return conv.unread_count;
    if (conv.messages) {
      return conv.messages.filter(m => !m.is_read && m.sender !== 1).length;
    }
    return 0;
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    const convName = getConversationName(conv).toLowerCase();
    const lastMessage = getLastMessage(conv).toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return convName.includes(searchLower) || lastMessage.includes(searchLower);
  });

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversations from backend
  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation, messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetchConversations();
      console.log('Conversations loaded:', response.data);
      setConversations(response.data);
      
      // Load messages for each conversation
      const messagesMap = {};
      for (const conv of response.data) {
        if (conv.messages) {
          messagesMap[conv.id] = conv.messages;
        }
      }
      setMessages(messagesMap);
      
      // Select first conversation if available
      if (response.data.length > 0) {
        setSelectedConversation(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Could not load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      sender: 'me',
      sender_id: 1, // Assuming current user is ID 1
      text: messageInput,
      content: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      created_at: new Date().toISOString(),
      status: 'sending',
    };

    // Optimistically add to UI
    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
    }));

    setMessageInput('');

    try {
      const response = await sendMessage(selectedConversation.id, messageInput);
      
      // Replace temp message with real one
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].map(msg =>
          msg.id === tempId ? response.data : msg
        )
      }));

      // Update conversations list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, last_message: response.data }
            : conv
        )
      );
      
    } catch (err) {
      console.error('Failed to send message:', err);
      // Mark as failed
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].map(msg =>
          msg.id === tempId ? { ...msg, status: 'failed' } : msg
        )
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartConversation = async ({ contact, firstMessage }) => {
    try {
      // Create conversation with participant
      const participantIds = [1, contact.id]; // Assuming current user is 1
      const convResponse = await createConversation(participantIds);
      const newConv = convResponse.data;
      
      // Send first message
      const msgResponse = await sendMessage(newConv.id, firstMessage);
      
      // Add to conversations list
      setConversations(prev => [newConv, ...prev]);
      
      // Add message to messages map
      setMessages(prev => ({
        ...prev,
        [newConv.id]: [msgResponse.data]
      }));
      
      setSelectedConversation(newConv);
      
    } catch (err) {
      console.error('Failed to start conversation:', err);
      alert('Failed to start conversation');
    }
  };

  const handleAttachFile = () => {
    alert('File attachment coming soon!');
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex items-center justify-center">
        <p className="text-gray-400">Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
              filteredConversations.map((conv) => {
                const unreadCount = getUnreadCount(conv);
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                      selectedConversation?.id === conv.id ? 'bg-[#EDAE49]/5' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-[#003D5B] flex items-center justify-center text-white font-bold text-sm">
                        {getAvatarInitials(conv)}
                      </div>
                      {/* Online status - you'd need to track this separately */}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-[#003D5B] truncate">
                          {getConversationName(conv)}
                        </h3>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                          {getLastMessageTime(conv)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {getLastMessage(conv)}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <div className="w-5 h-5 rounded-full bg-[#EDAE49] text-[#003D5B] text-xs font-bold flex items-center justify-center">
                        {unreadCount}
                      </div>
                    )}
                  </button>
                );
              })
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
                    {getAvatarInitials(selectedConversation)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#003D5B]">
                    {getConversationName(selectedConversation)}
                  </h3>
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
                  message={msg.content || msg.text}
                  isMine={msg.sender === 1 || msg.sender === 'me'}
                  timestamp={new Date(msg.created_at || msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  status={msg.status || (msg.is_read ? 'read' : 'delivered')}
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
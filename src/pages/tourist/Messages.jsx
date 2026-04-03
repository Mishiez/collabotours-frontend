import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { fetchConversations, fetchConversation, sendMessage } from '../../services/api';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);

  // Load conversations on page load
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetchConversations();
      console.log('Conversations loaded:', response.data);
      setConversations(response.data);
      
      // Select first conversation if available
      if (response.data.length > 0) {
        handleSelectConversation(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    
    try {
      // Fetch full conversation details with messages
      const response = await fetchConversation(conversation.id);
      console.log('Conversation details:', response.data);
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    setSending(true);
    try {
      const response = await sendMessage(selectedConversation.id, messageInput);
      console.log('Message sent:', response.data);
      
      // Add new message to the list
      setMessages(prev => [...prev, response.data]);
      setMessageInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get the other participant's name (not the current user)
  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants) return 'Unknown';
    const other = conversation.participants.find(p => p.id !== user?.id);
    return other?.username || 'Unknown';
  };

  const getAvatarInitials = (name) => {
    return name.substring(0, 2).toUpperCase();
  };

  const filteredConversations = conversations.filter(conv =>
    getOtherParticipant(conv).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-[#003D5B] mb-3">Stay connected with businesses</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Log in to message tour operators, ask questions, and get quick responses about your bookings.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button variant="outline" onClick={() => navigate('/tourist/register')}>
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

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
              filteredConversations.map((conv) => {
                const otherName = getOtherParticipant(conv);
                const lastMessage = conv.last_message?.content || 'No messages yet';
                const lastMessageTime = conv.last_message?.created_at 
                  ? new Date(conv.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';
                
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                      selectedConversation?.id === conv.id ? 'bg-[#EDAE49]/5' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-[#003D5B] flex items-center justify-center text-white font-bold text-sm">
                        {getAvatarInitials(otherName)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-[#003D5B] truncate">{otherName}</h3>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{lastMessage}</p>
                    </div>
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
                    {getAvatarInitials(getOtherParticipant(selectedConversation))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#003D5B]">{getOtherParticipant(selectedConversation)}</h3>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.sender === user?.id
                        ? 'bg-[#EDAE49] text-[#003D5B] rounded-tr-none'
                        : 'bg-gray-100 text-[#003D5B] rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
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
                  className="p-3 bg-[#EDAE49] text-[#003D5B] rounded-xl hover:bg-[#e5a23e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sending}
                >
                  {sending ? '...' : '➤'}
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
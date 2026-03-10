import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function NewMessageModal({ isOpen, onClose, onStartConversation }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock contacts (customers and partners)
  const contacts = [
    { id: 101, name: 'Michael Okonkwo', role: 'Customer', avatar: 'MO', lastActive: 'Online' },
    { id: 102, name: 'Elizabeth Wanjiku', role: 'Customer', avatar: 'EW', lastActive: '2 hours ago' },
    { id: 103, name: 'Safari Guides Kenya', role: 'Partner', avatar: 'SG', lastActive: 'Online' },
    { id: 104, name: 'Beach Resort Mombasa', role: 'Partner', avatar: 'BR', lastActive: 'Yesterday' },
    { id: 105, name: 'John Mwangi', role: 'Customer', avatar: 'JM', lastActive: 'Online' },
    { id: 106, name: 'Cultural Tours Ltd', role: 'Partner', avatar: 'CT', lastActive: '3 hours ago' },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedContact && message.trim()) {
      onStartConversation({
        contact: selectedContact,
        firstMessage: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Message" size="lg">
      <div className="space-y-4">
        {/* Search contacts */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
          />
        </div>

        {/* Contacts list */}
        <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-xl divide-y">
          {filteredContacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                selectedContact?.id === contact.id ? 'bg-[#EDAE49]/10' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#003D5B] flex items-center justify-center text-white font-bold text-sm">
                {contact.avatar}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-[#003D5B]">{contact.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400">{contact.role}</p>
                  <span className="text-xs text-gray-300">•</span>
                  <p className="text-xs text-emerald-500">{contact.lastActive}</p>
                </div>
              </div>
              {selectedContact?.id === contact.id && (
                <span className="text-[#EDAE49]">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Message input */}
        {selectedContact && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to {selectedContact.name}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              placeholder="Type your message..."
              autoFocus
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!selectedContact || !message.trim()}
          >
            Send Message
          </Button>
        </div>
      </div>
    </Modal>
  );
}
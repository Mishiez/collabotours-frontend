import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

// Mock data for available partners
const availablePartners = [
  {
    id: 4,
    name: 'Mountain Guides Kenya',
    type: 'Adventure Guide',
    location: 'Mount Kenya',
    rating: 4.7,
    services: ['Hiking', 'Camping', 'Mountaineering'],
  },
  {
    id: 5,
    name: 'Coastal Watersports',
    type: 'Water Activities',
    location: 'Diani Beach',
    rating: 4.6,
    services: ['Snorkeling', 'Diving', 'Boat Tours'],
  },
  {
    id: 6,
    name: 'Cultural Experiences Ltd',
    type: 'Cultural Expert',
    location: 'Mombasa',
    rating: 4.9,
    services: ['City Tours', 'Museum Visits', 'Local Crafts'],
  },
];

export default function FindPartnersModal({ isOpen, onClose, onConnect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPartner, setSelectedPartner] = useState(null);

  const types = ['All', 'Tour Guide', 'Accommodation', 'Adventure Guide', 'Water Activities', 'Cultural Expert'];

  const filteredPartners = availablePartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partner.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || partner.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleConnect = (partner) => {
    onConnect(partner);
    setSelectedPartner(null);
    // Show success message or close modal
    alert(`Connection request sent to ${partner.name}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Find Partners" size="xl">
      <div className="space-y-4">
        {/* Search and filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search partners by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500">
          Found <span className="font-semibold text-[#003D5B]">{filteredPartners.length}</span> potential partners
        </p>

        {/* Partners list */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {filteredPartners.map(partner => (
            <div 
              key={partner.id} 
              className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setSelectedPartner(selectedPartner?.id === partner.id ? null : partner)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#003D5B] flex items-center justify-center text-white font-bold text-lg">
                    {partner.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#003D5B]">{partner.name}</h3>
                    <p className="text-xs text-gray-500">{partner.type} • {partner.location}</p>
                    <p className="text-sm text-[#EDAE49] mt-1">★ {partner.rating}</p>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect(partner);
                  }}
                >
                  Connect
                </Button>
              </div>

              {/* Expanded details */}
              {selectedPartner?.id === partner.id && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Services offered:</p>
                  <div className="flex flex-wrap gap-2">
                    {partner.services.map(service => (
                      <span key={service} className="text-xs bg-white text-gray-600 px-2.5 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
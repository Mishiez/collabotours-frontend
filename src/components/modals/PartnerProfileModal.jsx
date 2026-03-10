import Modal from '../common/Modal';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

export default function PartnerProfileModal({ isOpen, onClose, partner }) {
  const navigate = useNavigate();

  if (!partner) return null;

  const handleMessage = () => {
    onClose();
    navigate('/messages');
    // Later you can pass partner ID to open specific conversation
    // navigate(`/messages?partner=${partner.id}`);
  };

  const handleStartCollaboration = () => {
    // This would open a collaboration request modal
    console.log('Start collaboration with:', partner.name);
    alert(`Collaboration request sent to ${partner.name}`);
    onClose();
  };

  // Sample past collaborations
  const pastCollaborations = [
    { id: 1, name: 'Joint Safari Package', date: 'Jan 2026', revenue: '$1,200' },
    { id: 2, name: 'Hotel Guest Transport', date: 'Dec 2025', revenue: '$850' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Partner Profile" size="lg">
      <div className="space-y-6">
        {/* Header with avatar and basic info */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#003D5B] flex items-center justify-center text-white font-bold text-xl">
            {partner.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#003D5B]">{partner.name}</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                partner.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EDAE49]/20 text-[#b87a00]'
              }`}>
                {partner.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">{partner.type}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-[#EDAE49]">★ {partner.rating}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">{partner.location}</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-400">Collaborations</p>
            <p className="text-xl font-bold text-[#003D5B]">{partner.collaborations}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-400">Success Rate</p>
            <p className="text-xl font-bold text-[#EDAE49]">100%</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-400">Last Active</p>
            <p className="text-sm font-bold text-[#30638E]">{partner.lastActive}</p>
          </div>
        </div>

        {/* About section */}
        <div>
          <h3 className="font-semibold text-[#003D5B] mb-2">About</h3>
          <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
            {partner.name} is a leading {partner.type.toLowerCase()} provider in {partner.location}. 
            They specialize in creating memorable experiences for tourists and have a proven track record 
            of successful collaborations.
          </p>
        </div>

        {/* Services offered */}
        <div>
          <h3 className="font-semibold text-[#003D5B] mb-2">Services Offered</h3>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">Guided Tours</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">Transportation</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">Accommodation</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">Cultural Experiences</span>
          </div>
        </div>

        {/* Past collaborations */}
        <div>
          <h3 className="font-semibold text-[#003D5B] mb-2">Past Collaborations</h3>
          <div className="space-y-2">
            {pastCollaborations.map(collab => (
              <div key={collab.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-[#003D5B]">{collab.name}</p>
                  <p className="text-xs text-gray-400">{collab.date}</p>
                </div>
                <p className="text-sm font-bold text-[#EDAE49]">{collab.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="md" 
            className="flex-1"
            onClick={handleMessage}
          >
            💬 Message
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            className="flex-1"
            onClick={handleStartCollaboration}
          >
            🤝 Start Collaboration
          </Button>
        </div>
      </div>
    </Modal>
  );
}
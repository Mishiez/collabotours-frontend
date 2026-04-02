import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import PartnerProfileModal from '../../components/modals/PartnerProfileModal';
import FindPartnersModal from '../../components/modals/FindPartnersModal';
import ApplyForOpportunityModal from '../../components/modals/ApplyForOpportunityModal';
import { 
  fetchCollaborators, 
  getCollaborationSettings, 
  updateCollaborationSettings,
  getOpenCollaborationBusinesses 
} from '../../services/api';

export default function Collaboration() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('partners');
  
  // State for data
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openBusinesses, setOpenBusinesses] = useState([]);
  const [openBusinessesLoading, setOpenBusinessesLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  
  // Collaboration settings
  const [isOpenForCollaboration, setIsOpenForCollaboration] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  
  // Modal states
  const [isFindPartnersOpen, setIsFindPartnersOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Fetch collaborators from backend
  useEffect(() => {
    loadCollaborators();
    loadCollaborationSettings();
  }, []);

  // Fetch open businesses when opportunities tab is active
  useEffect(() => {
    if (activeTab === 'opportunities') {
      loadOpenBusinesses();
    }
  }, [activeTab]);

  const loadCollaborators = async () => {
    try {
      setLoading(true);
      const response = await fetchCollaborators();
      console.log('Collaborators loaded:', response.data);
      setCollaborators(response.data);
    } catch (err) {
      console.error('Failed to load collaborators:', err);
      setError('Could not load partners');
    } finally {
      setLoading(false);
    }
  };

  const loadCollaborationSettings = async () => {
    try {
      const response = await getCollaborationSettings();
      setIsOpenForCollaboration(response.data.is_open_for_collaboration);
    } catch (err) {
      console.error('Failed to load collaboration settings:', err);
    }
  };

  const loadOpenBusinesses = async () => {
    try {
      setOpenBusinessesLoading(true);
      const response = await getOpenCollaborationBusinesses();
      console.log('Open businesses loaded:', response.data);
      setOpenBusinesses(response.data);
    } catch (err) {
      console.error('Failed to load open businesses:', err);
    } finally {
      setOpenBusinessesLoading(false);
    }
  };

  const handleToggleCollaboration = async () => {
    try {
      setSettingsLoading(true);
      const newStatus = !isOpenForCollaboration;
      await updateCollaborationSettings(newStatus);
      setIsOpenForCollaboration(newStatus);
      alert(`You are now ${newStatus ? 'open' : 'closed'} for collaboration`);
    } catch (err) {
      console.error('Failed to update collaboration settings:', err);
      alert('Failed to update status');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Handlers
  const handleViewProfile = (partner) => {
    setSelectedPartner(partner);
    setIsProfileModalOpen(true);
  };

  const handleMessage = (partner) => {
    navigate('/messages');
  };

  const handleApplyNow = (business) => {
    // Create an opportunity object from the business data
    const opportunity = {
      id: business.id,
      title: `Collaborate with ${business.username}`,
      partner: business.username,
      description: `${business.username} is open for collaboration. Send a message to discuss partnership opportunities.`,
      budget: 'Negotiable',
      deadline: 'Open',
      business: business
    };
    setSelectedOpportunity(opportunity);
    setIsApplyModalOpen(true);
  };

  const handleApplicationSubmit = (application) => {
    console.log('Application submitted:', application);
    alert('Collaboration request sent successfully!');
  };

  const handleConnectWithPartner = (partner) => {
    console.log('Connecting with partner:', partner);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00798C] mb-1">
            Partnerships
          </p>
          <h1 className="text-3xl font-bold text-[#003D5B]">Collaboration</h1>
          <p className="text-gray-400 text-sm mt-1">Connect with other tour operators and partners</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Collaboration Toggle */}
          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-2">
            <span className="text-sm text-gray-600">🤝 Open for collaboration</span>
            <button
              onClick={handleToggleCollaboration}
              disabled={settingsLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isOpenForCollaboration ? 'bg-[#EDAE49]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isOpenForCollaboration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <Button 
            variant="primary" 
            size="md" 
            icon="🤝"
            onClick={() => setIsFindPartnersOpen(true)}
          >
            Find Partners
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {['partners', 'opportunities', 'requests'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-all relative ${
              activeTab === tab
                ? 'text-[#003D5B]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {tab === 'requests' && requests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D1495B] text-white text-xs rounded-full flex items-center justify-center">
                {requests.length}
              </span>
            )}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EDAE49]" />
            )}
          </button>
        ))}
      </div>

      {/* Partners Tab */}
      {activeTab === 'partners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {collaborators.map((partner) => (
            <div 
              key={partner.id} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleViewProfile(partner)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#003D5B]/10 flex items-center justify-center text-[#003D5B] font-bold text-lg">
                    {partner.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#003D5B]">{partner.name}</h3>
                    <p className="text-xs text-gray-400">{partner.type}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  partner.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EDAE49]/20 text-[#b87a00]'
                }`}>
                  {partner.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="font-medium text-[#003D5B]">{partner.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Rating</p>
                  <p className="font-medium text-[#EDAE49]">★ {partner.rating}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Collaborations</p>
                  <p className="font-medium text-[#003D5B]">{partner.collaborations}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Last Active</p>
                  <p className="font-medium text-[#003D5B]">{partner.lastActive}</p>
                </div>
              </div>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleMessage(partner)}
                >
                  Message
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewProfile(partner)}
                >
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunities Tab - Now with REAL data */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          {openBusinessesLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading opportunities...</p>
            </div>
          ) : openBusinesses.length > 0 ? (
            openBusinesses.map((business) => (
              <div 
                key={business.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedOpportunity({
                  id: business.id,
                  title: `Collaborate with ${business.username}`,
                  partner: business.username,
                  description: `${business.username} is open for collaboration. Send a message to discuss partnership opportunities.`,
                  budget: 'Negotiable',
                  deadline: 'Open',
                  business: business
                })}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-[#003D5B] text-lg">{business.username}</h3>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                        Open for Collaboration
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {business.first_name} {business.last_name}
                    </p>
                    <p className="text-xs text-gray-400">{business.email}</p>
                  </div>
                  <div className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleApplyNow(business)}
                    >
                      Send Collaboration Request
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-[#003D5B] mb-2">No businesses open for collaboration</h3>
              <p className="text-gray-400">Toggle "Open for collaboration" above to appear here for others</p>
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-[#003D5B] mb-2">No collaboration requests</h3>
          <p className="text-gray-400">When partners reach out, you'll see their requests here</p>
        </div>
      )}

      {/* Modals */}
      <PartnerProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
      />

      <FindPartnersModal 
        isOpen={isFindPartnersOpen}
        onClose={() => setIsFindPartnersOpen(false)}
        onConnect={handleConnectWithPartner}
      />

      <ApplyForOpportunityModal 
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setSelectedOpportunity(null);
        }}
        opportunity={selectedOpportunity}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
}
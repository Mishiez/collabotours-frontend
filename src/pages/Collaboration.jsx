// // Collaboration.jsx
// export default function Collaboration() {
//   return <div className="p-8"><h1 className="text-2xl font-bold text-[#003D5B]">Collaboration</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>;
// }

import { useState } from 'react';
import Button from '../components/common/Button';

const collaborators = [
  {
    id: 1,
    name: 'Savannah Guides Ltd',
    type: 'Tour Guide',
    location: 'Nairobi',
    rating: 4.8,
    collaborations: 12,
    status: 'active',
    lastActive: '2 days ago',
  },
  {
    id: 2,
    name: 'Beach Paradise Hotels',
    type: 'Accommodation',
    location: 'Mombasa',
    rating: 4.5,
    collaborations: 8,
    status: 'pending',
    lastActive: '1 week ago',
  },
  {
    id: 3,
    name: 'Cultural Heritage Tours',
    type: 'Cultural Expert',
    location: 'Lamu',
    rating: 4.9,
    collaborations: 5,
    status: 'active',
    lastActive: 'Yesterday',
  },
];

const opportunities = [
  {
    id: 1,
    title: 'Luxury Safari Partnership',
    partner: 'Elite Travel Agency',
    description: 'Looking for exclusive safari experiences for high-end clients',
    budget: '$$$',
    deadline: 'Mar 15, 2026',
  },
  {
    id: 2,
    title: 'Beach Wedding Packages',
    partner: 'Tropical Resorts',
    description: 'Need beach activity providers for wedding guests',
    budget: '$$',
    deadline: 'Mar 20, 2026',
  },
];

export default function Collaboration() {
  const [activeTab, setActiveTab] = useState('partners');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00798C] mb-1">
            Partnerships
          </p>
          <h1 className="text-3xl font-bold text-[#003D5B]">Collaboration</h1>
          <p className="text-gray-400 text-sm mt-1">Connect with other tour operators and partners</p>
        </div>
        <Button variant="primary" size="md" icon="🤝">Find Partners</Button>
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
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EDAE49]" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'partners' && (
        <>
          {/* Active Partners */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {collaborators.map((partner) => (
              <div key={partner.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
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

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Message</Button>
                  <Button variant="primary" size="sm" className="flex-1">View Profile</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div key={opp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-[#003D5B] text-lg">{opp.title}</h3>
                    <span className="text-xs bg-[#00798C]/10 text-[#00798C] px-2.5 py-1 rounded-full">
                      {opp.budget}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Partner: {opp.partner}</p>
                  <p className="text-xs text-gray-400">{opp.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-2">Deadline: {opp.deadline}</p>
                  <Button variant="primary" size="sm">Apply Now</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-[#003D5B] mb-2">No collaboration requests</h3>
          <p className="text-gray-400">When partners reach out, you'll see their requests here</p>
        </div>
      )}
    </div>
  );
}
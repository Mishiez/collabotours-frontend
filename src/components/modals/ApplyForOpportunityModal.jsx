import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function ApplyForOpportunityModal({ isOpen, onClose, opportunity, onSubmit }) {
  const [formData, setFormData] = useState({
    message: '',
    services: [],
    proposedRate: '',
    availability: '',
  });

  const [selectedServices, setSelectedServices] = useState([]);

  // Mock user's services
  const myServices = [
    'Safari Day Tour',
    'Beach Getaway Package',
    'Cultural City Walk',
    'Sunset Cruise',
  ];

  if (!opportunity) return null;

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const application = {
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      partner: opportunity.partner,
      message: formData.message,
      services: selectedServices,
      proposedRate: formData.proposedRate,
      availability: formData.availability,
      appliedDate: new Date().toLocaleDateString(),
    };

    onSubmit(application);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Opportunity" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Opportunity summary */}
        <div className="bg-gradient-to-r from-[#003D5B] to-[#30638E] text-white p-4 rounded-xl">
          <h3 className="font-bold">{opportunity.title}</h3>
          <p className="text-sm text-white/80">Partner: {opportunity.partner}</p>
          <p className="text-xs text-white/60 mt-1">Deadline: {opportunity.deadline}</p>
        </div>

        {/* Cover message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Message
          </label>
          <textarea
            required
            rows="4"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
            placeholder="Introduce yourself and explain why you're interested in this collaboration..."
          />
        </div>

        {/* Services to offer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Services to Offer
          </label>
          <div className="border border-gray-200 rounded-xl p-3">
            {myServices.map(service => (
              <label key={service} className="flex items-center gap-2 py-1.5 hover:bg-gray-50 px-2 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="rounded border-gray-300 text-[#EDAE49] focus:ring-[#EDAE49]"
                />
                <span className="text-sm text-gray-700">{service}</span>
              </label>
            ))}
          </div>
          {selectedServices.length === 0 && (
            <p className="text-xs text-[#D1495B] mt-1">Select at least one service</p>
          )}
        </div>

        {/* Proposed rate and availability */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposed Rate ($)
            </label>
            <input
              type="text"
              required
              value={formData.proposedRate}
              onChange={(e) => setFormData({...formData, proposedRate: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              placeholder="e.g., 500/day"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <input
              type="text"
              required
              value={formData.availability}
              onChange={(e) => setFormData({...formData, availability: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              placeholder="e.g., Weekends, Flexible"
            />
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={selectedServices.length === 0}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}
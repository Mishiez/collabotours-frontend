import Modal from '../common/Modal';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

export default function ContactInfoModal({ isOpen, onClose, contact }) {
  const navigate = useNavigate();

  if (!contact) return null;

  // Mock contact details based on role
  const contactDetails = {
    Customer: {
      email: `${contact.name.toLowerCase().replace(' ', '.')}@email.com`,
      phone: '+254 712 345 678',
      totalBookings: 3,
      totalSpent: '$1,240',
      memberSince: 'Jan 2025',
    },
    Partner: {
      email: 'info@' + contact.name.toLowerCase().replace(' ', '').replace('ltd', '') + '.com',
      phone: '+254 720 987 654',
      website: 'www.' + contact.name.toLowerCase().replace(' ', '').replace('ltd', '') + '.com',
      collaborations: 5,
      partnerSince: 'Mar 2025',
    }
  };

  const details = contact.role === 'Partner' ? contactDetails.Partner : contactDetails.Customer;

  const handleViewProfile = () => {
    onClose();
    if (contact.role === 'Partner') {
      navigate('/collaboration');
    } else {
      // Navigate to customer profile (if you have that page)
      console.log('View customer profile');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Information" size="md">
      <div className="space-y-6">
        {/* Header with avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#003D5B] flex items-center justify-center text-white font-bold text-xl">
            {contact.avatar}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#003D5B]">{contact.name}</h2>
            <p className="text-sm text-gray-500">{contact.role}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className={`w-2 h-2 rounded-full ${contact.online ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
              <span className="text-xs text-gray-400">{contact.online ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Contact details */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div>
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm font-medium text-[#003D5B]">{details.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Phone</p>
            <p className="text-sm font-medium text-[#003D5B]">{details.phone}</p>
          </div>
          {contact.role === 'Partner' && (
            <div>
              <p className="text-xs text-gray-400">Website</p>
              <p className="text-sm font-medium text-[#00798C]">{details.website}</p>
            </div>
          )}
        </div>

        {/* Additional info */}
        <div className="grid grid-cols-2 gap-3">
          {contact.role === 'Customer' ? (
            <>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs text-gray-400">Total Bookings</p>
                <p className="text-lg font-bold text-[#003D5B]">{details.totalBookings}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs text-gray-400">Total Spent</p>
                <p className="text-lg font-bold text-[#EDAE49]">{details.totalSpent}</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs text-gray-400">Collaborations</p>
                <p className="text-lg font-bold text-[#003D5B]">{details.collaborations}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs text-gray-400">Partner Since</p>
                <p className="text-lg font-bold text-[#30638E]">{details.partnerSince}</p>
              </div>
            </>
          )}
        </div>

        {/* Member since */}
        <div className="text-center text-xs text-gray-400">
          Member since {details.memberSince || details.partnerSince}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" size="md" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="md" className="flex-1" onClick={handleViewProfile}>
            View {contact.role === 'Partner' ? 'Partner Profile' : 'Customer History'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
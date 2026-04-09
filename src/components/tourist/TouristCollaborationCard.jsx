import Button from '../common/Button';
import VerifiedBadge from '../common/VerifiedBadge';  // ADD THIS IMPORT

export default function TouristCollaborationCard({ 
  id, 
  name, 
  type, 
  location, 
  rating, 
  status,
  business_name,
  partner_name,
  business_is_verified = false,
  partner_is_verified = false,
  onViewDetails 
}) {

  // At least one partner verified
  const isVerified = business_is_verified || partner_is_verified;
  
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetails && onViewDetails()}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#003D5B] to-[#30638E] p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#EDAE49] text-[#003D5B] px-2 py-1 rounded-full font-semibold">
              🤝 Partnership
            </span>
            <VerifiedBadge isVerified={isVerified} size="sm" />
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            status === 'active' 
              ? 'bg-emerald-500/20 text-emerald-300' 
              : 'bg-gray-500/20 text-gray-300'
          }`}>
            {status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-[#003D5B] text-lg mb-2">{name}</h3>
        
        <p className="text-sm text-gray-500 mb-2">{type} • {location}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="text-sm font-medium text-[#003D5B]">{rating || 'New'}</span>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-400">Partner businesses</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              {business_name}
              {business_is_verified && <span className="text-emerald-500 text-xs">✅</span>}
            </span>
            <span className="text-gray-300">+</span>
            <span className="text-sm text-gray-600 flex items-center gap-1">
              {partner_name}
              {partner_is_verified && <span className="text-emerald-500 text-xs">✅</span>}
            </span>
          </div>
        </div>

        <Button 
          variant="primary" 
          size="sm" 
          className="w-full justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails && onViewDetails();
          }}
        >
          View Partnership
        </Button>
      </div>
    </div>
  );
}
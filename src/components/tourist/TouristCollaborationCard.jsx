import Button from '../common/Button';

export default function TouristCollaborationCard({ 
  id, 
  name, 
  type, 
  location, 
  rating, 
  status,
  business_name,
  partner_name,
  onViewDetails 
}) {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetails && onViewDetails()}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#003D5B] to-[#30638E] p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs bg-[#EDAE49] text-[#003D5B] px-2 py-1 rounded-full font-semibold">
              🤝 Partnership
            </span>
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
          <p className="text-sm text-gray-600">
            {business_name} & {partner_name}
          </p>
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
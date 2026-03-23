import Button from '../common/Button';

export default function TouristServiceCard({ 
  id, 
  name, 
  category, 
  price, 
  image, 
  business, 
  rating, 
  duration, 
  location,
  onViewDetails 
}) {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={() => onViewDetails && onViewDetails()}
    >
      {/* Image area */}
      <div className="relative h-40 bg-gradient-to-br from-[#003D5B] to-[#30638E] overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">🏝️</div>
        )}
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-yellow-500 text-xs">★</span>
            <span className="text-xs font-semibold text-[#003D5B]">{rating || '4.9'}</span>
          </div>
        </div>

        {/* Business name badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-xs text-white">by {business || 'Local Business'}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-[#00798C] font-semibold uppercase tracking-wider">{category}</p>
          <p className="text-xs text-gray-400">{duration || 'Full day'}</p>
        </div>
        <h3 className="font-bold text-[#003D5B] text-lg mb-2 leading-tight">{name}</h3>
        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
          <span>📍</span> {location || 'Nairobi, Kenya'}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400">Price per person</p>
            <p className="text-2xl font-bold text-[#EDAE49]">${price}</p>
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
          View Details
        </Button>
      </div>
    </div>
  );
}
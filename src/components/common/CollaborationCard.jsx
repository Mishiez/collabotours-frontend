import Button from './Button';

export default function CollaborationCard({ id, name, businesses, price, originalPrice, description, rating, discount }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#003D5B] to-[#30638E] p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs bg-[#EDAE49] text-[#003D5B] px-2 py-1 rounded-full font-semibold">
              🤝 Partnered Experience
            </span>
          </div>
          {discount && (
            <span className="text-xs font-bold bg-white/20 text-white px-2 py-1 rounded-full">
              Save {discount}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-[#003D5B] text-lg mb-2">{name}</h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {businesses.map((business, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {business}
            </span>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-[#EDAE49]">${price}</p>
              {originalPrice && (
                <p className="text-sm text-gray-400 line-through">${originalPrice}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500 text-sm">★</span>
            <span className="text-sm font-medium text-[#003D5B]">{rating}</span>
          </div>
        </div>

        <Button 
          variant="primary" 
          size="sm" 
          className="w-full justify-center"
        >
          View Deal
        </Button>
      </div>
    </div>
  );
}
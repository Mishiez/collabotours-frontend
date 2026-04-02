import Button from './Button';

export default function PackageCard({ id, name, price, originalPrice, duration, services, business, rating, discount, image }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
      {/* Image area */}
      <div className="relative h-40 bg-gradient-to-br from-[#003D5B] to-[#30638E] overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">📦</div>
        )}
        {discount && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-bold bg-[#EDAE49] text-[#003D5B] px-2 py-1 rounded-full">
              Save {discount}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-yellow-500 text-xs">★</span>
            <span className="text-xs font-semibold text-[#003D5B]">{rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-[#00798C] font-semibold uppercase tracking-wider">{duration}</p>
          <p className="text-xs text-gray-400">{services} {services === 1 ? 'service' : 'services'}</p>
        </div>
        <h3 className="font-bold text-[#003D5B] text-lg mb-1 leading-tight">{name}</h3>
        <p className="text-xs text-gray-400 mb-3">by {business}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-[#EDAE49]">Ksh {price}</p>
              {originalPrice && (
                <p className="text-sm text-gray-400 line-through">Ksh {originalPrice}</p>
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
          View Package
        </Button>
      </div>
    </div>
  );
}
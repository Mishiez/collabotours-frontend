import Button from './Button';

export default function ServiceCard({ id, name, category, price, bookings, status, image, onManage }) {
  const statusStyles = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-gray-100 text-gray-500',
    pending: 'bg-[#EDAE49]/20 text-[#b87a00]',
  };

  const handleManageClick = () => {
    if (onManage) {
      onManage();
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Image area */}
      <div className="relative h-40 bg-gradient-to-br from-[#003D5B] to-[#30638E] overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🏝️</div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[status] || statusStyles.active}`}>
            {status || 'Active'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-[#00798C] font-semibold uppercase tracking-wider mb-1">{category}</p>
        <h3 className="font-bold text-[#003D5B] text-base mb-3 leading-tight">{name}</h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400">From</p>
            <p className="text-lg font-bold text-[#EDAE49]">Ksh {price}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Bookings</p>
            <p className="text-lg font-bold text-[#30638E]">{bookings}</p>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-center"
          onClick={handleManageClick}
        >
          Manage Service
        </Button>
      </div>
    </div>
  );
}
export default function StatCard({ title, value, change, changeType = 'up', icon, accent = '#EDAE49' }) {
  const isPositive = changeType === 'up';

  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-300">
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
        style={{ backgroundColor: accent }}
      />

      {/* Background glow */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{ backgroundColor: accent }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#003D5B] mt-1">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-[#D1495B]'}`}>
              <span>{isPositive ? '↑' : '↓'}</span>
              <span>{change} this month</span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${accent}20`, color: accent }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '⊞' },
  { label: 'My Services', path: '/services', icon: '🧩' },
  { label: 'Packages', path: '/packages', icon: '📦' },
  { label: 'Collaboration', path: '/collaboration', icon: '🤝' },
  { label: 'Bookings', path: '/bookings', icon: '📅' },
  { label: 'Messages', path: '/messages', icon: '💬' },
  { label: 'Payments', path: '/payments', icon: '💳' },
];


export default function Sidebar() {
// Add this at the top of your Sidebar component
useEffect(() => {
    console.log('Sidebar mounted');
    
    // This will show you what's causing the renders
    console.trace('Sidebar render trace');
    
    return () => console.log('Sidebar unmounted');
  }, []);

  const instanceId = Math.random().toString(36).slice(2, 8); // random short ID
  console.log(`Sidebar rendered — instance: ${instanceId} — time: ${new Date().toLocaleTimeString()}`);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        h-screen sticky top-0 flex flex-col
        bg-[#003D5B] transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EDAE49] flex items-center justify-center text-[#003D5B] font-black text-sm">T</div>
            <span className="text-white font-bold text-lg tracking-tight">TouriBiz</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-[#EDAE49] flex items-center justify-center text-[#003D5B] font-black text-sm mx-auto">T</div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            ◀
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="text-white/40 hover:text-white transition-colors py-3 flex justify-center border-b border-white/10"
        >
          ▶
        </button>
      )}

      {/* Nav items */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
              ${isActive
                ? 'bg-[#EDAE49] text-[#003D5B]'
                : 'text-white/60 hover:text-white hover:bg-white/10'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            {({ isActive }) => (
              <>
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                )}
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#003D5B] border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User profile at bottom */}
      <div className={`px-4 py-5 border-t border-white/10 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-[#30638E] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          JD
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white text-sm font-semibold truncate">Jane Doe</p>
            <p className="text-white/40 text-xs truncate">Business Owner</p>
          </div>
        )}
      </div>
    </aside>
  );
}
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Home', path: '/tourist/home', icon: '🏠' },
  { label: 'Explore', path: '/tourist/services', icon: '🔍' },
  { label: 'Packages', path: '/tourist/packages', icon: '📦' },
  { label: 'Collaborations', path: '/tourist/collaborations', icon: '🤝' },
  { label: 'My Trips', path: '/tourist/bookings', icon: '✈️' },
  { label: 'Messages', path: '/tourist/messages', icon: '💬' },
];

export default function TouristSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user) return '👤';
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return '👤';
  };

  const getDisplayName = () => {
    if (!user) return 'Guest';
    return user.username || 'Traveler';
  };

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
            <span className="text-white font-bold text-lg tracking-tight">CollaboTours</span>
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
          {getUserInitials()}
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <p className="text-white text-sm font-semibold truncate">{getDisplayName()}</p>
            <p className="text-white/40 text-xs truncate">Traveler</p>
          </div>
        )}
        {/* Logout button - only show when expanded */}
        {!collapsed && user && (
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-white transition-colors p-1"
            title="Logout"
          >
            🚪
          </button>
        )}
      </div>

      {/* Logout button when collapsed and user logged in */}
      {collapsed && user && (
        <div className="px-4 py-3 border-t border-white/10 flex justify-center">
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-white transition-colors p-2"
            title="Logout"
          >
            🚪
          </button>
        </div>
      )}

      {/* Login button when not logged in */}
      {!user && (
        <div className={`px-4 py-5 border-t border-white/10 ${collapsed ? 'flex justify-center' : ''}`}>
          <NavLink
            to="/login"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200
              ${!collapsed ? 'w-full' : 'justify-center'}
              ${isActive
                ? 'bg-[#EDAE49] text-[#003D5B]'
                : 'text-white/60 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <span className="text-lg">🔑</span>
            {!collapsed && <span className="text-sm font-medium">Login</span>}
          </NavLink>
        </div>
      )}
    </aside>
  );
}
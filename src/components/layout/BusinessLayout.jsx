import { Outlet, useNavigate } from 'react-router-dom';  // ADD useNavigate
import { useAuth } from '../../context/AuthContext';  // ADD THIS
import Sidebar from './Sidebar';

export default function BusinessLayout() {
  const { user, logout } = useAuth();  // ADD THIS
  const navigate = useNavigate();  // ADD THIS

  const handleLogout = () => {  // ADD THIS
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen bg-[#F7F8FA] overflow-hidden">
      <Sidebar user={user} onLogout={handleLogout} />  {/* MODIFY THIS - pass props */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
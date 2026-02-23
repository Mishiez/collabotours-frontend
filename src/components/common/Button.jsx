import { Outlet } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';

export default function BusinessLayout() {
  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
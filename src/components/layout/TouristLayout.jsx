import { Outlet } from 'react-router-dom';
import TouristSidebar from './TouristSidebar';

export default function TouristLayout() {
  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
      <TouristSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
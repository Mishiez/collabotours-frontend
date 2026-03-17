import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BusinessLayout from './components/layout/BusinessLayout';
import Login from './pages/Login';  // ADD THIS
import Dashboard from './pages/Dashboard';
import MyServices from './pages/MyServices';
import Packages from './pages/Packages';
import Collaboration from './pages/Collaboration';
import Bookings from './pages/Bookings';
import Messages from './pages/Messages';
import Payments from './pages/Payments';

export default function App() {
  return (
    <AuthProvider>  {/* ADD THIS */}
      <Routes>
        {/* Public route - no protection */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/" element={
          <ProtectedRoute>
            <BusinessLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<MyServices />} />
          <Route path="packages" element={<Packages />} />
          <Route path="collaboration" element={<Collaboration />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
        </Route>
      </Routes>
    </AuthProvider> 
  );
}
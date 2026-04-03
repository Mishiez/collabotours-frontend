import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BusinessLayout from './components/layout/BusinessLayout';
import TouristLayout from './components/layout/TouristLayout';
import Login from './pages/Login';
import Register from './pages/business/Register';  // ADD THIS IMPORT
import TouristRegister from './pages/tourist/Register';

// Business pages
import Dashboard from './pages/business/Dashboard';
import MyServices from './pages/business/MyServices';
import Packages from './pages/business/Packages';
import Collaboration from './pages/business/Collaboration';
import Bookings from './pages/business/Bookings';
import Messages from './pages/business/Messages';
import Payments from './pages/business/Payments';

// Tourist pages
import Home from './pages/tourist/Home';
import Services from './pages/tourist/Services';
import TouristPackages from './pages/tourist/Packages';
import TouristBookings from './pages/tourist/Bookings';
import TouristMessages from './pages/tourist/Messages';
import Checkout from './pages/tourist/Checkout';
import TouristCollaborations from './pages/tourist/Collaborations';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes - no authentication needed */}
        <Route path="/login" element={<Login />} />
        <Route path="/business/register" element={<Register />} />
        <Route path="/tourist/register" element={<TouristRegister />} />

        {/* Tourist routes - with TouristLayout */}
        <Route element={<TouristLayout />}>
          <Route path="/" element={<Navigate to="/tourist/home" replace />} />
          <Route path="/tourist/home" element={<Home />} />
          <Route path="/tourist/services" element={<Services />} />
          <Route path="/tourist/packages" element={<TouristPackages />} />
          <Route path="/tourist/bookings" element={<TouristBookings />} />
          <Route path="/tourist/messages" element={<TouristMessages />} />
          <Route path="/tourist/checkout" element={<Checkout />} />
          <Route path="/tourist/collaborations" element={<TouristCollaborations />} />
        </Route>
        
        {/* Business routes - require authentication */}
        <Route path="/business" element={
          <ProtectedRoute>
            <BusinessLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
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
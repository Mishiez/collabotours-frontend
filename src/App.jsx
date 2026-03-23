import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BusinessLayout from './components/layout/BusinessLayout';
import TouristLayout from './components/layout/TouristLayout';  // ADD THIS
import Login from './pages/Login';

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
import TouristPackages from './pages/tourist/Packages';    // ADD
import TouristBookings from './pages/tourist/Bookings';    // ADD
import TouristMessages from './pages/tourist/Messages';    // ADD
import Checkout from './pages/tourist/Checkout';   
import TouristCollaborations from './pages/tourist/Collaborations';  // ADD


export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes - no authentication needed */}
        <Route path="/login" element={<Login />} />
        
        {/* Tourist routes - with TouristLayout */}
        <Route element={<TouristLayout />}>
          <Route path="/" element={<Navigate to="/tourist/home" replace />} />
          <Route path="/tourist/home" element={<Home />} />
          <Route path="/tourist/services" element={<Services />} />
          <Route path="/tourist/packages" element={<TouristPackages />} />        // ADD
          <Route path="/tourist/bookings" element={<TouristBookings />} />        // ADD
          <Route path="/tourist/messages" element={<TouristMessages />} />        // ADD
          <Route path="/tourist/checkout/:id" element={<Checkout />} />           // ADD
          <Route path="/tourist/collaborations" element={<TouristCollaborations />} />  // ADD
          {/* Add more tourist routes here */}
        </Route>
        
        {/* Business routes - require authentication */}
        <Route path="/business" element={
          <ProtectedRoute>
            <BusinessLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/business/dashboard" replace />} />
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
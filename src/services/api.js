import axios from 'axios';

// Create a configured axios instance
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',  // Your Django backend URL
  timeout: 5000,  // Wait 5 seconds max
});


// =============== ADD THESE INTERCEPTORS ===============

// Request interceptor - adds token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles token expiration
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('http://127.0.0.1:8000/api/login/refresh/', {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        localStorage.setItem('token', access);
        
        // Update the failed request with new token and retry
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return API(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);


// =============== Service API calls ================
export const fetchServices = () => API.get('services/');
export const fetchService = (id) => API.get(`services/${id}/`);
export const createService = (serviceData) => API.post('services/', serviceData);
export const updateService = (id, serviceData) => API.put(`services/${id}/`, serviceData);
export const deleteService = (id) => API.delete(`services/${id}/`);


// ============ PACKAGES API CALLS ============

// Get all packages
export const fetchPackages = () => API.get('packages/');

// Get a single package
export const fetchPackage = (id) => API.get(`packages/${id}/`);

// Create a new package
export const createPackage = (packageData) => API.post('packages/', packageData);

// Update a package
export const updatePackage = (id, packageData) => API.put(`packages/${id}/`, packageData);

// Delete a package
export const deletePackage = (id) => API.delete(`packages/${id}/`);


// ============ COLLABORATIONS API CALLS ============

// Get all collaborators (your partners)
export const fetchCollaborators = () => API.get('collaborators/');

// Get a single collaborator
export const fetchCollaborator = (id) => API.get(`collaborators/${id}/`);

// Create a new collaboration
export const createCollaborator = (data) => API.post('collaborators/', data);

// Update a collaboration
export const updateCollaborator = (id, data) => API.put(`collaborators/${id}/`, data);

// Delete a collaboration
export const deleteCollaborator = (id) => API.delete(`collaborators/${id}/`);


// ============ BOOKINGS API CALLS ============

// Get all bookings
export const fetchBookings = () => API.get('bookings/');

// Get a single booking
export const fetchBooking = (id) => API.get(`bookings/${id}/`);

// Create a new booking
export const createBooking = (bookingData) => API.post('bookings/', bookingData);

// Update a booking
export const updateBooking = (id, bookingData) => API.put(`bookings/${id}/`, bookingData);

// Update booking status only
export const updateBookingStatus = (id, status) => 
  API.patch(`bookings/${id}/update_status/`, { status });

// Delete a booking
export const deleteBooking = (id) => API.delete(`bookings/${id}/`);


// ============ MESSAGES API CALLS ============

// Get all conversations
export const fetchConversations = () => API.get('conversations/');

// Get a single conversation with its messages
export const fetchConversation = (id) => API.get(`conversations/${id}/`);

// Create a new conversation
export const createConversation = (participantIds) => 
  API.post('conversations/', { participants: participantIds });

// Send a message in a conversation
export const sendMessage = (conversationId, content) => 
  API.post(`conversations/${conversationId}/send_message/`, { content });

// Mark message as read
export const markMessageAsRead = (messageId) => 
  API.patch(`messages/${messageId}/`, { is_read: true });

// Get all messages (if needed)
export const fetchMessages = () => API.get('messages/');

// ============ PAYMENTS API CALLS ============

// Get all payments
export const fetchPayments = () => API.get('payments/');

// Get a single payment
export const fetchPayment = (id) => API.get(`payments/${id}/`);

// Create a new payment
export const createPayment = (paymentData) => API.post('payments/', paymentData);

// Update a payment
export const updatePayment = (id, paymentData) => API.put(`payments/${id}/`, paymentData);

// Process a refund
export const refundPayment = (id) => API.post(`payments/${id}/refund/`);

// Delete a payment
export const deletePayment = (id) => API.delete(`payments/${id}/`);


// ============ DASHBOARD API CALLS ============
export const fetchDashboardStats = () => API.get('dashboard/stats/');
export const fetchRecentBookings = () => API.get('bookings/?ordering=-created_at&limit=5');
export const fetchTopServices = () => API.get('services/?ordering=-bookings_count&limit=3');

// ============ REVENUE API CALLS ============
export const fetchRevenueBreakdown = () => API.get('dashboard/revenue/');


// ============ PUBLIC TOURIST ENDPOINTS ============
// These don't require authentication

export const fetchPublicServices = () => API.get('public/services/');
export const fetchPublicPackages = () => API.get('public/packages/');
export const fetchPublicCollaborations = () => API.get('public/collaborations/');

// ============ M-PESA PAYMENT API CALLS ============

export const initiateMpesaPayment = (paymentData) => API.post('mpesa/stkpush/', paymentData);
// You can add more API calls here later
// export const fetchBookings = () => API.get('bookings/');
// etc.

export default API;
import axios from 'axios';

// Create a configured axios instance
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',  // Your Django backend URL
  timeout: 5000,  // Wait 5 seconds max
});

// Service API calls
export const fetchServices = () => API.get('services/');
export const fetchService = (id) => API.get(`services/${id}/`);
export const createService = (serviceData) => API.post('services/', serviceData);
export const updateService = (id, serviceData) => API.put(`services/${id}/`, serviceData);
export const deleteService = (id) => API.delete(`services/${id}/`);

// You can add more API calls here later
// export const fetchBookings = () => API.get('bookings/');
// etc.

export default API;
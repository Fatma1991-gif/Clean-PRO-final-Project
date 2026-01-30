import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; phone: string; password: string; address?: string; role?: 'client' | 'admin' | 'personnel' }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { name?: string; phone?: string; address?: string }) =>
    api.put('/auth/profile', data),
};

export const servicesAPI = {
  getAll: (category?: string) =>
    api.get(`/services${category ? `?category=${category}` : ''}`),
  getOne: (id: string) => api.get(`/services/${id}`),
  create: (data: any) => api.post('/services', data),
  update: (id: string, data: any) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
  getAllAdmin: () => api.get('/services/admin'),
};

export const bookingsAPI = {
  create: (data: { serviceId: string; date: string; time: string; address: string; notes?: string; paymentMethod?: 'cash' | 'online' }) =>
    api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings'),
  getAssignedToMe: () => api.get('/bookings/assigned/me'),
  getOne: (id: string) => api.get(`/bookings/${id}`),
  cancel: (id: string) => api.delete(`/bookings/${id}`),
  getAllAdmin: (status?: string) =>
    api.get(`/bookings/admin${status ? `?status=${status}` : ''}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/bookings/${id}/status`, { status }),
  assign: (id: string, personnelId: string) =>
    api.put(`/bookings/${id}/assign`, { personnelId }),
  getStats: () => api.get('/bookings/admin/stats'),
};

export const paymentsAPI = {
  createPaymentIntent: (bookingId: string) =>
    api.post('/payments/create-payment-intent', { bookingId }),
  confirmPayment: (bookingId: string, paymentIntentId: string) =>
    api.post('/payments/confirm-payment', { bookingId, paymentIntentId }),
};

export const usersAPI = {
  getAll: (role?: 'client' | 'admin' | 'personnel') => api.get(`/users${role ? `?role=${role}` : ''}`),
  getOne: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
};

export default api;

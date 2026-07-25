import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // FIX: Check for BOTH common keys to ensure we grab the token
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🚀 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response.data;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // If unauthorized, clear everything and kick to login
    if (error.response?.status === 401) {
      localStorage.clear(); // Clear all to be safe
      // Only redirect if we aren't already going to login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

// ==================== ANALYTICS API ====================
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getRevenue: (filters) => api.get('/analytics/revenue', { params: filters }),
  getMonthlySales: (year) => api.get('/analytics/monthly-sales', { params: { year } }),
  getTopCustomers: (limit = 5) => api.get('/analytics/top-customers', { params: { limit } }),
  getSalesByCategory: () => api.get('/analytics/category-performance'),
  getRevenueGrowth: () => api.get('/analytics/recent-trends'),
  getOrderStatusDistribution: () => api.get('/analytics/order-status-distribution'),
};

// ==================== ORDERS API ====================
export const ordersAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getRecentOrders: (limit = 10) => api.get('/orders/recent', { params: { limit } }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  simulateOrder: () => api.post('/orders/simulate'),
  getOrderStats: () => api.get('/orders/stats'),
};

// ==================== USERS API ====================
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// ==================== EXPORT API ====================
export const exportAPI = {
  exportOrders: (format, filters) => api.get('/export/orders', {
    params: { format, ...filters },
    responseType: 'blob',
  }),
  exportAnalytics: (format, filters) => api.get('/export/analytics', {
    params: { format, ...filters },
    responseType: 'blob',
  }),
};

// ==================== AUTH API ====================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify'), 
  refreshToken: () => api.post('/auth/refresh'),
};

// ==================== UTILITIES ====================
export const downloadFile = (blob, fileName) => {
  if (!blob) return;
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default api;

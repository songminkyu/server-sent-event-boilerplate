import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sse-auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API functions for sending data to backend
export const apiService = {
  // Notifications
  sendNotification: (notification: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    targetUserId?: string;
  }) => api.post('/notifications/send', notification),

  // Real-time updates
  sendRealtimeUpdate: (update: {
    entityType: string;
    entityId: string;
    action: 'created' | 'updated' | 'deleted';
    data: any;
  }) => api.post('/realtime/update', update),

  // Chat
  sendChatMessage: (message: {
    roomId: string;
    message: string;
  }) => api.post('/chat/message', message),

  joinChatRoom: (roomId: string) => api.post(`/chat/room/${roomId}/join`),

  leaveChatRoom: (roomId: string) => api.post(`/chat/room/${roomId}/leave`),

  // System
  getSystemStatus: () => api.get('/system/status'),

  // Authentication
  authenticate: (credentials: {
    username: string;
    password: string;
  }) => api.post('/auth/login', credentials),

  // Health check
  healthCheck: () => api.get('/health'),
};

// Utility functions
export const auth = {
  setToken: (token: string) => {
    localStorage.setItem('sse-auth-token', token);
  },

  getToken: () => {
    return localStorage.getItem('sse-auth-token');
  },

  clearToken: () => {
    localStorage.removeItem('sse-auth-token');
  },

  // For demo purposes - in production, this would be a proper login
  setDemoToken: () => {
    const demoToken = 'dGVzdDEyMzp0ZXN0dXNlcjp0ZXN0QGV4YW1wbGUuY29tOnVzZXIsYWRtaW4=';
    auth.setToken(demoToken);
    return demoToken;
  },
};

export default api;
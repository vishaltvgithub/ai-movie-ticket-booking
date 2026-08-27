import axios from 'axios';

// Default backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add interceptor to include JWT token if stored
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cine_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Centralized API functions
export const api = {
  // Auth
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },

  // Movies
  getMovies: async (params = {}) => {
    const res = await apiClient.get('/movies', { params });
    return res.data;
  },
  searchMovies: async (params = {}) => {
    const res = await apiClient.get('/movies/search', { params });
    return res.data;
  },
  getRecommendedMovies: async (limit = 6) => {
    const res = await apiClient.get('/movies/recommended', { params: { limit } });
    return res.data;
  },
  getMovieById: async (id) => {
    const res = await apiClient.get(`/movies/${id}`);
    return res.data;
  },

  // Theatres & Shows
  getTheatres: async () => {
    const res = await apiClient.get('/theatres');
    return res.data;
  },
  getTheatresByMovie: async (movieId) => {
    const res = await apiClient.get(`/movies/${movieId}/theatres`);
    return res.data;
  },
  getShowsForMovie: async (movieId, params = {}) => {
    const res = await apiClient.get(`/movies/${movieId}/shows`, { params });
    return res.data;
  },

  // Seats
  getSeatsForShow: async (showId) => {
    const res = await apiClient.get(`/shows/${showId}/seats`);
    return res.data;
  },
  getRecommendedSeats: async (showId, count = 2) => {
    const res = await apiClient.get(`/shows/${showId}/recommended-seats`, { params: { count } });
    return res.data;
  },

  // Bookings
  createBooking: async (bookingData) => {
    const res = await apiClient.post('/bookings', bookingData);
    return res.data;
  },
  getBooking: async (bookingId) => {
    const res = await apiClient.get(`/bookings/${bookingId}`);
    return res.data;
  },
  getUserBookings: async (userId) => {
    const res = await apiClient.get(`/users/${userId}/bookings`);
    return res.data;
  },
  cancelBooking: async (bookingId) => {
    const res = await apiClient.delete(`/bookings/${bookingId}`);
    return res.data;
  },

  // AI Assistant
  askAIChat: async (message, currentMovieId = null) => {
    const res = await apiClient.post('/ai/chat', {
      message,
      current_movie_id: currentMovieId
    });
    return res.data;
  },

  // Stats
  getStats: async () => {
    const res = await apiClient.get('/stats');
    return res.data;
  }
};

export default api;

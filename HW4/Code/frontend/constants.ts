// Adjust this if your Flask app is running on a different port or domain
// For development, we assume the React app proxies to localhost:5001 or expects the backend there.
export const API_BASE_URL = 'http://localhost:5001';

export const ENDPOINTS = {
  NO_INDEX: {
    SIMPLE: '/api/no-index/search',
    COMPLEX: '/api/no-index/join'
  },
  WITH_INDEX: {
    SIMPLE: '/api/with-index/search',
    COMPLEX: '/api/with-index/join'
  }
};

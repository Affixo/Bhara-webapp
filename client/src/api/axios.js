import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('bharaUser');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

/**
 * ✅ imgUrl — resolves any image URL for both local dev and production.
 *
 * - Cloudinary URLs already start with https:// → returned as-is
 * - Old local /uploads paths → prefixed with the API base URL (local dev fallback)
 * - Empty/null → returns empty string
 */
export const imgUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Local dev fallback for any /uploads/... paths
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
    .replace('/api', '');
  return `${base}${url}`;
};
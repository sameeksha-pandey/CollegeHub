import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL })

// Attach Authorization header automatically if token exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
});

// auto logout if 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth-logout'))
      // optional immediate redirect:
      // window.location.assign('/login')
    }
    return Promise.reject(err);
  }
);

export default api
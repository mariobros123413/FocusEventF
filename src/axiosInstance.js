import axios from 'axios';

const api = axios.create({
  baseURL: 'https://focusevent-production.up.railway.app', // URL del backend
});

export default api;
import axios from 'axios';

// URL base do backend vinda de variável de ambiente (Create React App usa REACT_APP_*)
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
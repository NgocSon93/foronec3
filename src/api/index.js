import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

export const checkUserExists = (email) => api.get(`/users?email=${email}`);
export const createUser = (userData) => api.post('/users', userData);

export default api;

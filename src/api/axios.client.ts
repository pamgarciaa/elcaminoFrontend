import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:3000';

const client = axios.create({
  baseURL,
  withCredentials: true,
});

export default client;
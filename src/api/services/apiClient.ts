import axios from 'axios';
import { supabase } from '../supabaseClient';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_CUSTOM_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      void supabase.auth.signOut();
    }
    return Promise.reject(error);
  },
);

export default apiClient;

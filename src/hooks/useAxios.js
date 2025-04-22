import axios from "axios";
import { useAuth } from "../context/AuthContext";

const useAxios = () => {
  const { token } = useAuth();

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "", // Set in .env file
  });

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

export default useAxios;

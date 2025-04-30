import axios from "axios";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

import { useServiceStore } from "@/stores/serviceStore";

import { AuthService } from "./authService";

const axiosInstance = axios.create({
  baseURL: "https://budetab-api.budeberkach.de",
  headers: {
    "Content-Type": "application/json",
  },
});

const getBaseUrl = async () => {
  const { activeService } = useServiceStore.getState();
  return activeService.baseUrl;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    config.baseURL = await getBaseUrl();
    const token = await AuthService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await AuthService.refreshToken();
        if (!newAccessToken) {
          throw new Error("Failed to refresh token");
        }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch {
        try {
          await SecureStoragePlugin.remove({ key: "accessToken" });
          await SecureStoragePlugin.remove({ key: "refreshToken" });
          await SecureStoragePlugin.remove({ key: "user-permissions" });
        } catch {
          await localStorage.clear();
        } finally {
          window.location.href = "/welcome"; // Redirect to login on token expiration
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

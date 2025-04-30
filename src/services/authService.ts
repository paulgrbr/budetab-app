import axios from "axios";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { jwtDecode } from "jwt-decode";
import { v4 } from "uuid";

import { useServiceStore } from "@/stores/serviceStore";

import { logoutMyUserWithJWT } from "./dataService";
import { API_ENDPOINTS } from "./endpoints";

export enum AuthRole {
  ADMIN = "admin",
  USER = "user",
  UNASSIGNED = "none",
}

export enum ResponseCode {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

type AuthResponse = {
  access_token: string;
  refresh_token: string;
};

type DecodedToken = {
  permissions: AuthRole;
  exp: number;
};

const axiosInstance = axios.create({
  baseURL: "https://budeberkach-budetab-api.budeberkach.de",
  headers: {
    "Content-Type": "application/json",
  },
});

const getBaseUrl = async () => {
  const { activeService } = useServiceStore.getState();
  return activeService.baseUrl;
};

axiosInstance.interceptors.request.use(async (config) => {
  config.baseURL = await getBaseUrl();
  return config;
});

// Utility: Check if token is valid
function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    if (!decoded.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decoded.exp > currentTime; // Token valid if expiration > current time
  } catch (error) {
    console.debug("Invalid token format:", error);
    return false;
  }
}

export const AuthService = {
  // Login function
  async login(username: string, password: string): Promise<ResponseCode> {
    try {
      let originId = null;
      try {
        const { value } = await SecureStoragePlugin.get({ key: "originId" });
        originId = value;
      } catch {
        if (!originId) {
          console.error("No originId defined");
          originId = v4();
          await SecureStoragePlugin.set({ key: "originId", value: originId });
        }
      }

      const response = await axiosInstance.post<AuthResponse>(
        API_ENDPOINTS.LOGIN,
        { username, password, originId }
      );

      if (response.status === 200) {
        await SecureStoragePlugin.set({
          key: ACCESS_TOKEN_KEY,
          value: response.data.access_token,
        });

        await SecureStoragePlugin.set({
          key: REFRESH_TOKEN_KEY,
          value: response.data.refresh_token,
        });
      }

      return response.status as ResponseCode;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn("Unauthorized: Invalid username or password");
        return ResponseCode.UNAUTHORIZED;
      }
      console.error("Login failed", error);
      return ResponseCode.INTERNAL_SERVER_ERROR; // Internal Server Error
    }
  },

  // Register function
  async register(username: string, password: string): Promise<ResponseCode> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        API_ENDPOINTS.REGISTER,
        { username, password }
      );

      return response.status as ResponseCode;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        return ResponseCode.CONFLICT;
      }
      console.error("Login failed", error);
      return ResponseCode.INTERNAL_SERVER_ERROR; // Internal Server Error
    }
  },

  // Logout function
  async logout() {
    const { value } = await SecureStoragePlugin.get({ key: "originId" });
    const originId = value;

    await logoutMyUserWithJWT(originId);

    await SecureStoragePlugin.remove({ key: ACCESS_TOKEN_KEY });
    await SecureStoragePlugin.remove({ key: REFRESH_TOKEN_KEY });
    await SecureStoragePlugin.remove({ key: "user-permissions" });
  },

  // Get Access Token with Validation and Auto-Refresh
  async getAccessToken(): Promise<string | null> {
    try {
      const { value: token } = await SecureStoragePlugin.get({
        key: ACCESS_TOKEN_KEY,
      });

      if (isTokenValid(token)) {
        return token;
      }

      // Attempt to refresh
      console.debug("Access token expired. Refreshing...");
      return await this.refreshToken();
    } catch (error) {
      console.debug("Failed to get access token", error);
      return null;
    }
  },

  // Get Refresh Token
  async getRefreshToken(): Promise<string | null> {
    try {
      const { value } = await SecureStoragePlugin.get({
        key: REFRESH_TOKEN_KEY,
      });
      return value;
    } catch (error) {
      console.debug("Failed to get refresh token", error);
      return null;
    }
  },

  // Refresh Access Token
  async refreshToken(): Promise<string | null> {
    console.debug("Refreshing accessToken");
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      console.error("No refresh token available");
      return null;
    }

    try {
      const response = await axiosInstance.get<AuthResponse>(
        API_ENDPOINTS.REFRESH_TOKEN,
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      await SecureStoragePlugin.set({
        key: ACCESS_TOKEN_KEY,
        value: response.data.access_token,
      });

      return response.data.access_token;
    } catch (error) {
      console.error("Failed to refresh access token", error);
      return null;
    }
  },

  // Check Role
  async getRole(): Promise<string | null> {
    const token = await this.getAccessToken();
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.permissions;
    } catch {
      return null;
    }
  },

  // Check if user is authorized
  async isAuthorized(requiredRole: AuthRole): Promise<boolean> {
    const token = await this.getAccessToken();
    if (!isTokenValid(token)) {
      console.warn("Invalid or expired token. Redirecting to login.");
      return false;
    }

    const role = await this.getRole();
    if (role === AuthRole.ADMIN) return true;
    if (role === AuthRole.USER && requiredRole === AuthRole.USER) return true;

    console.log("User is not authorized");
    return false;
  },

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    const token = await this.getAccessToken();
    if (isTokenValid(token)) {
      return true;
    }

    const refreshToken = await this.getRefreshToken();
    return isTokenValid(refreshToken);
  },
};

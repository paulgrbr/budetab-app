import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_ENDPOINTS } from "./endpoints";

export enum AuthRole {
  ADMIN = "admin",
  USER = "user",
}

const API_URL = "https://dev-budetab-api.budeberkach.de";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export const AuthService = {
  // Login function
  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}${API_ENDPOINTS.LOGIN}`,
        {
          username: username,
          password: password,
        }
      );
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  },

  // Logout function
  logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Get Access Token
  getAccessToken() {
    console.log("Access Token: " + localStorage.getItem(ACCESS_TOKEN_KEY));
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Get Refresh Token
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Refresh Access Token
  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post<AuthResponse>(
      API_URL + API_ENDPOINTS.REFRESH_TOKEN,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token);
    return response.data.access_token;
  },

  // Check Role
  getRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.permissions; // Permissions should be encoded in the JWT payload
    } catch (error) {
      return null;
    }
  },

  // Check if user is authorized
  isAuthorized(requiredRole: AuthRole): boolean {
    const role = this.getRole();
    if (role === AuthRole.ADMIN) {
      return true;
    } else if (role === AuthRole.USER && requiredRole === AuthRole.USER) {
      return true;
    }
    console.log("User is not authorized");
    return false;
  },
};

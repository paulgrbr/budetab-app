import axios from "axios";

import { ApiServer } from "@/models/account";

const configAxiosInstance = axios.create({
  baseURL: "https://config-budetab-api.budeberkach.de",
  headers: {
    "Content-Type": "application/json",
  },
});

export default configAxiosInstance;

type ApiResponse<T> = {
  error: ApiError;
  message: T;
};

type ApiError = {
  exception: string;
  message: string;
};

export async function getAllApiServices(): Promise<ApiServer[]> {
  try {
    const response = await configAxiosInstance.get("/services");
    const data: ApiResponse<ApiServer[]> = response.data;
    if (response.status === 200 && !data.error) {
      return data.message;
    } else {
      throw new Error(data.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

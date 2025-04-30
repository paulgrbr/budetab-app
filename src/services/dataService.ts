import axios from "axios";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

import { Account, AccountSessions } from "@/models/account";
import { PriceRanking, User } from "@/models/user";

import { AuthRole } from "./authService";
import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "./endpoints";

type ApiResponse<T> = {
  error: ApiError;
  message: T;
};

type ApiError = {
  exception: string;
  message: string;
};

export async function getMyAccount(): Promise<Account> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.MY_ACCOUNT);
    const data: ApiResponse<Account> = response.data;
    if (response.status === 200 && !data.error) {
      return data.message;
    } else {
      throw new Error(data.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error fetching account:", error);
    throw error;
  }
}

export async function getMyUser(): Promise<User> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.MY_USER);
    const data: ApiResponse<User> = response.data;
    if (response.status === 200 && !data.error) {
      return data.message;
    } else {
      throw new Error(data.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
export async function createUser(data: {
  firstName: string;
  lastName: string;
  isTemporary: boolean;
  priceRanking: PriceRanking;
  permissions: AuthRole;
}): Promise<User> {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.USERS, {
      firstName: data.firstName,
      lastName: data.lastName,
      isTemporary: data.isTemporary,
      priceRanking: data.priceRanking,
      permissions: data.permissions,
    });
    const responseData: ApiResponse<User> = response.data;
    if (response.status === 201 && !responseData.error) {
      return responseData.message;
    } else {
      throw new Error(responseData.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(
  userId: string,
  data: {
    firstName: string;
    lastName: string;
    isTemporary: boolean;
    priceRanking: PriceRanking;
    permissions: AuthRole;
  }
): Promise<User> {
  try {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.USERS}${userId}`,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        isTemporary: data.isTemporary,
        priceRanking: data.priceRanking,
        permissions: data.permissions,
      }
    );
    const responseData: ApiResponse<User> = response.data;
    if (response.status === 200 && !responseData.error) {
      return responseData.message;
    } else {
      throw new Error(responseData.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function uploadProfilePicture(
  userId: string,
  pictureUrl: string
): Promise<void> {
  try {
    // Fetch the image from the URL and convert it to a Blob
    const imageResponse = await axios.get(pictureUrl, {
      responseType: "blob",
    });
    const pictureBlob = imageResponse.data;

    // Create a FormData object
    const formData = new FormData();
    formData.append("file", pictureBlob, `file.png`);

    // Upload the image using Axios
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.USER_PROFILE_PICTURE}${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status !== 201) {
      throw new Error("Failed to upload profile picture");
    }
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw new Error("Failed to upload profile picture");
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS);
    const data: ApiResponse<User[]> = response.data;
    if (response.status === 200 && !data.error) {
      return data.message;
    } else {
      throw new Error(data.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

export async function getUserProfilePicture(userId: string): Promise<string> {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.USER_PROFILE_PICTURE}${userId}`,
      {
        responseType: "blob", // Ensure the response is treated as a Blob
      }
    );

    if (response.status === 200) {
      // Create a URL for the Blob
      const url = URL.createObjectURL(response.data);
      return url;
    } else {
      throw new Error("Failed to fetch user profile picture");
    }
  } catch (error) {
    console.error("Error fetching user profile picture:", error);
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<string> {
  try {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.USERS}${userId}`
    );
    const responseData: ApiResponse<string> = response.data;
    if (response.status === 200 && !responseData.error) {
      return responseData.message;
    } else {
      throw new Error(responseData.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function logoutMyUserWithJWT(originId: string): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.LOGOUT, { originId });
}

export async function registerNotificationKeyToSession(
  notificationToken: string
): Promise<string> {
  try {
    const { value } = await SecureStoragePlugin.get({ key: "originId" });
    const originId = value;

    const response = await axiosInstance.post(API_ENDPOINTS.NOTIFICATION, {
      notificationToken,
      originId,
    });
    const responseData: ApiResponse<string> = response.data;
    if (response.status === 200 && !responseData.error) {
      return responseData.message;
    } else {
      throw new Error(responseData.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error linking notification key:", error);
    throw error;
  }
}

export async function getAllAccounts(): Promise<Account[]> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ACCOUNT);
    const data: ApiResponse<Account[]> = response.data;
    if (response.status === 200 && !data.error) {
      return data.message;
    } else {
      throw new Error(data.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error fetching all accounts:", error);
    throw error;
  }
}

export async function getAllAccountSessions(): Promise<
  { publicId: string; sessions: AccountSessions[] }[]
> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ACCOUNT_SESSIONS);
    const data: ApiResponse<Record<string, AccountSessions[]>> = response.data;

    if (response.status === 200 && !data.error) {
      // Map the object into an array of objects containing accountId and sessions
      const sessions = Object.entries(data.message).map(
        ([publicId, sessions]) => ({
          publicId,
          sessions,
        })
      );
      return sessions;
    } else {
      throw new Error(data.error?.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error fetching all account sessions:", error);
    throw error;
  }
}

export async function linkAccountToUser(
  accountId: string,
  userId: string
): Promise<string> {
  try {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.ACCOUNT}${accountId}`,
      {
        userId,
      }
    );
    const responseData: ApiResponse<string> = response.data;
    if (response.status === 200 && !responseData.error) {
      return responseData.message;
    } else {
      throw new Error(responseData.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error linking user:", error);
    throw error;
  }
}

export async function terminateSpecificAccountSession(
  accountId: string,
  originId: string
): Promise<string> {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.ACCOUNT_SESSION_TERMINATE}`,
      {
        accountId,
        originId,
      }
    );
    const responseData: ApiResponse<string> = response.data;
    if (response.status === 200 && !responseData.error) {
      return responseData.message;
    } else {
      throw new Error(responseData.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error terminating session:", error);
    throw error;
  }
}

export async function terminateAllAccountSessionsForAccount(
  accountId: string
): Promise<string> {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.ACCOUNT_SESSION_TERMINATE}/${accountId}`
    );
    const responseData: ApiResponse<string> = response.data;
    if (response.status === 200 && !responseData.error) {
      return responseData.message;
    } else {
      throw new Error(responseData.error.exception || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error terminating session:", error);
    throw error;
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { create } from "zustand";

import { Account } from "@/models/account";
import { User } from "@/models/user";
import { AuthRole } from "@/services/authService";

import {
  fetchCachedUserProfilePicture,
  fetchUncachedProfilePicture,
} from "./profilePictureService";

type UserStore = {
  account: Account;
  setAccount: (account: Account) => void;
  user: User;
  setUser: (user: User) => void;
  assignMyProfilePictureFromCache: () => void;
  refreshMyCachedProfilePicture: () => void;
};

export const useUserStore = create<UserStore>()((set, get) => ({
  account: {
    username: "",
    permissions: AuthRole.USER,
    linkedUserId: "",
  },
  setAccount: (newAccount: Partial<Account>) =>
    set((state) => ({
      account: { ...state.account, ...newAccount },
    })),
  user: {
    userId: "",
    firstName: "",
    lastName: "",
    isTemporary: false,
    permissions: AuthRole.UNASSIGNED,
    priceRanking: null,
    hasProfilePicture: false,
  },
  setUser: (newUser: Partial<User>) => {
    set((state) => ({
      user: { ...state.user, ...newUser },
    }));
    // Save in preferences
    if (newUser.permissions) {
      SecureStoragePlugin.set({
        key: "user-permissions",
        value: newUser.permissions,
      });
    }
  },
  assignMyProfilePictureFromCache: async () => {
    const user = get().user;
    try {
      if (user.hasProfilePicture) {
        const picture = await fetchCachedUserProfilePicture(user.userId);
        set(() => ({
          user: { ...user, profilePicture: picture },
        }));
      } else {
        set(() => ({
          user: { ...user, profilePicture: "" },
        }));
      }
    } catch {
      set(() => ({
        user: { ...user, profilePicture: "" },
      }));
    }
  },
  refreshMyCachedProfilePicture: async () => {
    const user = get().user;
    if (user.hasProfilePicture) {
      await fetchUncachedProfilePicture(user.userId);
    }
  },
}));

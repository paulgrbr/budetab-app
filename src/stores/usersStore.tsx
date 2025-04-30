/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";

import { User } from "@/models/user";

import {
  fetchCachedUserProfilePicture,
  fetchUncachedProfilePicture,
} from "./profilePictureService";

type UsersStore = {
  users: User[];
  setUsers: (users: User[]) => void;
  assignProfilePicturesFromCache: () => void;
  refreshCachedProfilePictures: () => void;
  reloadUsersChange: boolean;
  setReloadUsersChange: (value: boolean) => void;
  getReloadUsersChange: () => boolean;
};

export const useAllUsersStore = create<UsersStore>()((set, get) => ({
  users: [],
  setUsers: (newUsers: User[]) => {
    set(() => ({
      users: [...newUsers],
    }));
  },
  assignProfilePicturesFromCache: async () => {
    const users = get().users;
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        try {
          if (user.hasProfilePicture) {
            const picture = await fetchCachedUserProfilePicture(user.userId);
            return { ...user, profilePicture: picture };
          } else {
            return { ...user, profilePicture: "" };
          }
        } catch {
          return { ...user, profilePicture: "" }; // Fallback to empty string
        }
      })
    );
    set(() => ({
      users: updatedUsers,
    }));
  },
  refreshCachedProfilePictures: async () => {
    const users = get().users;
    await Promise.all(
      users.map(async (user) => {
        if (user.hasProfilePicture) {
          await fetchUncachedProfilePicture(user.userId);
        }
      })
    );
  },
  reloadUsersChange: false,
  setReloadUsersChange: (value: boolean) => {
    set(() => ({
      reloadUsersChange: value,
    }));
  },
  getReloadUsersChange: () => {
    return get().reloadUsersChange;
  },
}));

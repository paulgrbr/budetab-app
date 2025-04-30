/* eslint-disable @typescript-eslint/no-unused-vars */
import { Preferences } from "@capacitor/preferences";
import { create } from "zustand";

import { ApiServer } from "@/models/account";

type ServiceStore = {
  activeService: ApiServer;
  setActiveService: (service: ApiServer) => void;
  services: ApiServer[];
  setServices: (services: ApiServer[]) => void;
};

export const useServiceStore = create<ServiceStore>()((set) => ({
  activeService: {
    baseName: "",
    identifier: "",
    baseUrl: "",
  },
  setActiveService: async (service: ApiServer) => {
    await Preferences.set({
      key: "activeService",
      value: JSON.stringify(service),
    });
    set(() => ({ activeService: service }));
  },
  services: [],
  setServices: (services: ApiServer[]) => set(() => ({ services })),
}));

export const initServiceStore = async () => {
  const { value } = await Preferences.get({ key: "activeService" });
  if (value) {
    useServiceStore.getState().setActiveService(JSON.parse(value));
  }
};

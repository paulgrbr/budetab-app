/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";

import { Account, AccountSessions } from "@/models/account";

type AccountsStore = {
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  reloadAccountsChange: boolean;
  setReloadAccountsChange: (value: boolean) => void;
  getReloadAccountsChange: () => boolean;
  assignAccountSessions: (
    accountSessions: { publicId: string; sessions: AccountSessions[] }[]
  ) => void;
};

export const useAllAccountsStore = create<AccountsStore>()((set, get) => ({
  accounts: [],
  setAccounts: (newAccounts: Account[]) => {
    set(() => ({
      accounts: [...newAccounts],
    }));
  },
  reloadAccountsChange: false,
  setReloadAccountsChange: (value: boolean) => {
    set(() => ({
      reloadAccountsChange: value,
    }));
  },
  getReloadAccountsChange: () => {
    return get().reloadAccountsChange;
  },
  assignAccountSessions: (
    accountSessions: { publicId: string; sessions: AccountSessions[] }[]
  ) =>
    set((state) => ({
      accounts: state.accounts.map((account) => {
        const session = accountSessions.find(
          (s) => s.publicId === account.publicId
        );
        if (session) {
          return { ...account, sessions: session.sessions };
        }
        return account;
      }),
    })),
}));

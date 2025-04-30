import "./AccountsList.css";

import { useIonRouter } from "@ionic/react";
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import React from "react";

import AccountUserItem from "@/components/AccountUserItem";
import UserItemSkeleton from "@/components/UserItemSkeleton";
import { Account } from "@/models/account";
import { useAllUsersStore } from "@/stores/usersStore";
import { useUserStore } from "@/stores/userStore";

type AccountsListProps = {
  accounts: Account[];
  loading: boolean;
  searchTerm: string;
  urlPrefix: string;
};

const AccountsList: React.FC<AccountsListProps> = ({
  accounts,
  loading,
  searchTerm,
  urlPrefix,
}) => {
  // Fuse.js search logic
  const fuse = new Fuse(accounts, {
    keys: ["username"],
    threshold: 0.3, // Adjust for search sensitivity
  });

  const searchResults = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : accounts;

  const sortedAccounts = [...searchResults].sort((a, b) =>
    a.username.localeCompare(b.username)
  );

  const groupedAccounts: { [key: string]: Account[] } = {
    "A-F": sortedAccounts.filter((account) => /^[A-F]/i.test(account.username)),
    "G-K": sortedAccounts.filter((account) => /^[G-K]/i.test(account.username)),
    "L-P": sortedAccounts.filter((account) => /^[L-P]/i.test(account.username)),
    "Q-Z": sortedAccounts.filter((account) => /^[Q-Z]/i.test(account.username)),
    "#": sortedAccounts.filter((account) => !/^[A-Z]/i.test(account.username)), // Non-alphabetical entries
  };

  const hasResults = Object.values(groupedAccounts).some(
    (group) => group.length > 0
  );

  const { account: myAccount } = useUserStore();
  const { users } = useAllUsersStore();

  const router = useIonRouter();

  return (
    <div>
      <AnimatePresence mode="wait">
        {!loading ? (
          hasResults ? (
            Object.entries(groupedAccounts).map(
              ([group, accounts]) =>
                accounts.length > 0 && (
                  <div key={group}>
                    <div className="accounts-list-alpha-divider">
                      <p>{group}</p>
                    </div>
                    {accounts.map((account, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AccountUserItem
                          name={
                            account.username +
                            (account.username === myAccount.username
                              ? " (Du)"
                              : "")
                          }
                          linkedUser={(() => {
                            const user = users.find(
                              (user) => user.userId == account.linkedUserId
                            );
                            return user
                              ? `${user.firstName} ${user.lastName}`
                              : "";
                          })()}
                          onClick={() => {
                            router.push(
                              urlPrefix + "/account/" + account.username,
                              "forward"
                            );
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                )
            )
          ) : (
            <div className="accounts-list-no-results">
              Kein Account gefunden
            </div>
          )
        ) : (
          <div>
            {Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <UserItemSkeleton fadeOut={false} />
              </motion.div>
            ))}

            <motion.div
              key={6}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <UserItemSkeleton fadeOut={true} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountsList;

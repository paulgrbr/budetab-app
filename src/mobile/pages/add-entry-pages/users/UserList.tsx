import "./UserList.css";

import { useIonRouter } from "@ionic/react";
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import React from "react";

import UserItem from "@/components/UserItem";
import UserItemSkeleton from "@/components/UserItemSkeleton";
import { User } from "@/models/user";
import { useUserStore } from "@/stores/userStore";

type UserListProps = {
  priceRanking?: "member" | "regular" | "external";
  selectable: boolean;
  users: User[];
  loading: boolean;
  searchTerm: string;
  urlPrefix: string;
};

const UserList: React.FC<UserListProps> = ({
  priceRanking,
  selectable,
  users,
  loading,
  searchTerm,
  urlPrefix,
}) => {
  const filteredUsers = priceRanking
    ? users.filter((user) => user.priceRanking === priceRanking)
    : users;
  // Fuse.js search logic
  const fuse = new Fuse(filteredUsers, {
    keys: [
      "firstName",
      "lastName",
      {
        name: "combinedName",
        getFn: (user) => `${user.firstName} ${user.lastName}`,
      },
    ],
    threshold: 0.3, // Adjust for search sensitivity
  });

  const searchResults = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : filteredUsers;

  const sortedUsers = [...searchResults].sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  );

  const groupedUsers: { [key: string]: User[] } = {
    "A-F": sortedUsers.filter((user) => /^[A-F]/i.test(user.firstName)),
    "G-K": sortedUsers.filter((user) => /^[G-K]/i.test(user.firstName)),
    "L-P": sortedUsers.filter((user) => /^[L-P]/i.test(user.firstName)),
    "Q-Z": sortedUsers.filter((user) => /^[Q-Z]/i.test(user.firstName)),
    "#": sortedUsers.filter((user) => !/^[A-Z]/i.test(user.firstName)), // Non-alphabetical entries
  };

  const hasResults = Object.values(groupedUsers).some(
    (group) => group.length > 0
  );

  const { user: myUser } = useUserStore();

  const router = useIonRouter();

  return (
    <div>
      <AnimatePresence mode="wait">
        {!loading ? (
          hasResults ? (
            Object.entries(groupedUsers).map(
              ([group, users]) =>
                users.length > 0 && (
                  <div key={group}>
                    <div className="user-list-alpha-divider">
                      <p>{group}</p>
                    </div>
                    {users.map((user, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <UserItem
                          name={
                            user.firstName +
                            " " +
                            user.lastName +
                            (user.userId === myUser.userId ? " (Du)" : "")
                          }
                          isTemporary={user.isTemporary}
                          picture={user.profilePicture || ""}
                          selectable={selectable}
                          onClick={() => {
                            router.push(
                              urlPrefix + "/user/" + user.userId,
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
            <div className="user-list-no-results">Keine Nutzer gefunden</div>
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

export default UserList;

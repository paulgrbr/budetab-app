import "./UserList.css";

import React from "react";

import UserItem from "@/components/UserItem";
import UserItemSkeleton from "@/components/UserItemSkeleton";

type UserListProps = {
  priceRanking?: "member" | "regular" | "external";
  selectable: boolean;
};

const UserList: React.FC<UserListProps> = ({ selectable }) => {
  return (
    <div>
      <div className="user-list-alpha-divider">
        <p>A-F</p>
      </div>
      <UserItem
        name={"Paul Gröber"}
        isTemporary={true}
        picture={""}
        selectable={selectable}
        onClick={() => {}}
      />
      <UserItem
        name={"Franz Gröber"}
        isTemporary={false}
        picture={"profile.png"}
        selectable={selectable}
        onClick={() => {}}
      />
      <UserItemSkeleton />
    </div>
  );
};

export default UserList;

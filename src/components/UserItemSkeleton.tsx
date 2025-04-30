import "./UserItem.css";

import { HStack, Skeleton } from "@chakra-ui/react";
import React from "react";

import { SkeletonCircle } from "./ui/skeleton";

type UserItemSkeletonProps = {
  fadeOut: boolean;
};

const UserItemSkeleton: React.FC<UserItemSkeletonProps> = ({ fadeOut }) => {
  return (
    <div
      className={`user-item-container ${fadeOut ? "user-item-fade-out" : ""}`}
    >
      <HStack gap="5">
        <SkeletonCircle size="11" marginRight="-5px" variant="shine" />
        <Skeleton height="5" width="20ch" variant="shine" />
      </HStack>
    </div>
  );
};

export default UserItemSkeleton;

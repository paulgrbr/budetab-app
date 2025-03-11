import "./UserItem.css";

import { HStack, Skeleton } from "@chakra-ui/react";
import React from "react";

import { SkeletonCircle } from "./ui/skeleton";

const UserItemSkeleton: React.FC = () => {
  return (
    <div className="user-item-container">
      <HStack gap="5">
        <SkeletonCircle size="12" marginRight="-5px" variant="shine" />
        <Skeleton height="5" width="20ch" variant="shine" />
      </HStack>
    </div>
  );
};

export default UserItemSkeleton;

import "./UserItem.css";

import { Avatar, Badge } from "@chakra-ui/react";
import { Smartphone } from "lucide-react";
import React, { useState } from "react";

import arrowRight from "/icons/arrow-right.svg";

type AccountUserItemProps = {
  name: string;
  linkedUser: string;
  onClick: () => void;
};

const AccountUserItem: React.FC<AccountUserItemProps> = ({
  name,
  linkedUser,
  onClick,
}) => {
  const [touchActive, setTouchActive] = useState(false);
  let touchTimer: NodeJS.Timeout | null = null;

  const handleTouchStart = () => {
    touchTimer = setTimeout(() => {
      setTouchActive(true);
    }, 100); // 100ms threshold
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      touchTimer = null;
    }
    setTouchActive(false);
  };

  const handleOnClick = () => {
    setTouchActive(true);
    setTimeout(() => {
      setTouchActive(false);
    }, 400);
  };

  return (
    <div
      className={`user-item-container ${touchActive ? "touch-active" : ""}`}
      onClick={() => {
        onClick();
      }}
      onClickCapture={handleOnClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <Avatar.Root colorPalette="purple" size="lg" variant="subtle">
        <Avatar.Fallback>{<Smartphone></Smartphone>}</Avatar.Fallback>
      </Avatar.Root>
      <p>{name}</p>
      {linkedUser ? <Badge colorPalette="yellow">{linkedUser}</Badge> : ""}

      <img id="arrow" src={arrowRight} />
    </div>
  );
};

export default AccountUserItem;

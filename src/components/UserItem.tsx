import "./UserItem.css";

import { Avatar, Badge, Checkbox } from "@chakra-ui/react";
import React, { useState } from "react";

import arrowRight from "/icons/arrow-right.svg";

type UserItemProps = {
  name: string;
  isTemporary: boolean;
  picture: string;
  selectable: boolean;
  onClick: () => void;
};

const UserItem: React.FC<UserItemProps> = ({
  name,
  isTemporary,
  picture,
  selectable,
  onClick,
}) => {
  const [checkboxSelected, setCheckboxSelected] = useState(false);
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
      className={`user-item-container ${
        touchActive && !selectable ? "touch-active" : ""
      }`}
      onClick={() => {
        onClick();
        if (selectable) {
          setCheckboxSelected(!checkboxSelected);
        }
      }}
      onClickCapture={handleOnClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <Avatar.Root colorPalette="purple" size="lg" variant="subtle">
        <Avatar.Image src={picture} />
        <Avatar.Fallback name={name} />
      </Avatar.Root>
      <p className={checkboxSelected && selectable ? "user-item-selected" : ""}>
        {name}
      </p>
      {isTemporary ? <Badge colorPalette="purple">Temporär</Badge> : ""}
      {selectable ? (
        <Checkbox.Root
          className="checkbox"
          colorPalette="purple"
          checked={checkboxSelected}
          onSelect={() => setCheckboxSelected(!checkboxSelected)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control borderColor="#B7B7B7">
            <Checkbox.Indicator />
          </Checkbox.Control>
        </Checkbox.Root>
      ) : (
        <img id="arrow" src={arrowRight} />
      )}
    </div>
  );
};

export default UserItem;

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

  return (
    <div
      className="user-item-container"
      onClick={() => {
        onClick();
        if (selectable) {
          setCheckboxSelected(!checkboxSelected);
        }
      }}
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

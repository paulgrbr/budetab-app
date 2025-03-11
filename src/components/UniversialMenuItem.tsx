import "./UniversalMenuItem.css";

import React, { ReactNode } from "react";

import arrowRight from "/icons/arrow-right.svg";

type UniversalMenuItemProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  animationDuration: number;
  onClick: () => void;
};

const UniversalMenuItem: React.FC<UniversalMenuItemProps> = ({
  title,
  subtitle,
  icon,
  animationDuration,
  onClick,
}) => {
  return (
    <div
      className="universal-button"
      onClick={() => onClick()}
      style={{ animationDuration: `${animationDuration}s` }}
    >
      <span className="universal-button-icon">{icon}</span>
      <span>
        <p id="title">{title}</p>
        <p id="subtitle">{subtitle}</p>
      </span>
      <img id="arrow" src={arrowRight} />
    </div>
  );
};

export default UniversalMenuItem;

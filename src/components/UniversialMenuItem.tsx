import "./UniversalMenuItem.css";

import React, { ReactNode, useState } from "react";

import arrowRight from "/icons/arrow-right.svg";

type UniversalMenuItemProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  animationDuration: number;
  onClick: () => void;
  lightIconPrimary?: string;
  lightIconSecondary?: string;
  darkIconPrimary?: string;
  darkIconSecondary?: string;
};

const UniversalMenuItem: React.FC<UniversalMenuItemProps> = ({
  title,
  subtitle,
  icon,
  animationDuration,
  onClick,
  lightIconPrimary,
  lightIconSecondary,
  darkIconPrimary,
  darkIconSecondary,
}) => {
  const darkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

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
      className={`universal-button ${touchActive ? "touch-active" : ""}`}
      onClick={() => onClick()}
      style={{ animationDuration: `${animationDuration}s` }}
      onClickCapture={handleOnClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <span
        className="universal-button-icon"
        style={{
          backgroundColor: darkMode ? darkIconSecondary : lightIconSecondary,
          color: darkMode ? darkIconPrimary : lightIconPrimary,
        }}
      >
        {icon}
      </span>
      <span>
        <p id="title">{title}</p>
        <p id="subtitle">{subtitle}</p>
      </span>
      <img id="arrow" src={arrowRight} />
    </div>
  );
};

export default UniversalMenuItem;

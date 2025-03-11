import "./CalendarItem.css";

import { Haptics, ImpactStyle } from "@capacitor/haptics";
import React from "react";

type CalendarItemProps = {
  weekday: string;
  dayOfMonth: string;
  selected: boolean;
  hasEntry: boolean;
  onClick: () => void;
};

const CalendarItem: React.FC<CalendarItemProps> = ({
  weekday,
  dayOfMonth,
  selected,
  hasEntry,
  onClick,
}) => {
  const hapticsImpactLight = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
  };

  return (
    <div
      onClick={(e) => {
        hapticsImpactLight();
        e.stopPropagation();
        onClick();
      }}
      className={`calendar-item ${selected ? "calendar-item-selected" : ""}`}
    >
      <p className="title">{weekday}</p>
      <p>{dayOfMonth}</p>
      <span
        className={`calendar-item-entry-indicator ${
          hasEntry ? "calendar-item-has-entry" : ""
        }`}
      ></span>
    </div>
  );
};

export default CalendarItem;

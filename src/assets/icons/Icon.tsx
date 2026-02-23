import { useState } from "react";
import "./icons.css";

interface IconProps {
  onClick: () => void;
  className: string;
  label: string;
}

export default function Icon({ onClick, className, label }: IconProps) {
  const [showLabel, setShowLabel] = useState(false);

  return (
    <div className="iconContainer">
      <i
        className={className + ` icon`}
        onClick={onClick}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
      ></i>
      {showLabel && (
        <div className="iconLabel">
          {label}
        </div>
      )}
    </div>
  );
}

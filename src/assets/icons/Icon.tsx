import "./icons.css";

interface IconProps {
  onClick: () => void;
  className: string;
}

export default function Icon({ onClick, className }: IconProps) {
  return (
    <div className="iconContainer">
      <i className={className + ` icon`} onClick={onClick}></i>
    </div>
  );
}

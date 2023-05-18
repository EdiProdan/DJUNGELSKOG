import React from "react";

export type ButtonProps = {
  className?: string;
  onClick?: () => void;
  text?: React.ReactNode;
  style?: React.CSSProperties;
};

export const Button = ({ className, onClick, text, style }: ButtonProps) => {
  return (
    <div className={className} style={style}>
      <button onClick={onClick} className="bg-indigo-700 px-4 py-2 rounded-full text-white">
        {text}
      </button>
    </div>
  );
};

import React from "react";

type FormButtonProps = {
  className?: string;
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isDisabled?: boolean;
  type?: "submit" | "button";
};

export default function ActionButton({
  className,
  text,
  onClick,
  isDisabled = false,
  type = "button",
}: FormButtonProps) {
  return (
    <button
      className={`bg-base py-3 px-10 rounded-2xl text-white ${className} ${isDisabled ? "opacity-50" : ""}`}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
}

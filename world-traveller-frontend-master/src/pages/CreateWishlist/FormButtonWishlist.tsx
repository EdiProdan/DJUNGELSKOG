import React from "react";

type FormButtonProps = {
  className?: string;
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isDisabled?: boolean;
  isSubmit?: boolean;
};

export default function FormButtonWishlist({
  className,
  text,
  onClick,
  isDisabled = false,
  isSubmit = true,
}: FormButtonProps) {
  return (
    <button
      className={`py-3 px-8 rounded-lg text-white ${className} ${isDisabled ? "opacity-50" : ""}`}
      disabled={isDisabled}
      onClick={onClick}
      type={isSubmit ? "submit" : "button"}
    >
      {text}
    </button>
  );
}

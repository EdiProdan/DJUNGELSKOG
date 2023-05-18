import React from "react";

type FormButtonProps = {
  className?: string;
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isDisabled?: boolean;
};

export default function FormButtonTrip({ className, text, onClick, isDisabled = false }: FormButtonProps) {
  return (
    <button
      className={`flex justify-center py-3 px-10 rounded-lg text-white ${className} ${isDisabled ? "opacity-50" : ""}`}
      disabled={isDisabled}
      onClick={onClick}
      type="submit"
    >
      {text}
    </button>
  );
}

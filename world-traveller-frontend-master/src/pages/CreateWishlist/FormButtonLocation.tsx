import React from "react";

type FormButtonProps = {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isDisabled?: boolean;
};

export default function FormButtonLocation({ className, onClick, isDisabled = false }: FormButtonProps) {
  return (
    <button
      className={`w-8 h-8 rounded-lg text-white ${className} ${isDisabled ? "opacity-50" : ""}`}
      disabled={isDisabled}
      onClick={onClick}
      type="submit"
    >
      <img
        className="w-6 h-6 p-1 ml-1"
        src="https://png.pngtree.com/png-vector/20190419/ourmid/pngtree-vector-location-icon-png-image_956422.jpg"
        alt="location"
      />
    </button>
  );
}

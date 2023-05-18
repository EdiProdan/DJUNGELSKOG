import React from "react";

import { TrashIcon } from "@heroicons/react/outline";

export type DeleteButtonProps = {
  className?: string;
  onClick?: () => void;
};

export const DeleteButton = ({ className, onClick }: DeleteButtonProps) => {
  return (
    <div className={className}>
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center w-8 h-8 text-pink-100 transition-colors duration-150 bg-red-400 rounded-full focus:shadow-outline hover:bg-red-600"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

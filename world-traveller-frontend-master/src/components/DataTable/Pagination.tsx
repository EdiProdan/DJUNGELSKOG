import React from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

type PaginationProps = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  handleItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  totalPages: number;
  paginationItems?: number;
};

export function Pagination({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  handleItemsPerPageChange,
  totalPages,
  paginationItems = 5,
}: PaginationProps) {
  const buttonStyle = "w-8 py-1 rounded-xl";
  const selectedButtonStyle = "bg-base text-white";
  const pages = Array.from(Array(totalPages).keys());

  const half = Math.floor(paginationItems / 2);

  let buttons;
  if (currentPage + half <= paginationItems) {
    buttons = (
      <>
        {pages.slice(0, paginationItems).map((page) => (
          <button
            key={page}
            className={`${buttonStyle} ${page + 1 === currentPage ? selectedButtonStyle : ""}`}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}
      </>
    );
  }
  if (currentPage - half >= 1 && currentPage + half <= totalPages) {
    const lowerBound = paginationItems % 2 !== 0 ? currentPage - half - 1 : currentPage - half;
    buttons = (
      <>
        {pages.slice(lowerBound, currentPage + half).map((page) => (
          <button
            key={page}
            className={`${buttonStyle} ${page + 1 === currentPage ? selectedButtonStyle : ""}`}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}
      </>
    );
  }
  if (currentPage - half >= 1 && currentPage + half > totalPages) {
    const lowerBound = totalPages - paginationItems < 0 ? 0 : totalPages - paginationItems;
    buttons = (
      <>
        {pages.slice(lowerBound, totalPages).map((page) => (
          <button
            key={page}
            className={`${buttonStyle} ${page + 1 === currentPage ? selectedButtonStyle : ""}`}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-row flex-grow select-none mt-6">
      <div className="flex flex-row flex-grow items-center gap-4">
        <label htmlFor="itemsPerPage">Stavki po stranici:</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="rounded-lg outline-none border border-gray-300 pr-10"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      <div className="flex flex-row items-center mx-4">
        {currentPage} of {totalPages}
      </div>
      <div className="flex flex-row items-center">
        <ChevronLeftIcon
          className="w-6 h-6 cursor-pointer"
          onClick={() => {
            if (currentPage > 1) setCurrentPage(currentPage - 1);
          }}
        />
        {buttons}
        <ChevronRightIcon
          className="w-6 h-6 cursor-pointer"
          onClick={() => {
            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
          }}
        />
      </div>
    </div>
  );
}

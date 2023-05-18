import React from "react";

import _ from "lodash";

import { Filter, TableItem } from "../components/DataTable/DataTable";
import { useDebounce } from "./useDebounce";

const usePagination = <T extends object>(data: TableItem<T>[], frontendPagination?: boolean) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const [paginatedData, setPaginatedData] = React.useState<TableItem<T>[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);

  const [search, setSearch] = React.useState("");
  const [searchBy, setSearchBy] = React.useState<(keyof T)[]>([]);
  const [filter, setFilter] = React.useState<Filter<T>>({
    name: "" as keyof T,
    values: [],
    commaSeparatedValue: false,
  });
  const [filterValue, setFilterValue] = React.useState<keyof T>();

  const debouncedSetSearch = useDebounce(setSearch, 300);

  React.useEffect(() => {
    if (!frontendPagination) return;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setPaginatedData(data.slice(start, end));
  }, [data, currentPage, itemsPerPage, frontendPagination]);

  React.useEffect(() => {
    if (!frontendPagination) return;

    setTotalPages(Math.ceil(data.length / itemsPerPage));
  }, [data, itemsPerPage, frontendPagination]);

  React.useEffect(() => {
    if (!frontendPagination) return;

    const filteredData = data.filter((item) => {
      if (search === "") return true;

      const reduced = _.pick(item, searchBy);

      return Object.values(reduced)
        .map((value) => String(value))
        .some((value) => search.split(" ").some((word) => value.toLowerCase().includes(word.toLowerCase())));
    });

    setPaginatedData(filteredData.slice(0, itemsPerPage));

    const total = Math.ceil(filteredData.length / itemsPerPage);
    setTotalPages(total === 0 ? 1 : total);
    setCurrentPage(1);
  }, [data, search, itemsPerPage, frontendPagination, searchBy]);

  React.useEffect(() => {
    if (!frontendPagination || !filter) return;

    const filteredData = filterValue
      ? data.filter((item) => {
          if (filter.commaSeparatedValue) {
            const values = String(item[filter.name])
              .split(",")
              .map((value) => value.trim());
            return values.includes(filterValue as string);
          }

          return !filterValue ? true : String(item[filter.name]) === String(filterValue);
        })
      : data;

    setPaginatedData(filteredData.slice(0, itemsPerPage));

    const total = Math.ceil(filteredData.length / itemsPerPage);
    setTotalPages(total === 0 ? 1 : total);
    setCurrentPage(1);
  }, [data, filterValue, itemsPerPage, frontendPagination, filter]);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
    paginatedData,
    totalPages,
    setTotalPages,
    debouncedSetSearch,
    setSearchBy,
    setFilter,
    setFilterValue,
  };
};

export default usePagination;

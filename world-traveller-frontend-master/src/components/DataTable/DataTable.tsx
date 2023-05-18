import React from "react";

import { TagIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import _ from "lodash";

import usePagination from "../../hook/usePagination";
import { firstLetterUppercase } from "../../util/text";
import Card from "../Card/Card";
import { Pagination } from "./Pagination";

type DataTableProps<T> = {
  data: T[];
  frontendPagination?: boolean;
  columnNames?: { [key in keyof T]?: string };
  searchBy?: (keyof T)[];
  filterBy?: keyof T;
  filterByNames?: { [key: string]: string };
  commaSeparatedFilter?: boolean;
  commaSeparatedFilterOnClick?: (item: T, val: unknown) => void;
  actions?: ((item: TableItem<T>) => React.ReactNode)[];
};

export type TableItem<T> = T & { id: number | string };

export type Filter<T> = {
  name: keyof T;
  values: T[keyof T][];
  commaSeparatedValue: boolean;
};

export default function DataTable<T extends object>({
  data,
  frontendPagination,
  columnNames,
  searchBy,
  filterBy,
  filterByNames,
  commaSeparatedFilter,
  commaSeparatedFilterOnClick,
  actions,
}: DataTableProps<T>) {
  const dataHasId = "id" in data[0];

  const tableData: TableItem<T>[] = dataHasId
    ? (data as TableItem<T>[])
    : data.map((item) => ({ id: _.uniqueId(), ...item }));
  if (frontendPagination) {
    tableData.sort((a, b) => (a.id > b.id ? 1 : -1));
  }

  const filter: Filter<T> | undefined = React.useMemo(() => {
    if (commaSeparatedFilter) {
      return (
        filterBy && {
          name: filterBy as keyof T,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          values: _.uniq(data.flatMap((item) => String(item[filterBy as keyof T]).split(","))) as any,
          commaSeparatedValue: true,
        }
      );
    }

    return (
      filterBy && {
        name: filterBy as keyof T,
        values: _.uniq(data.map((item) => item[filterBy as keyof T])),
        commaSeparatedValue: false,
      }
    );
  }, [data, filterBy, commaSeparatedFilter]);

  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
    paginatedData,
    totalPages,
    debouncedSetSearch,
    setSearchBy,
    setFilter,
    setFilterValue,
  } = usePagination<T>(tableData, frontendPagination);

  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    debouncedSetSearch(false, "");
    if (searchRef.current) searchRef.current.value = "";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  React.useEffect(() => {
    if (searchBy) setSearchBy(searchBy);
  }, [searchBy, setSearchBy]);

  React.useEffect(() => {
    if (filter) setFilter(filter);
  }, [filter, setFilter]);

  return (
    <Card className="p-6 flex flex-col">
      <div className="flex flex-row mb-6 items-center">
        {filter && (
          <div className="flex flex-grow flex-row items-center gap-2">
            <TagIcon className="h-6 w-6 text-base" />
            <label htmlFor="itemsPerPage" className="mr-2">
              Filtriraj po rolama:
            </label>
            <select
              name=""
              id=""
              onChange={(e) => setFilterValue(e.target.value as keyof T)}
              className="rounded-lg outline-none border border-gray-300 p-2 pr-10"
            >
              <option value="">Sve</option>
              {filterByNames
                ? Object.keys(filterByNames)
                    .map((item) => item.trim())
                    .map((itemKey) => {
                      const i = filterByNames?.[itemKey] || itemKey;

                      return (
                        <option key={itemKey} value={itemKey}>
                          {i}
                        </option>
                      );
                    })
                : filter.values.map((value) => (
                    <option key={String(value)} value={String(value)}>
                      {String(value)}
                    </option>
                  ))}
            </select>
          </div>
        )}
        <div className="w-1/4">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search"
            className="outline-none border border-gray-300 rounded-lg p-2 w-full"
            onChange={(e) => debouncedSetSearch(false, e.target.value)}
          />
        </div>
      </div>
      <table className="table-fixed">
        <thead>
          <tr className="text-left text-white bg-base">
            {columnNames
              ? Object.keys(tableData[0])
                  .filter((key) => key !== "id")
                  .map((key) => (
                    <th
                      key={key}
                      className={`${
                        itemsPerPage < 20 ? "py-4" : "py-2"
                      } pl-2 2xl:pr-20 xl:pr-10 pr-2 font-semibold w-20`}
                    >
                      {columnNames[key as keyof T]}
                    </th>
                  ))
              : Object.keys(tableData[0])
                  .filter((key) => key !== "id")
                  .map((key) => (
                    <th
                      key={key}
                      className={`${
                        itemsPerPage < 20 ? "py-4" : "py-2"
                      } pl-2 2xl:pr-20 xl:pr-10 pr-2 font-semibold w-20`}
                    >
                      {firstLetterUppercase(key, "camelCase")}
                    </th>
                  ))}
            {actions && (
              <th
                className={`${itemsPerPage < 20 ? "py-4" : "py-2"} pl-2 2xl:pr-20 xl:pr-10 pr-2 font-semibold w-20`}
              ></th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData &&
            // eslint-disable-next-line sonarjs/cognitive-complexity
            paginatedData.map((item, index) => (
              <tr key={item.id} className="border-b">
                {Object.keys(item)
                  .filter((key) => key !== "id")
                  .map((key) => (
                    <td
                      key={key}
                      className={`${itemsPerPage < 20 ? "py-4" : "py-2"} pl-2 2xl:pr-20 xl:pr-10 pr-2 truncate ${
                        index % 2 == 0 ? "" : "bg-gray-100"
                      }`}
                    >
                      {(() => {
                        if (Array.isArray(item[key as keyof T]) && commaSeparatedFilter && filterByNames) {
                          const contained = String(item[key as keyof T]).split(",");
                          return Object.keys(filterByNames)
                            .map((item) => item.trim())
                            .map((itemKey) => {
                              const i = filterByNames?.[itemKey] || itemKey;

                              return (
                                <div
                                  key={i}
                                  className={`${
                                    contained.some((name) => name === itemKey)
                                      ? "bg-teal-500 text-white"
                                      : "border border-gray-300 box-border"
                                  } inline mx-1 py-1 px-2 rounded-full text-sm cursor-pointer hover:opacity-70`}
                                  onClick={() => {
                                    if (commaSeparatedFilterOnClick) commaSeparatedFilterOnClick(item, itemKey);
                                  }}
                                >
                                  {i}
                                </div>
                              );
                            });
                        }

                        if (typeof item[key as keyof T] === "boolean") {
                          const value = item[key as keyof T];
                          return value ? (
                            <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <XCircleIcon className="w-6 h-6 text-red-400" />
                          );
                        }

                        const value = String(item[key as keyof T]);
                        return <div className={value.length > 10 ? "truncate w-40" : "w-fit"}>{value}</div>;
                      })()}
                    </td>
                  ))}
                <td
                  className={`${itemsPerPage < 20 ? "py-3" : "py-1"} pl-2 pr-2 flex flex-row gap-2 ${
                    index % 2 == 0 ? "" : "bg-gray-100"
                  }`}
                >
                  {actions &&
                    actions.map((action) => <React.Fragment key={_.uniqueId()}>{action(item)}</React.Fragment>)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination {...{ currentPage, setCurrentPage, itemsPerPage, handleItemsPerPageChange, totalPages }} />
    </Card>
  );
}

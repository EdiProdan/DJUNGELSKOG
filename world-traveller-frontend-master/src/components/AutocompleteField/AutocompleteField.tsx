import React from "react";

import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";

import { useDebounce } from "../../hook/useDebounce";

export type AutocompleteFieldProps<T> = {
  data: T[];
  filterBy: keyof T;
  id: keyof T;
  label?: string;
  value: T;
  onChange: (item: T) => void;
  className?: string;
};

export default function AutocompleteField<T extends object>({
  data,
  filterBy,
  label,
  id,
  value,
  onChange,
  className,
}: AutocompleteFieldProps<T>) {
  const [query, setQuery] = React.useState("");

  const debouncedSetQuery = useDebounce(setQuery, 300);

  const filtered =
    query === ""
      ? data
      : data.filter((item) => {
          return String(item[filterBy]).toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={value || ({ [id]: "", [filterBy]: "" } as T)}
      onChange={(item: T) => onChange(item)}
      className={className}
    >
      {label && <Combobox.Label className="block text-sm font-medium text-gray-700">{label}</Combobox.Label>}
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => debouncedSetQuery(false, event.target.value)}
          displayValue={(item: T) => String(item[filterBy])}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filtered.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filtered.map((item) => (
              <Combobox.Option
                key={String(item[id])}
                value={item}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-9 ${
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  }`
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={`block truncate ${selected && "font-semibold"}`}>{String(item[filterBy])}</span>
                    {selected && (
                      <span
                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                          active ? "text-white" : "text-indigo-600"
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

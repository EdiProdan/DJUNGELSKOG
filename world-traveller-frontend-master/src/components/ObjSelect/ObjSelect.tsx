import React, { Fragment } from "react";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";

interface ObjSelectProps {
  name: string;
  className?: string;
  label?: string;
  vals: { key: string | number; value: string | number }[];
  onChange?: (value: { key: string | number; value: string | number }) => void;
}

export default function ObjSelect({ name, className, label, vals, onChange }: ObjSelectProps) {
  const [option, setOption] = React.useState<{ key: string | number; value: string | number } | undefined>();
  const handleOnChange = React.useCallback(
    (listboxKey: string | number) => {
      const pair = vals.find((val) => val.key === listboxKey);
      if (pair) {
        setOption(pair);
        if (onChange) onChange(pair);
      }
    },
    [onChange, vals]
  );
  return (
    <div className={`relative ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <Listbox name={name as string} value={option?.value} onChange={handleOnChange}>
        <div className="border-gray-300 rounded-md border relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{option?.value}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {vals.map((value) => (
                <Listbox.Option
                  key={value.key}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={value.key}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                        {value.value}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

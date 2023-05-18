import React from "react";

import { Tab } from "@headlessui/react";

export enum WishlistEntryStateIndex {
  ONGOING,
  COMPLETED,
  EXPIRED,
}

export enum WishlistEntryState {
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
}

export type WishlistTabsProps = {
  onChange?: (index: WishlistEntryStateIndex) => void;
};
const tabs = ["U tijeku", "Odrađeno", "Zaboravljeno"];

const tabClassName =
  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2";
export const WishlistTabs = ({ onChange }: WishlistTabsProps) => {
  const [index, setIndex] = React.useState<number>(0);

  const handleTabChange = React.useCallback(
    (idx: number) => {
      setIndex(idx);
      if (onChange) onChange(idx);
    },
    [onChange]
  );

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md px-auto py-5 sm:px-0">
        <Tab.Group onChange={handleTabChange} selectedIndex={index}>
          <Tab.List className="flex space-x-1 rounded-xl bg-transparent	 p-1">
            {tabs.map((tab, idx) => (
              <Tab
                key={tab}
                className={`${tabClassName} ${
                  idx === index
                    ? "bg-indigo-700 shadow text-white"
                    : "text-black hover:bg-white/[0.12] hover:text-indigo-400"
                }`}
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    </div>
  );
};

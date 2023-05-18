import React from "react";

import { Switch } from "@headlessui/react";
import { useFormikContext } from "formik";
import _ from "lodash";

interface SwitchProps {
  name: string;
}

export default function SwitchComponent<T>({ name }: SwitchProps) {
  const { values, setFieldValue } = useFormikContext<T>();

  const val = _.get(values, name);

  return (
    <div className="">
      <Switch
        checked={val}
        onChange={(e: boolean) => setFieldValue(name, e)}
        className={`${
          val ? "bg-base" : "bg-slate-300"
        } relative inline-flex w-[59px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-`}
      >
        <span
          aria-hidden="true"
          className={`${val ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
}

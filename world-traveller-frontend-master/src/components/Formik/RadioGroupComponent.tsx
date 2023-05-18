import React from "react";

import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { useFormikContext } from "formik";
import _ from "lodash";

interface RadioGroupProps {
  name: string;
  className?: string;
  list: string[];
  label?: string;
}

export default function RadioGroupComponent({ name, className, list, label }: RadioGroupProps) {
  const { values, setFieldValue } = useFormikContext();

  const val = _.get(values, name);

  return (
    <div className={`py-4 ${className}`}>
      <div className="">
        <RadioGroup value={val} onChange={(e) => setFieldValue(name, e)}>
          <RadioGroup.Label className="">{label}</RadioGroup.Label>
          <div className="flex w-full max-w-max">
            {list.map((item) => (
              <RadioGroup.Option
                key={item}
                value={item}
                className={({ active, checked }) =>
                  `${active ? "ring-white ring-opacity-60 ring-offset-sky-300" : ""}
                  ${checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-gray-200"}
                    flex cursor-pointer rounded-lg px-2 py-2 shadow-md focus:outline-none w-60 mr-5`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium ${checked ? "text-white" : "text-gray-900"}`}
                          >
                            {item}
                          </RadioGroup.Label>
                        </div>
                      </div>
                      {checked && (
                        <div className="text-white">
                          <CheckCircleIcon className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

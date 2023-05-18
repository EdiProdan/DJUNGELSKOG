import React from "react";

import { Field, FormikErrors, FormikTouched } from "formik";
import _ from "lodash";

export type FormikTextInputType = "text" | "password" | "number";

interface TextInputProps<T> {
  name: string;
  className?: string;
  disabled?: boolean;
  errors?: FormikErrors<T>;
  type?: FormikTextInputType;
  label?: string;
  placeholder?: string;
  touched?: FormikTouched<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate?: (...args: any) => string | undefined;
}

export default function TextInput<T>({
  name,
  className,
  disabled,
  errors,
  type,
  label,
  placeholder,
  touched,
  validate,
}: TextInputProps<T>) {
  const additionalProps = {
    ...(validate && { validate }),
    disabled,
  };

  const hasErrors = errors && _.get(errors, name) && touched && _.get(touched, name);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label htmlFor={name as string} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md">
        <Field
          type={type}
          name={name}
          placeholder={placeholder}
          className={
            (hasErrors ? "text-red-500 bg-red-50 border-red-400 shadow-sm" : "border-gray-300 rounded-md") +
            "block w-full px-3 py-2 placeholder-gray-400 outline-none sm:text-sm rounded-md border" +
            (disabled ? " bg-gray-100" : "")
          }
          {...additionalProps}
        />
        {hasErrors && <p className="text-red-500 text-sm">{_.get(errors, name) as string}</p>}
      </div>
    </div>
  );
}

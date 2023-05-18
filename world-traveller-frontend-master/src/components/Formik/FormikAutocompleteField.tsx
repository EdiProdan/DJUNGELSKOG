import React from "react";

import { FormikErrors, FormikTouched, useFormikContext } from "formik";
import _ from "lodash";

import AutocompleteField, { AutocompleteFieldProps } from "../AutocompleteField/AutocompleteField";

export type FormikAutocompleteFieldProps<T, R> = AutocompleteFieldProps<T> & {
  name: string;
  errors?: FormikErrors<R>;
  touched?: FormikTouched<R>;
};

export default function FormikAutocompleteField<T extends object, R>({
  data,
  filterBy,
  id,
  onChange,
  label,
  value,
  name,
  errors,
  touched,
}: FormikAutocompleteFieldProps<T, R>) {
  const { setFieldValue } = useFormikContext<R>();

  const hasErrors = errors && _.get(errors, name) && touched && _.get(touched, name);

  return (
    <div>
      <AutocompleteField<T>
        data={data}
        filterBy={filterBy}
        id={id}
        onChange={(item) => {
          onChange?.(item);
          setFieldValue(name, item[id]);
        }}
        value={value}
        label={label}
      />
      {hasErrors && <p className="text-red-500 text-sm">{_.get(errors, name) as string}</p>}
    </div>
  );
}

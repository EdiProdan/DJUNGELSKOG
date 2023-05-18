import React from "react";

import { useFormikContext } from "formik";
import toast from "react-hot-toast";

import { ErrorResponse } from "../../api/types";

type FormWrapperProps = {
  children: React.ReactNode;
  isError: boolean;
};

export default function FormWrapper<T>({ children, isError }: FormWrapperProps) {
  const { setSubmitting } = useFormikContext<T>();

  React.useEffect(() => {
    if (!isError) return;

    setSubmitting(false);
  }, [isError, setSubmitting]);

  return <>{children}</>;
}

export function parseError(err: string) {
  // The error passed as a prop from the onError function is a constant and has to be reassigned for JSON.parse() to work
  const error = (err + "").replace("Error: ", "").trim();

  const errorResponse = JSON.parse(error) as ErrorResponse;
  if (!errorResponse.validationErrors) {
    toast.error(errorResponse.message || "Error");
  }

  Object.keys(errorResponse.validationErrors).forEach((key) => {
    const message = errorResponse.validationErrors[key].reduce((acc, s) => acc.concat("," + s)).trim();
    toast.error(message.length > 0 ? `${key} - ${message}` : "Error");
  });
}

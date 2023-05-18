import React from "react";

import { CalendarIcon } from "@heroicons/react/outline";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const DatePickerForm = (props: ReactDatePickerProps) => {
  const [startDate, setStartDate] = React.useState(new Date());

  return (
    <div className="relative border border-gray-300 rounded-lg">
      <DatePicker
        {...props}
        selected={startDate}
        onChange={(date, event) => {
          setStartDate(date as Date);
          if (props.onChange) props.onChange(date, event);
        }}
        className="border-none rounded-lg"
      />
      <CalendarIcon className="absolute h-8 w-8 text-base right-0 top-0 mt-1 mr-2" />
    </div>
  );
};

export default DatePickerForm;

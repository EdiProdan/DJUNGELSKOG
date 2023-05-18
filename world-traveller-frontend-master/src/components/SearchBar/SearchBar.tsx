import React from "react";

export type SearchBarProps = {
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const inputClassName = "h-10 pl-3 py-6 text-black rounded-full border-1 bg-white w-full drop-shadow-xl";

export default function SearchBar({ onChange, placeholder, className }: SearchBarProps) {
  const [value, setValue] = React.useState("");

  const handleOnChange = React.useCallback(
    (evt: React.BaseSyntheticEvent) => {
      setValue(evt.target.value as string);
      if (onChange) onChange(evt.target.value);
    },
    [onChange]
  );

  return (
    <div className={className}>
      <input className={inputClassName} onChange={handleOnChange} value={value} placeholder={placeholder}></input>
    </div>
  );
}

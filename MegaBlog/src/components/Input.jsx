import React from "react";

const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  id,
  className = "",
  disabled = false,
  required = false,
  ...rest
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      disabled={disabled}
      required={required}
      className={`border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...rest}
    />
  );
};

export default Input;

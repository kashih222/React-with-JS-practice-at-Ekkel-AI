import React from "react";

const Button = ({
  children,
  type = "button",
  bgColor = "bg-yellow-400",
  textColor = "text-white",
  className = "",
  disabled = false,
  loading = false,
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${bgColor} ${textColor}
        ${disabled || loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}
        ${className}
      `}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;

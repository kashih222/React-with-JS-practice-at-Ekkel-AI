import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder = "",
      error,
      isValid,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium  text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            placeholder={placeholder}
            className={`w-full rounded-md bg-white border px-3 py-2 outline-none transition
              ${
                error
                  ? "border-red-500 focus:ring-red-400"
                  : isValid
                    ? "border-green-500 focus:ring-green-400"
                    : "border-gray-300 focus:ring-blue-400"
              }
              focus:ring-2 ${className}`}
            {...rest}
          />

          {/* Show / Hide Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <Eye/> : <EyeOff/>}
            </button>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

export default Input;

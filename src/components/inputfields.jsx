import React from "react";

const CustomTextField = ({
  error,
  helperText,
  touched,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col mt-2 ${className}`}>
      <input
        {...props}
        className={`bg-gray-50 border ${
          error && touched ? "border-red-500" : "border-gray-300"
        } text-sm rounded-lg p-2 focus:ring-primary-600 font-medium focus:border-primary-600 bg-gray-700 text-white block w-full`}
      />
      {touched && helperText && (
        <span
          className={`text-sm ${
            error ? "text-red-500" : "text-gray-500"
          }`}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default CustomTextField;

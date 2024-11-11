import React from "react";

const CustomButton = ({ onClick, className, name }) => {
  return (
    <button
      onClick={onClick}
      className={`text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center transition duration-200 ${className}`}
    >
      {name}
    </button>
  );
};

export default CustomButton;

export const IconButton = ({ onClick, className, children }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`text-gray-500 bg-primary-600 hover:text-red-700 rounded-md p-2  ${className}`}
    >
      {children}
    </button>
  );
};

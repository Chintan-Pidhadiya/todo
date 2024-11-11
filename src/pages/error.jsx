import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("loggingUser");

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate("/todolist"); // Navigate to home page if authenticated
    } else {
      navigate("/login"); // Navigate to login page if not authenticated
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Oops! Page not found.</p>
      <p className="text-base mt-2">
        The page you are looking for does not exist.
      </p>

      <button
        onClick={handleGoHome}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;

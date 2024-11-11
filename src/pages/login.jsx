import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomTextField from "../components/inputfields";

const Login = () => {
  // State for loading, notification message
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Navigate hook for redirection
  const navigate = useNavigate();

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Redirect if user is already logged in
  useEffect(() => {
    const loggedUser = localStorage.getItem("loggingUser");
    if (loggedUser) navigate("/todolist");
  }, [navigate]);

  // Handle form submission
  const handleSubmit = (values) => {
    setLoading(true);
    const allUsers = JSON.parse(localStorage.getItem("userData") || "[]");
    const user = allUsers.find((user) => user.email === values.email);

    if (user) {
      if (user.password === values.password) {
        localStorage.setItem("loggingUser", JSON.stringify(user));
        setNotification("Logged in successfully!");
        navigate("/todolist");
      } else {
        setNotification("Password is incorrect.");
      }
    } else {
      setNotification("User not found. Please create an account first.");
    }

    setLoading(false);
    setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
  };

  return (
    <section className="bg-gray-900 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Form Container */}
      <div className="w-full max-w-md p-6 bg-gray-800 text-white rounded-lg shadow-md border border-gray-700 sm:max-w-xs md:max-w-xs lg:max-w-sm">
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6 sm:text-3xl">Login..!</h1>
        
        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleBlur, handleChange, values }) => (
            <Form className="space-y-4">
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block  text-sm font-medium text-white">
                  Your email
                </label>
                <CustomTextField
                  name="email"
                  type="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  placeholder="name@company.com"
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block  text-sm font-medium text-white">
                  Password
                </label>
                <CustomTextField
                  name="password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  placeholder="••••••••"
                />
                {touched.password && errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium text-sm transition sm:text-base"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Sign Up Link */}
              <p className="text-sm text-center text-gray-500 mt-4">
                Don’t have an account yet?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline">
                  Sign up
                </Link>
              </p>
            </Form>
          )}
        </Formik>

        {/* Notification Snackbar */}
        {notification && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md text-sm sm:text-base">
            {notification}
          </div>
        )}
      </div>
    </section>
  );
};

export default Login;

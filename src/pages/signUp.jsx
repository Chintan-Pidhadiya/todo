import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomTextField from "../components/inputfields";

const SignUp = () => {
  // State management for loading and snackbar notifications
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isAccountCreated, setIsAccountCreated] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  // Initial form values
  const initialValues = {
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    password: Yup.string()
      .min(8)
      .max(30)
      .matches(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/,
        "Password must contain at least one uppercase letter, one number, and one special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Function to handle form submission
  const handleSubmit = (values) => {
    setLoading(true); // Set loading state to true

    // Retrieve existing users from local storage
    const existingUser = JSON.parse(localStorage.getItem("userData") || "[]");

    // Check if the email already exists in the existing user data
    const isEmail = existingUser.some((user) => user.email === values.email);

    // If email exists, show a snackbar message and reset loading
    if (isEmail) {
      setLoading(false);
      setSnackbarMessage("Email already in use. Please use a different email.");
      setOpenSnackbar(true);
    } else {
      // If email is new, add the user data to local storage
      existingUser.push(values);
      localStorage.setItem("userData", JSON.stringify(existingUser));

      // Show success message and navigate to login page
      setLoading(false);
      setSnackbarMessage("Account created successfully!");
      setOpenSnackbar(true);
      navigate("/login");
      setIsAccountCreated(true);
    }
  };

  // Function to handle snackbar close event
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (isAccountCreated) {
      navigate("/login");
    }
  }, [isAccountCreated, navigate]); // Dependencies

  return (
    <section className="bg-gray-900 min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-md p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-white mb-6">Create Account</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleBlur, handleChange, values }) => (
            <Form>
              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm text-white">
                  Name
                </label>
                <CustomTextField
                  name="name"
                  type="text"
                  onBlur={handleBlur}
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                />
                <div className="text-red-500 text-sm">
                  {touched.name && errors.name}
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm text-white">
                  Email
                </label>
                <CustomTextField
                  name="email"
                  type="email"
                  onBlur={handleBlur}
                  value={values.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                />
                <div className="text-red-500 text-sm">
                  {touched.email && errors.email}
                </div>
              </div>

              {/* Mobile Number Field */}
              <div className="mb-4">
                <label htmlFor="mobile" className="block text-sm text-white">
                  Mobile Number
                </label>
                <CustomTextField
                  name="mobile"
                  type="tel"
                  placeholder="1234567890"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div className="text-red-500 text-sm">
                  {touched.mobile && errors.mobile}
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm text-white">
                  Password
                </label>
                <CustomTextField
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div className="text-red-500 text-sm">
                  {touched.password && errors.password}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm text-white"
                >
                  Confirm Password
                </label>
                <CustomTextField
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <div className="text-red-500 text-sm">
                  {touched.confirmPassword && errors.confirmPassword}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
               className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium text-sm transition sm:text-base"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>

              {/* Link to login page */}
              <p className="text-sm text-center text-gray-500 mt-4">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Login
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </div>

      {/* Snackbar for notifications */}
      {openSnackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
          <span>{snackbarMessage}</span>
        </div>
      )}
    </section>
  );
};

export default SignUp;

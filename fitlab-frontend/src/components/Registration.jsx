import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "trainee",
    profileDetails: {
      age: "",
      weight: "",
      height: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one number and one special character";
    }

    // Trainee-specific validations
    if (formData.role === "trainee") {
      const { age, weight, height } = formData.profileDetails;

      if (!age || age < 1 || age > 119 || !Number.isInteger(Number(age))) {
        newErrors.age = "Age must be a positive integer between 1 and 119";
      }

      if (!weight || weight < 1 || weight > 499) {
        newErrors.weight = "Weight must be between 1 and 499 kg";
      }

      if (!height || height < 1 || height > 299) {
        newErrors.height = "Height must be between 1 and 299 cm";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === "trainee" && {
          profileDetails: {
            age: Number(formData.profileDetails.age),
            weight: Number(formData.profileDetails.weight),
            height: Number(formData.profileDetails.height),
          },
        }),
      };

      const response = await axios.post("/api/register", payload);

      // Navigate to confirmation page with role
      navigate("/confirmation", {
        state: { role: response.data.role },
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach((err) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ server: "Registration failed. Please try again." });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("profileDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        profileDetails: {
          ...prev.profileDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Register as
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="trainee">Trainee</option>
                <option value="trainer">Trainer</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Trainee-specific fields */}
            {formData.role === "trainee" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    name="profileDetails.age"
                    value={formData.profileDetails.age}
                    onChange={handleChange}
                    autoComplete="off"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your age"
                  />
                  {errors.age && (
                    <p className="mt-2 text-sm text-red-600">{errors.age}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="profileDetails.weight"
                    value={formData.profileDetails.weight}
                    onChange={handleChange}
                    autoComplete="off"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your weight in kg"
                  />
                  {errors.weight && (
                    <p className="mt-2 text-sm text-red-600">{errors.weight}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="profileDetails.height"
                    value={formData.profileDetails.height}
                    onChange={handleChange}
                    autoComplete="off"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your height in cm"
                  />
                  {errors.height && (
                    <p className="mt-2 text-sm text-red-600">{errors.height}</p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {success}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Server Error */}
            {errors.server && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {errors.server}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;

import { useLocation, Navigate } from "react-router-dom";

const Confirmation = () => {
  const location = useLocation();
  const { role } = location.state || {};

  if (!role) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 6L9 17l-5-5m36-3l-11 11-5-5"
              />
            </svg>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Registration successful!
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

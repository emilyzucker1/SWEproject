// src/pages/ForgotPassword.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { forgotPassword } from "../firebase/authentication/passwordauth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      forgotPassword(email, navigate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center pt-24">
      <div className="bg-white shadow-xl rounded-2xl w-[90%] max-w-sm p-6">
        <h1 className="text-2xl font-semibold text-center text-blue-700 mb-6">
          Forgot Password 🔑
        </h1>

        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <form className="space-y-4 flex flex-col items-center" onSubmit={handleSubmit}> 
          <div className="w-4/5">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
              onChange={handleEmail}
              value={email}
            />
          </div>

          <button
            type="submit"
            className="w-3/5 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg font-medium text-sm transition mt-2"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-gray-500">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

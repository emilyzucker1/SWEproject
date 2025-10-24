// src/pages/ForgotPassword.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
    <div className="min-h-screen bg-pink-200 flex flex-col items-center justify-start pt-[25vh]">
      <div className="bg-white shadow-lg rounded-2xl w-[80%] max-w-lg p-10 text-center">
        <h1 className="text-4xl font-bold text-pink-700 mb-8">
          Forgot Password 🔑
        </h1>

        <p className="text-lg text-gray-700 mb-10 leading-snug max-w-md mx-auto">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <form
          className="flex flex-col items-center space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="w-[80%] text-left">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-400 focus:ring-2 focus:ring-pink-400 outline-none text-xl text-gray-800 tracking-wide"
              onChange={handleEmail}
              value={email}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg py-2 px-6 rounded-lg shadow-md transition"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-8 text-base text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-pink-600 hover:underline font-semibold">
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}


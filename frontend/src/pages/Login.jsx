// src/pages/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { loginUserwithEmailandPassword } from "../firebase/authentication/emailauth";
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUserwithEmailandPassword(email, password, navigate)
  };


  return (
    <div
      className="min-h-screen flex flex-col items-center pt-24 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('https://images.unsplash.com/photo-1603570417037-8ad746e7b4be?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="bg-white shadow-xl rounded-2xl w-[90%] max-w-sm p-6">
        <h1 className="text-2xl font-semibold text-center text-blue-700 mb-6">
          Welcome Back 👋
        </h1>

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

          <div className="w-4/5">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
              onChange={handlePassword}
              value={password}
            />
          </div>

          <div className="flex items-center justify-between w-4/5 text-xs mt-1">
            <label className="flex items-center space-x-1">
              <input type="checkbox" className="accent-blue-600" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot" className="text-blue-600 hover:underline">
              Forgot?
            </Link>
          </div>

          <button
            type="submit"
            className="w-3/5 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg font-medium text-sm transition mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="border border-gray-300 rounded-lg px-4 py-1.5 flex items-center gap-2 hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="object-contain"
              style={{ width: "18px", height: "18px" }}
            />
            <span className="text-gray-700 text-sm">Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}



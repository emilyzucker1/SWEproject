// src/pages/Register.jsx
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { registerUser } from "../firebase/authentication/emailauth/index";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function handleName(e) {
    setName(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(name, email, password, setIsLoading, navigate);
  };

  if (isLoading){
    return <p>Loading...</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center pt-24">
      <div className="bg-white shadow-xl rounded-2xl w-[90%] max-w-sm p-6">
        <h1 className="text-2xl font-semibold text-center text-blue-700 mb-6">
          Create an Account ✨
        </h1>

        <form className="space-y-4 flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="w-4/5">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
              onChange={handleName}
              value={name}
            />
          </div>

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

          <button
            type="submit"
            className="w-3/5 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg font-medium text-sm transition mt-2"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

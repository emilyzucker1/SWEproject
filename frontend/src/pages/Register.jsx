// src/pages/Register.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../firebase/authentication/emailauth/index";
import { saveUserToBackend } from "../api";
import boyImg from "../assets/aisatsu_kodomo_zenshin_boy.png";
import girlImg from "../assets/aisatsu_kodomo_zenshin_girl.png";

export default function Register() {
  console.log('register component')
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("submit ran")

    try {
      const userCredential = await registerUser(
        name,
        email,
        password,
        setIsLoading
      );
      const firebaseUser = userCredential?.user;

      if (firebaseUser) {

        console.log("firebase check")
        await saveUserToBackend({
          name,
          email,
          firebaseUid: firebaseUser.uid,
        });
      }

      navigate("/main");
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-200">
        <p className="text-lg text-pink-700 font-medium animate-pulse">
          Creating your account...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-pink-200" />

      <div className="w-1/2 h-full flex flex-col justify-center items-center bg-white/90 backdrop-blur-sm shadow-2xl p-16 rounded-r-[50px] z-10">
        <h1 className="text-6xl font-extrabold text-pink-700 mb-12 text-center drop-shadow-md">
          Create Account 💌
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 border border-red-400 rounded-lg text-xl p-3 text-center mb-4 w-3/5">
            {error}
          </div>
        )}

        <form
          className="space-y-10 flex flex-col items-center w-full"
          onSubmit={handleSubmit}
        >
          <div className="w-3/5 flex flex-col items-start">
            <label className="block text-3xl font-semibold text-gray-700 mb-3">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-5 py-4 rounded-2xl border-[6px] border-gray-300 focus:ring-4 focus:ring-pink-400 outline-none text-3xl font-medium"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          <div className="w-3/5 flex flex-col items-start">
            <label className="block text-3xl font-semibold text-gray-700 mb-3">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-5 py-4 rounded-2xl border-[6px] border-gray-300 focus:ring-4 focus:ring-pink-400 outline-none text-3xl font-medium"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className="w-3/5 flex flex-col items-start">
            <label className="block text-3xl font-semibold text-gray-700 mb-3">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl border-[6px] border-gray-300 focus:ring-4 focus:ring-pink-400 outline-none text-3xl font-medium"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <button
            type="submit"
            className="w-2/5 bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-2xl font-bold text-3xl transition mt-6 shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-10 text-gray-700 text-2xl font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 hover:underline font-bold">
            Sign in
          </Link>
        </div>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center text-center px-8 space-y-8">
        <h2 className="text-6xl font-extrabold text-white drop-shadow-md">
          Welcome to GifGiving 🎁
        </h2>
        <p className="text-white text-2xl leading-relaxed max-w-xl font-medium">
          GifGiving is a fun, creative space where you can share positive and
          motivational GIFs with friends. Join our community and spread smiles
          with just one click!
        </p>
        <div className="flex space-x-8 mt-6">
          <img
            src={boyImg}
            alt="boy greeting"
            className="w-40 h-auto drop-shadow-xl"
          />
          <img
            src={girlImg}
            alt="girl greeting"
            className="w-40 h-auto drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}

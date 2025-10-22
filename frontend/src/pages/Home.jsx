// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  console.log(import.meta.env.VITE_FIREBASE_API_KEY);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center w-full max-w-md">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to GifGiving 🎁</h1>
        <p className="text-gray-600 mb-8">
          A fun way to share and discover motivational GIFs with friends.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/744/744502.png"
          alt="GIF Icon"
          className="w-24 h-24 mx-auto mb-8"
        />

        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { loginUserwithEmailandPassword } from "../firebase/authentication/emailauth";
import { useState } from "react";
import { motion } from "framer-motion";
import bgImage from "../assets/online_nomikai_man.png";

import img1 from "../assets/shopping_game_atari.png";
import img2 from "../assets/pose_hoppe_heart_schoolgirl.png";
import img3 from "../assets/monster05.png";
import img4 from "../assets/monster08.png";
import img5 from "../assets/shinnen_aisatsu_hebi_medousa.png";
import img6 from "../assets/jirai_peace.png";
import img7 from "../assets/jirai_gorogoro.png";

const spriteImages = [img1, img2, img3, img4, img5, img6, img7];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUserwithEmailandPassword(email, password, navigate);
  };

  const zones = [
    { x: [5, 95], y: [3, 12] },   // top band
    { x: [5, 95], y: [85, 95] },  // bottom band
    { x: [3, 7], y: [10, 90] },   // left edge
    { x: [93, 97], y: [10, 90] }, // right edge
  ];

  const placements = spriteImages.map((_, i) => {
    const z = zones[i % zones.length];
    const left = z.x[0] + Math.random() * (z.x[1] - z.x[0]);
    const top = z.y[0] + Math.random() * (z.y[1] - z.y[0]);
    return { left, top };
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-rose-200"/>

      {spriteImages.map((src, i) => (
        <motion.img
          key={i}
          src={src}
          alt=""
          className="absolute pointer-events-none z-0"
          style={{
            width: `${80 + Math.random() * 50}px`,
            left: `${placements[i].left}%`,
            top: `${placements[i].top}%`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 1, delay: i * 0.2 },
            y: {
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
          }}
        />
      ))}

      {/* Left illustration */}
      <div className="w-1/3 flex items-center justify-center relative z-10">
        <img src={bgImage} alt="Online Party" className="max-w-[75%] drop-shadow-2xl" />
      </div>

      {/* Right login form */}
      <div className="w-2/3 h-full bg-white/90 backdrop-blur-sm flex flex-col justify-center items-center shadow-2xl p-16 rounded-l-[50px] z-10">
        <h1 className="text-6xl font-extrabold text-blue-700 mb-12 text-center">
          Welcome Back 👋
        </h1>
        <form
          className="space-y-10 flex flex-col items-center w-full"
          onSubmit={handleSubmit}
        >
          <div className="w-3/5 flex flex-col items-start">
            <label className="block text-3xl font-semibold text-gray-700 mb-3">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-5 py-4 rounded-2xl border-[6px] border-gray-300 focus:ring-4 focus:ring-blue-400 outline-none text-3xl font-medium"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="w-3/5 flex flex-col items-start">
            <label className="block text-3xl font-semibold text-gray-700 mb-3">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl border-[6px] border-gray-300 focus:ring-4 focus:ring-blue-400 outline-none text-3xl font-medium"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="flex items-center justify-between w-3/5 text-xl mt-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-blue-600 scale-125" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <Link
              to="/forgot"
              className="text-blue-600 hover:underline font-semibold"
            >
              Forgot?
            </Link>
          </div>
          <button
            type="submit"
            className="w-2/5 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-3xl transition mt-6 shadow-lg"
          >
            Sign In
          </button>
        </form>
        <div className="text-center mt-10 text-gray-700 text-2xl font-medium">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-bold">
            Sign up
          </Link>
        </div>
        <div className="mt-10 flex justify-center">
          <button className="border-[5px] border-gray-300 rounded-2xl px-8 py-3 flex items-center gap-4 hover:bg-gray-50 transition text-2xl font-semibold">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="object-contain"
              style={{ width: "32px", height: "32px" }}
            />
            <span className="text-gray-800">Continue with Google</span>
          </button>
        </div>
      </div>
    </div> )}

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import groupImage from "../assets/group_young_world.png";
import catShadow from "../assets/asobu_cat_shadow.png";
import idolFan from "../assets/idol_fan_doutan.png";
import jiraiJump from "../assets/jirai_jump.png";
import penlightMan from "../assets/penlight_man03_yellow.png";
import penlightWoman from "../assets/penlight_woman07_pink.png";

const floatingImages = [
  { src: catShadow, position: { top: "5%", left: "10%" } },
  { src: idolFan, position: { top: "10%", right: "8%" } },
  { src: jiraiJump, position: { bottom: "10%", left: "8%" } },
  { src: penlightMan, position: { bottom: "8%", right: "12%" } },
  { src: penlightWoman, position: { top: "45%", left: "3%" } },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-6">
      {floatingImages.map((img, index) => (
        <motion.img
          key={index}
          src={img.src}
          alt=""
          className="absolute opacity-90"
          style={{
            width: "120px",
            ...img.position,
          }}
          initial={{ y: -40, opacity: 0 }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0],
            opacity: 1,
          }}
          transition={{
            delay: index * 0.2,
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative bg-white rounded-2xl shadow-xl p-10 text-center w-full max-w-md z-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Welcome to GifGiving 🎁
        </h1>
        <p className="text-gray-600 mb-8">
          A fun way to share and discover motivational GIFs with friends.
        </p>
        <motion.img
          src={groupImage}
          alt=""
          className="w-52 h-52 mx-auto mb-8 rounded-xl"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: "spring", stiffness: 200 }}
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

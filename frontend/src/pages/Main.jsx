import { useState, useEffect } from "react";
import { auth } from "../firebase/index.js";
import { onAuthStateChanged } from "firebase/auth";
import { signOutUser } from "../firebase/authentication/signout/index.js";
import { useNavigate } from "react-router-dom";
import jiraiImg from "../assets/jirai_uruuru.png";

export default function Main() {
  const [name, setName] = useState("User");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes so we get the displayName once the SDK initializes.
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      try {
        if (u) {
          const display = u.displayName || u.email || "User";
          setName(display);
          setIsLoading(false);
        } else {
          // Not signed in -> redirect to home/login
          navigate("/");
        }
      } catch (error) {
        console.error(error);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setIsLoading(true);
      navigate("/"); // ✅ 退出后回到 Home 页面
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-pink-200 pt-32">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center w-full max-w-md">
        <h1 className="text-4xl font-bold text-pink-700 mb-4">
          Welcome {name}! 🎉
        </h1>
        <p className="text-gray-700 text-xl font-medium">
          You have successfully logged in.
        </p>
        <p className="text-gray-500 mt-1">We’re so happy to see you here!</p>
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-64 bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-2xl font-bold text-2xl transition shadow-lg"
        >
          Sign Out
        </button>
      </div>

      <div className="flex flex-col items-center mt-12">
        <img
          src={jiraiImg}
          alt="Cute character crying"
          className="w-48 h-auto drop-shadow-2xl"
        />
        <p className="text-xl text-pink-700 mt-4 font-semibold">
          More amazing features coming soon ✨ 
        </p>
      </div>
    </div>
  );
}


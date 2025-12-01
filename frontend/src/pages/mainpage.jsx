import { useState } from "react";
import contactImg from "../assets/computer_income_man.png";
import envelopeImg from "../assets/bunbougu_envelope_letter.png";
import photoGirlImg from "../assets/smartphone_photo_woman_yoko.png";
import bottomCenterImg from "../assets/smartphone_camera_bijin.png";

export default function MainPage() {
  const [activeTag, setActiveTag] = useState(null);

  const tags = [
    "Funny",
    "Cute",
    "Dance",
    "Anime",
    "Meme",
    "Reaction",
    "Animals",
    "Sports",
    "Music",
    "Love",
    "Mood",
    "Food",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center pt-6 bg-gray-100">
      <div className="w-full flex justify-center mb-6">
        <div className="w-[90%] flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">Username</div>
          <div className="flex justify-center w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-[50%] border border-gray-300 rounded-full px-5 py-2 text-base bg-white shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="w-[120px]" />
        </div>
      </div>

      <div className="w-[90%] flex justify-between">
        {/* Left oval */}
        <div className="w-40 h-[520px] bg-white rounded-full border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.15)] overflow-hidden flex items-center justify-center">
          <div className="flex flex-col items-center justify-evenly w-full h-full">
            <button className="w-full text-center text-pink-700 font-semibold bg-transparent hover:text-pink-500" style={{ background: "transparent", border: "none" }}>Profile Info</button>
            <button className="w-full text-center text-pink-700 font-semibold bg-transparent hover:text-pink-500" style={{ background: "transparent", border: "none" }}>Liked ❤️</button>
            <button className="w-full text-center text-pink-700 font-semibold bg-transparent hover:text-pink-500" style={{ background: "transparent", border: "none" }}>History</button>
            <button className="w-full text-center text-pink-700 font-semibold bg-transparent hover:text-pink-500" style={{ background: "transparent", border: "none" }}>Friends</button>
            <button className="w-full text-center text-pink-700 font-semibold bg-transparent hover:text-pink-500" style={{ background: "transparent", border: "none" }}>Settings</button>
            <button className="w-full text-center text-pink-700 font-semibold bg-transparent hover:text-pink-500" style={{ background: "transparent", border: "none" }}>Log Out</button>
          </div>
        </div>

        <div className="w-[64%] flex flex-col items-center">
          <div className="flex justify-center mb-5 w-[50%]">
            <button className="w-1/2 px-4 py-2 border border-gray-300 rounded-l-full text-gray-700 font-semibold hover:text-pink-600 hover:border-pink-400">
              Recommend
            </button>
            <button className="w-1/2 px-4 py-2 border border-gray-300 rounded-r-full text-gray-700 font-semibold hover:text-pink-600 hover:border-pink-400">
              Friends / Follow
            </button>
          </div>
        </div>

        <div className="w-40 h-[520px] bg-white rounded-full border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.15)] overflow-hidden flex items-center justify-center">
          <div className="flex flex-col items-center justify-evenly w-full h-full">
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#be185d",
                textAlign: "center",
                lineHeight: "1.1",
                transform: "scaleX(0.8)",
                transformOrigin: "center",
                whiteSpace: "nowrap",
              }}
            >
              <div>Interested</div>
              <div>Tags</div>
            </div>

            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`w-full text-center text-sm font-medium bg-transparent ${
                  activeTag === tag
                    ? "text-pink-600"
                    : "text-gray-700 hover:text-pink-400"
                }`}
                style={{ background: "transparent", border: "none" }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          left: "16px",
          bottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 50,
        }}
      >
        <img src={contactImg} alt="support" style={{ width: "130px", height: "auto" }} />
        <div style={{ fontSize: "14px", color: "#374151", fontWeight: 500 }}>
          If you have any questions, please feel free to contact us.
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          right: "16px",
          bottom: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "20px",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
            You can send us feedback.
          </div>
          <img src={envelopeImg} alt="feedback" style={{ width: "80px", height: "auto" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
            You can upload your own creations.
          </div>
          <img src={photoGirlImg} alt="upload" style={{ width: "90px", height: "auto" }} />
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: "16px",
          transform: "translateX(-50%)",
          zIndex: 50,
        }}
      >
        <img
          src={bottomCenterImg}
          alt="center-bottom"
          style={{ width: "120px", height: "auto" }}
        />
      </div>
    </div>
  );
}

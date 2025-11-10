import { useState } from "react";
import bgImage from "../assets/banner18.png";

export default function MainPage() {
  const [activeTag, setActiveTag] = useState(null);
  const tags = [
    "Funny", "Cute", "Dance", "Anime", "Meme", "Reaction", "Animals",
    "Sports", "Music", "Love", "Mood", "Food"
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-6 bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {/* 顶部 */}
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

      {/* 主体 */}
      <div className="w-[90%] flex justify-between">
        {/* 左侧卡片 */}
        <div className="w-[14%] bg-white rounded-3xl shadow-lg flex flex-col justify-around items-center py-10">
          <button className="text-pink-700 font-semibold hover:text-pink-500">
            Profile Info
          </button>
          <button className="text-pink-700 font-semibold hover:text-pink-500">
            Liked ❤️
          </button>
          <button className="text-pink-700 font-semibold hover:text-pink-500">
            History
          </button>
          <button className="text-pink-700 font-semibold hover:text-pink-500">
            Friends
          </button>
          <button className="text-pink-700 font-semibold hover:text-pink-500">
            Settings
          </button>
          <button className="text-pink-700 font-semibold hover:text-pink-500">
            Log Out
          </button>
        </div>

        {/* 中间内容 */}
        <div className="w-[66%] flex flex-col items-center">
          <div className="flex justify-center mb-5 w-[50%]">
            <button className="w-1/2 px-4 py-2 border border-gray-300 rounded-l-full text-gray-700 font-semibold hover:text-pink-600 hover:border-pink-400">
              Recommend
            </button>
            <button className="w-1/2 px-4 py-2 border border-gray-300 rounded-r-full text-gray-700 font-semibold hover:text-pink-600 hover:border-pink-400">
              Friends / Follow
            </button>
          </div>

          {/* GIF 区域 */}
          <div className="w-full bg-white rounded-3xl shadow-inner p-6 grid grid-cols-5 gap-4">
            {Array(20)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
                >
                  GIF {i + 1}
                </div>
              ))}
          </div>
        </div>

        {/* 右侧标签 */}
        <div className="w-[14%] bg-white rounded-3xl shadow-lg p-5 flex flex-col">
          <h3 className="text-base font-bold text-pink-700 mb-3 text-center">
            Interested Tags
          </h3>
          <div className="flex flex-col gap-3 items-center">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`text-sm font-medium ${
                  activeTag === tag
                    ? "text-pink-600"
                    : "text-gray-700 hover:text-pink-400"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

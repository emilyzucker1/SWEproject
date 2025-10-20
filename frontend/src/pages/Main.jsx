import { useState, useEffect } from "react";

export default function Main() {
  // For now, we’ll just use a placeholder name
  const [name, setName] = useState("User");

  // Later you can replace this with actual data from login (props, context, etc.)
  useEffect(() => {
    // Example: fetch name from localStorage or API
    const storedName = localStorage.getItem("username");
    if (storedName) setName(storedName);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Welcome {name}! 🎉
        </h1>
        <p className="text-gray-600">
          You have successfully logged in. More content will appear here later.
        </p>
      </div>
    </div>
  );
}
// src/pages/TestGifPage.jsx
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const API_KEY = "AIzaSyDEbmrtnAScsPdeKg65UUe04N5q7jVClWE"
const LIMIT = 12;

export default function TestGifPage() {

  const [query, setQuery] = useState("cat caption");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGifs = async (searchTerm) => {
    try { 
      setLoading(true);
      const response = await fetch(
        `https://g.tenor.com/v2/search?q=${encodeURIComponent(searchTerm)}&key=${API_KEY}&limit=${LIMIT}`
      );
      const data = await response.json();
      setGifs(data.results || []);
    } catch (error) {
      console.error("Error fetching gifs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifs(query);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGifs(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center pt-24">
      <div className="bg-white shadow-xl rounded-2xl w-[90%] max-w-sm p-6">
        <h1 className="text-2xl font-semibold text-center text-blue-700 mb-6">
          Gif Test
        </h1>

        <p className="text-sm text-gray-600 text-center mb-6">
          Hopefully i'll have some gifs below.
        </p>

        <form onSubmit={handleSearch} className="space-y-4 flex flex-col items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search GIFs..."
          className= "w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
        />
        <button
          type="submit"
          className="w-3/5 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg font-medium text-sm transition mt-2"
        >
          Search
        </button>
        </form>

        <div className="text-center mt-5 text-sm text-gray-500">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Sign in
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {gifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.media_formats?.tinygif?.url}
                alt={gif.content_description}
                style={{ width: "100%" }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

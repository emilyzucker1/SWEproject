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

  // NEW: UI state for GIFs
  const [q, setQ] = useState("happy dance");
  const [lastGifUrl, setLastGifUrl] = useState("");
  const [gifs, setGifs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
      navigate("/");
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  // === FUNCTION 1: Generate & save a GIF ===
  const handleGenerateGif = async () => {
    setBusy(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const res = await fetch("http://localhost:5001/api/me/gifs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          q, // search term from input
          contentfilter: "low",
          media_filter: "gif,tinygif",
          locale: "en_US",
          country: "US",
          ar_range: "all",
          random: false,
          limit: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      setLastGifUrl(data.gif?.url || "");
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to generate GIF");
    } finally {
      setBusy(false);
    }
  };

  // === FUNCTION 2: Retrieve all my GIFs ===
  const handleFetchGifs = async () => {
    setBusy(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const res = await fetch("http://localhost:5001/api/me/gifs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      setGifs(Array.isArray(data.gifs) ? data.gifs : []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to fetch GIFs");
    } finally {
      setBusy(false);
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

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-64 bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-2xl font-bold text-2xl transition shadow-lg"
        >
          Sign Out
        </button>

        {/* Simple search input */}
        <div className="w-64">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Tenor…"
            className="w-full rounded-xl px-4 py-3 shadow border border-pink-300 focus:outline-none"
          />
        </div>

        {/* Button 1: Generate & save GIF */}
        <button
          type="button"
          disabled={busy}
          onClick={handleGenerateGif}
          className="w-64 bg-pink-700 hover:bg-pink-800 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition shadow"
        >
          {busy ? "Working…" : "Generate GIF"}
        </button>

        {/* Button 2: Load all my GIFs */}
        <button
          type="button"
          disabled={busy}
          onClick={handleFetchGifs}
          className="w-64 bg-white hover:bg-pink-50 disabled:opacity-60 text-pink-700 py-3 rounded-xl font-semibold transition shadow border border-pink-300"
        >
          {busy ? "Loading…" : "Load My GIFs"}
        </button>

        {/* Error */}
        {error && (
          <div className="text-red-600 text-sm mt-2">{error}</div>
        )}
      </div>

      {/* Preview last generated GIF */}
      {lastGifUrl && (
        <div className="mt-10 flex flex-col items-center">
          <p className="text-pink-700 font-semibold mb-2">Last Generated GIF</p>
          <img
            src={lastGifUrl}
            alt="Latest Tenor GIF"
            className="rounded-xl shadow-lg max-w-xs"
          />
        </div>
      )}

      {/* List of all GIFs */}
      {gifs.length > 0 && (
        <div className="mt-10 w-full max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-pink-700 mb-4">My GIFs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gifs.map((g, i) => (
              <img
                key={`${g._id || g.url}-${i}`}
                src={g.url}
                alt="saved gif"
                className="rounded-xl shadow"
              />
            ))}
          </div>
        </div>
      )}

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


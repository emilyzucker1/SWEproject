import { useState, useEffect } from "react";
import { auth } from "../firebase/index.js";
import { onAuthStateChanged } from "firebase/auth";
import { signOutUser } from "../firebase/authentication/signout/index.js";
import { useNavigate } from "react-router-dom";
import jiraiImg from "../assets/jirai_uruuru.png";

const API_BASE = "http://localhost:5001";

// --- Minimal UI Components ---
const Button = ({ children, onClick, variant = "primary", disabled, className = "" }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/20",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20",
    ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-600 border-t-pink-500"></div>
);

export default function Main() {
  const navigate = useNavigate();

  // --- State ---
  const [displayName, setDisplayName] = useState("User");
  const [authReady, setAuthReady] = useState(false);
  const [view, setView] = useState("feed"); 
  const [error, setError] = useState("");

  // GIF State
  const [query, setQuery] = useState("cyberpunk city");
  const [lastGifUrl, setLastGifUrl] = useState("");
  const [gifs, setGifs] = useState([]);
  const [gifsLoading, setGifsLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);

  // Account State
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [accountLoading, setAccountLoading] = useState(false);

  // --- Auth & Data Fetching ---

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
        return;
      }
      setDisplayName(user.displayName || user.email?.split('@')[0] || "User");
      setAuthReady(true);
    });
    return () => unsub();
  }, [navigate]);

  const getTokenOrThrow = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    return user.getIdToken();
  };

  const handleApiCall = async (fn) => {
    setError("");
    try {
      await fn();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  };

  const loadMyGifs = () => handleApiCall(async () => {
    setGifsLoading(true);
    try {
      const token = await getTokenOrThrow();
      const res = await fetch(`${API_BASE}/api/me/gifs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGifs(data.gifs || []);
    } finally {
      setGifsLoading(false);
    }
  });

  const handleGenerate = () => handleApiCall(async () => {
    setGenerateLoading(true);
    try {
      const token = await getTokenOrThrow();
      const res = await fetch(`${API_BASE}/api/me/gifs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          q: query,
          contentfilter: "low",
          media_filter: "gif,tinygif",
          limit: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.gif?.url) setLastGifUrl(data.gif.url);
      loadMyGifs();
    } finally {
      setGenerateLoading(false);
    }
  });

  const loadAccountData = () => handleApiCall(async () => {
    setAccountLoading(true);
    try {
      const token = await getTokenOrThrow();
      const [meRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const meData = await meRes.json();
      const usersData = await usersRes.json();
      
      setFollowing(meData.user?.following || []);
      setUsers(usersData.users || []);
    } finally {
      setAccountLoading(false);
    }
  });

  const handleToggleFollow = (targetId, isFollowing) => handleApiCall(async () => {
    const token = await getTokenOrThrow();
    const endpoint = `${API_BASE}/api/users/${targetId}/${isFollowing ? 'unfollow' : 'follow'}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to update follow");
    setFollowing(prev => isFollowing ? prev.filter(id => id !== targetId) : [...prev, targetId]);
  });

  // Auto-load logic
  useEffect(() => {
    if (!authReady) return;
    if (view === "feed" && gifs.length === 0) loadMyGifs();
    if (view === "account") loadAccountData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, authReady]);

  if (!authReady) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Loading...</div>;

  const currentUid = auth.currentUser?.uid;

  // --- Render ---

  return (
    
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-pink-500/30">
    {/* rest of your code below */}
      <div className="flex h-screen overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-zinc-800/50 flex items-center gap-3">
            <div className="h-8 w-8 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-lg">G</div>
            <span className="font-bold text-white tracking-tight">GifGarden</span>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { id: "feed", label: "Dashboard", icon: "⊞" },
              { id: "generate", label: "Generator", icon: "⚡" },
              { id: "account", label: "Community", icon: "☺" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  view === item.id 
                    ? "bg-zinc-800 text-white border border-zinc-700" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                <span className="text-lg opacity-80">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4 px-2">
               <img src={jiraiImg} alt="User" className="w-8 h-8 rounded-full bg-zinc-800 object-cover border border-zinc-700" />
               <div className="flex-1 min-w-0">
                 <p className="text-xs font-medium text-white truncate">{displayName}</p>
                 <p className="text-[10px] text-zinc-500 truncate">Free Plan</p>
               </div>
            </div>
            <Button variant="secondary" className="w-full text-xs" onClick={() => signOutUser().then(() => navigate("/"))}>
              Sign Out
            </Button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto relative">
          
          {/* Mobile Header */}
          <header className="md:hidden h-16 border-b border-zinc-800 flex items-center justify-between px-4 sticky top-0 bg-black/80 backdrop-blur z-20">
             <span className="font-bold text-white">GifGarden</span>
             <div className="flex gap-2">
               <button onClick={() => setView("feed")} className={`p-2 rounded ${view === 'feed' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>⊞</button>
               <button onClick={() => setView("generate")} className={`p-2 rounded ${view === 'generate' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>⚡</button>
               <button onClick={() => setView("account")} className={`p-2 rounded ${view === 'account' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>☺</button>
             </div>
          </header>

          <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
            
            {/* Header Section */}
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {view === 'feed' && "Your Dashboard"}
                  {view === 'generate' && "AI Generator"}
                  {view === 'account' && "Explore Community"}
                </h1>
                <p className="text-zinc-500 text-sm">
                  {view === 'feed' && "Manage and view your collection."}
                  {view === 'generate' && "Create something unique."}
                  {view === 'account' && "Connect with other creators."}
                </p>
              </div>
              {error && (
                <div className="px-4 py-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}
            </div>

            {/* --- VIEW: FEED --- */}
            {view === "feed" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                  <span className="text-sm font-medium text-zinc-400">Total stored</span>
                  <div className="flex gap-3">
                    <span className="text-2xl font-bold text-white">{gifs.length}</span>
                    <Button variant="ghost" className="text-xs" onClick={loadMyGifs} disabled={gifsLoading}>
                      {gifsLoading ? <Spinner/> : "↻ Refresh"}
                    </Button>
                  </div>
                </div>

                {gifs.length === 0 && !gifsLoading ? (
                   <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-2xl">
                     <p className="text-zinc-500 mb-4">Your gallery is empty.</p>
                     <Button variant="primary" onClick={() => setView("generate")}>Create your first GIF</Button>
                   </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gifs.map((g, i) => (
                      <Card key={i} className="group relative aspect-square">
                        <img src={g.url} alt="gif" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-3">
                          <span className="text-xs font-mono text-pink-400">GIF_ID_{i}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- VIEW: GENERATE --- */}
            {view === "generate" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Prompt</label>
                      <textarea 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                        rows="4"
                      />
                    </div>
                    <Button variant="primary" onClick={handleGenerate} disabled={generateLoading} className="w-full flex justify-center py-3">
                      {generateLoading ? <><Spinner /> <span className="ml-2">Processing...</span></> : "Generate Art"}
                    </Button>
                  </Card>
                  
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Recent Generation</h3>
                    {lastGifUrl ? (
                      <div className="rounded-lg overflow-hidden border border-zinc-700">
                         <img src={lastGifUrl} className="w-full h-auto" alt="Result" />
                      </div>
                    ) : (
                      <div className="h-32 flex items-center justify-center text-zinc-600 text-sm italic">
                        No recent output
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="hidden lg:block">
                  <div className="h-full bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col items-center justify-center p-8 text-center opacity-50">
                    <div className="text-6xl mb-4 grayscale opacity-20">🎨</div>
                    <h3 className="text-lg font-medium text-white">Preview Area</h3>
                    <p className="text-zinc-500 text-sm max-w-xs mt-2">Generate a GIF to see the high-resolution preview here instantly.</p>
                  </div>
                </div>
              </div>
            )}

            {/* --- VIEW: ACCOUNT --- */}
            {view === "account" && (
              <Card>
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                  <h3 className="font-medium text-white">Registered Users</h3>
                  <Button variant="ghost" onClick={loadAccountData} disabled={accountLoading}>
                    {accountLoading ? <Spinner/> : "Refresh"}
                  </Button>
                </div>
                <div className="divide-y divide-zinc-800">
                  {users.map(u => {
                    const isMe = u.id === currentUid;
                    const isFollowing = following.includes(u.id);
                    return (
                      <div key={u.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-zinc-700">
                             {u.name?.[0]?.toUpperCase() || "?"}
                           </div>
                           <div>
                             <div className="text-sm font-medium text-white flex items-center gap-2">
                               {u.name}
                               {isMe && <span className="text-[10px] bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded border border-pink-500/20">YOU</span>}
                             </div>
                             <div className="text-xs text-zinc-500">{u.email}</div>
                           </div>
                        </div>
                        {!isMe && (
                          <Button 
                            variant={isFollowing ? "secondary" : "primary"} 
                            className="text-xs py-1.5 px-3"
                            onClick={() => handleToggleFollow(u.id, isFollowing)}
                          >
                            {isFollowing ? "Unfollow" : "Follow"}
                          </Button>
                        )}
                      </div>
                    )
                  })}
                  {users.length === 0 && (
                    <div className="p-8 text-center text-zinc-500">No users found.</div>
                  )}
                </div>
              </Card>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
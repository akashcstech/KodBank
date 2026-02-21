import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import FloatingParticles from "@/components/FloatingParticles";

const FAKE_GRAPH_POINTS = [20, 35, 25, 50, 45, 60, 55, 70, 65, 80, 75, 90];

const Dashboard = () => {
  const navigate = useNavigate();
  const [displayBalance, setDisplayBalance] = useState(0);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const animRef = useRef<number>();

  const animateBalance = (target: number) => {
    const duration = 1500;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayBalance(Math.floor(from + (target - from) * eased));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      }
    };
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setDisplayBalance(0);
    animRef.current = requestAnimationFrame(tick);
  };

  const checkBalance = async () => {
    setLoading(true);
    setDisplayBalance(0);
    try {
      const res = await api.get("/balance");
      const bal = parseFloat(res.data?.balance) || 0;
      setFetched(true);
      setTimeout(() => {
        setLoading(false);
        animateBalance(bal);
      }, 1200);
    } catch (err: any) {
      setLoading(false);
      if (err?.response?.status === 401) {
        navigate("/login");
        return;
      }
      setDisplayBalance(0);
      setFetched(true);
      animateBalance(0);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await api.get("/balance");
        setUsername(res.data?.username || "");
      } catch (err: any) {
        if (err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchUsername();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // SVG path for fake graph
  const graphPath = FAKE_GRAPH_POINTS.map(
    (p, i) => `${i === 0 ? "M" : "L"} ${(i / (FAKE_GRAPH_POINTS.length - 1)) * 100} ${100 - p}`
  ).join(" ");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a0933] via-[#2a0f5c] to-[#3c1b8f] animate-gradient">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-pink-500/20 blur-3xl animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-3xl animate-blob animation-delay-4000" />

      <FloatingParticles />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-8">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 px-5 py-2.5 rounded-xl text-sm font-semibold
            bg-white/10 backdrop-blur-md border border-white/10 text-white/80
            hover:bg-red-500/20 hover:border-red-400/30 hover:text-red-300
            transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]
            active:scale-95"
        >
          Logout
        </button>

        {/* Credit Card */}
        <div className="animate-fade-in-up w-full max-w-sm">
          <div className="credit-card tilt-hover relative overflow-hidden rounded-3xl p-6 h-52 flex flex-col justify-between bg-gradient-to-br from-[#6C5CE7] via-[#8B7CF6] to-[#A29BFE] shadow-[0_8px_32px_rgba(108,92,231,0.5)]">
            {/* Shiny reflection */}
            <div className="card-shine absolute inset-0 pointer-events-none" />

            <div className="flex justify-between items-start">
              <span className="text-white/90 text-lg font-bold tracking-wider">Kodnest</span>
              <svg className="w-10 h-8 text-white/80" viewBox="0 0 48 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.6" />
                <circle cx="32" cy="16" r="14" fill="currentColor" opacity="0.4" />
              </svg>
            </div>

            {loading && (
              <div className="absolute inset-0 bg-white/10 animate-pulse rounded-3xl" />
            )}

            <div>
              <p className="text-white/70 text-xs mb-1 tracking-widest font-medium">CARD NUMBER</p>
              <p className="text-white text-lg tracking-[0.25em] font-mono">
                4567 **** **** 2345
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/60 text-[10px] tracking-wider">CARD HOLDER</p>
                <p className="text-white text-sm font-semibold">{username ? username.toUpperCase() : "Loading..."}</p>
              </div>
              <div>
                <p className="text-white/60 text-[10px] tracking-wider">EXPIRES</p>
                <p className="text-white text-sm font-semibold">12/28</p>
              </div>
            </div>
          </div>
        </div>

        {/* Balance display */}
        <div className="glass-card p-6 w-full max-w-sm text-center animate-fade-in-up-delay">
          <p className="text-muted-foreground text-sm mb-2">Available Balance</p>

          {loading ? (
            <div className="h-10 w-48 mx-auto rounded-xl bg-white/10 animate-pulse" />
          ) : (
            <p className="text-4xl font-bold text-foreground tabular-nums">
              ₹{fetched ? displayBalance.toLocaleString("en-IN") : "---"}
            </p>
          )}

          <button
            onClick={checkBalance}
            disabled={loading}
            className="btn-gradient mt-5 w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
          >
            {loading ? "Checking..." : "Check Balance"}
          </button>
        </div>

        {/* Mini graph */}
        <div className="glass-card p-5 w-full max-w-sm animate-fade-in-up-delay-2">
          <p className="text-muted-foreground text-sm mb-3">Spending Trend</p>
          <svg viewBox="0 0 100 100" className="w-full h-24" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6C5CE7" />
                <stop offset="100%" stopColor="#A29BFE" />
              </linearGradient>
              <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6C5CE7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6C5CE7" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={graphPath + " L 100 100 L 0 100 Z"}
              fill="url(#fillGrad)"
              className="graph-fill-animate"
            />
            <path
              d={graphPath}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="graph-line-animate"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

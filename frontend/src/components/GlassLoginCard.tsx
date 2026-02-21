import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";

interface Props {
  defaultTab?: "login" | "signup";
}

const GlassLoginCard = ({ defaultTab = "login" }: Props) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(defaultTab === "login");
  const [loginUsername, setLoginUsername] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await api.post("/login",
          { username: loginUsername, password }
        );
        navigate("/dashboard");
      } else {
        await api.post("/register",
          { username, email, phone, password, role: "customer" }
        );
        setIsLogin(true);
        setError("");
        setLoginUsername("");
        setPassword("");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || (isLogin ? "Login failed" : "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card tilt-hover animate-float p-8 md:p-10 w-full max-w-md">
      {/* Tab switch */}
      <div className="flex mb-8 rounded-2xl overflow-hidden border border-white/10">
        <button
          onClick={() => { setIsLogin(true); setError(""); }}
          className={`flex-1 py-3 text-sm font-semibold transition-all duration-300 ${isLogin ? "bg-white/10 text-white" : "text-white/50 hover:text-white/70"
            }`}
        >
          Login
        </button>
        <button
          onClick={() => { setIsLogin(false); setError(""); }}
          className={`flex-1 py-3 text-sm font-semibold transition-all duration-300 ${!isLogin ? "bg-white/10 text-white" : "text-white/50 hover:text-white/70"
            }`}
        >
          Sign Up
        </button>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        {isLogin ? "Enter your credentials to access your account" : "Start your journey with us today"}
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/20 border border-destructive/30 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="glass-input w-full px-4 py-3.5 text-sm"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="glass-input w-full px-4 py-3.5 text-sm"
              required
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="glass-input w-full px-4 py-3.5 text-sm"
              required
            />
          </>
        )}

        {isLogin && (
          <input
            type="text"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            placeholder="Username or Email"
            className="glass-input w-full px-4 py-3.5 text-sm"
            required
          />
        )}

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="glass-input w-full px-4 py-3.5 pr-12 text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-all duration-200"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        </div>

        {isLogin && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/60 cursor-pointer">
              <input type="checkbox" className="rounded border-white/20 bg-white/5" />
              Remember me
            </label>
            <a href="#" className="text-primary hover:underline">
              Forgot Password?
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
        >
          {loading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Login" : "Register")}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/40 text-xs">or continue with</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="mt-4">
        <button className="btn-outline-glass w-full py-3 text-sm font-medium flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
      </div>
    </div>
  );
};

export default GlassLoginCard;

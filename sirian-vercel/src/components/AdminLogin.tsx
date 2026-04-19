import { useState } from "react";
import { motion } from "framer-motion";
import { login } from "@/lib/adminAuth";

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (login(password)) {
        onSuccess();
      } else {
        setError(true);
        setLoading(false);
        setPassword("");
      }
    }, 500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#000" }}
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="font-black text-4xl text-white"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Adam<span style={{ color: "#f97316" }}>.</span>
          </h1>
          <p
            className="text-gray-600 text-xs mt-2 tracking-widest uppercase"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Admin Access
          </p>
        </div>

        <div
          className="p-8 rounded-[20px]"
          style={{
            background: "#0d0d0d",
            border: "1px solid rgba(249,115,22,0.15)",
            boxShadow: "0 0 60px rgba(249,115,22,0.06)",
          }}
        >
          <h2
            className="text-white font-bold text-lg mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Welcome back
          </h2>
          <p
            className="text-gray-600 text-xs mb-8"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Enter your password to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                className="block text-xs font-semibold text-gray-500 tracking-widest uppercase mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200"
                style={{
                  background: "#111",
                  border: error
                    ? "1px solid rgba(239,68,68,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: error ? "0 0 15px rgba(239,68,68,0.15)" : "none",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(249,115,22,0.4)";
                  e.target.style.boxShadow = "0 0 15px rgba(249,115,22,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.border = error
                    ? "1px solid rgba(239,68,68,0.5)"
                    : "1px solid rgba(255,255,255,0.08)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-2"
                  style={{ color: "#ef4444", fontFamily: "'Poppins', sans-serif" }}
                >
                  Incorrect password. Please try again.
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ borderRadius: "12px", fontFamily: "'Poppins', sans-serif" }}
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Access Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        <p
          className="text-center text-gray-800 text-xs mt-6"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Default password: sirian2025
        </p>
      </motion.div>
    </div>
  );
}

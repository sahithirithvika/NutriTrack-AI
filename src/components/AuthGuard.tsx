"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { HeartPulse, Key, User, ArrowRight, Leaf, Shield, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const features = [
  { icon: Shield, title: "Secure & Private", desc: "End-to-end encrypted health records" },
  { icon: Activity, title: "AI-Powered Insights", desc: "WHO-standard growth analytics" },
  { icon: Leaf, title: "Community Health", desc: "Serving 1000+ Anganwadi centers" },
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const currentUser = useAppStore(state => state.currentUser);
  const login = useAppStore(state => state.login);
  const childrenDb = useAppStore(state => state.children);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) { toast.error("Please enter both fields."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const cleanId = userId.toLowerCase().trim();
    if (cleanId === "admin" && password === "password123") {
      login("admin");
      toast.success("Welcome back, Admin");
      return;
    }
    const child = childrenDb.find(c => c.id === cleanId);
    if (child && password === child.password) {
      login(child.id);
      toast.success(`Welcome, Parent of ${child.name}`);
      return;
    }
    setLoading(false);
    toast.error("Invalid credentials. Try admin / password123");
  };

  if (currentUser) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">

      {/* ── LEFT PANEL — Brand ── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-[55%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1B5E20 0%, #2E7D32 45%, #388E3C 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #A5D6A7, transparent)" }} />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #C8E6C9, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 border border-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-5 border border-white" />

        {/* Logo */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <HeartPulse size={26} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-xl tracking-tight">NutriTrack AI</p>
            <p className="text-green-200 text-xs font-medium tracking-widest uppercase">Health Intelligence Platform</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              Every child<br />
              <span className="text-green-300">deserves</span><br />
              to thrive.
            </h1>
            <p className="text-green-100/80 text-lg mt-4 font-medium leading-relaxed max-w-sm">
              AI-powered nutrition monitoring for India's Anganwadi network — real-time, accurate, life-changing.
            </p>
          </motion.div>

          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.6 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 backdrop-blur-sm shrink-0">
                  <f.icon size={18} className="text-green-200" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-green-200/70 text-xs">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <p className="text-green-300/50 text-xs font-medium relative z-10">BioMed Bharat Initiative · 2026</p>
      </motion.div>

      {/* ── RIGHT PANEL — Login form ── */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative overflow-hidden"
        style={{ background: "#FDFAF4" }}
      >
        {/* Soft background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" style={{ background: "radial-gradient(circle, #C8E6C9 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" style={{ background: "radial-gradient(circle, #DCEDC8 0%, transparent 70%)" }} />

        <div className="w-full max-w-sm relative z-10">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: "var(--color-bio-green-mid)" }}>
              <HeartPulse size={20} />
            </div>
            <span className="font-black text-lg" style={{ color: "var(--color-bio-green)" }}>NutriTrack AI</span>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-3xl font-black mb-1" style={{ color: "var(--color-bio-green)" }}>Sign in</h2>
            <p className="text-sm font-medium mb-8" style={{ color: "var(--color-muted, #6B7B6B)" }}>Access your health dashboard securely.</p>
          </motion.div>

          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            onSubmit={handleLogin}
            className="space-y-4"
          >
            {/* User ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-bio-green-mid)" }}>User ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={16} style={{ color: "var(--color-bio-green-mid)" }} />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  placeholder="admin  or  c1, c2 …"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium transition-all"
                  style={{
                    background: "rgba(200,230,201,0.25)",
                    border: "1.5px solid #C8E6C9",
                    color: "var(--color-bio-green)",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-bio-green-mid)" }}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key size={16} style={{ color: "var(--color-bio-green-mid)" }} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium transition-all"
                  style={{
                    background: "rgba(200,230,201,0.25)",
                    border: "1.5px solid #C8E6C9",
                    color: "var(--color-bio-green)",
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 mt-2 transition-all relative overflow-hidden"
              style={{
                background: loading
                  ? "var(--color-bio-green-mid)"
                  : "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)",
                boxShadow: "0 8px 32px rgba(46,125,50,0.35)",
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>Sign In Securely <ArrowRight size={16} /></>
              )}
            </motion.button>
          </motion.form>

          {/* Credentials hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 rounded-2xl"
            style={{ background: "rgba(200,230,201,0.3)", border: "1px solid #C8E6C9" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-bio-green-mid)" }}>Demo Access</p>
            <div className="space-y-1">
              <p className="text-xs font-medium" style={{ color: "var(--color-bio-green)" }}>
                Admin — <span className="font-black">admin</span> / <span className="font-black">password123</span>
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--color-bio-green)" }}>
                Parent — <span className="font-black">c1</span> / <span className="font-black">password123</span>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

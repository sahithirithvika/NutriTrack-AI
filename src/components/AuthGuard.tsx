"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { HeartPulse, Key, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const currentUser = useAppStore(state => state.currentUser);
  const login = useAppStore(state => state.login);
  const childrenDb = useAppStore(state => state.children);
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !password) {
      toast.error("Please enter both User ID and Password.");
      return;
    }

    const cleanId = userId.toLowerCase().trim();
    
    if (cleanId === "admin" && password === "password123") {
      login("admin");
      setIsRedirecting(true);
      toast.success("Authenticated as Anganwadi Admin");
      setTimeout(() => router.push("/"), 100);
      return;
    }

    const child = childrenDb.find(c => c.id === cleanId);
    if (child && password === child.password) {
      login(child.id);
      setIsRedirecting(true);
      toast.success(`Authenticated as Parent of ${child.name}`);
      setTimeout(() => router.push("/"), 100);
      return;
    }

    toast.error("Invalid User ID or Password.");
  };

  if (isRedirecting) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="w-16 h-16 rounded-lg flex items-center justify-center text-white shadow-xl"
          style={{ backgroundColor: "var(--color-bio-green)" }}
        >
          <HeartPulse size={32} />
        </motion.div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden">
        
        {/* Floating background orbs for extra aesthetic */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-400/30 dark:bg-teal-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[40px] border border-white/60 dark:border-slate-700/50 shadow-2xl shadow-purple-900/10 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 mb-8 transform rotate-3">
            <HeartPulse size={40} />
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 text-center tracking-tight">NutriTrack Secure</h1>
          <p className="text-slate-600 dark:text-slate-300 text-center mb-8 font-medium">Please authenticate to continue.</p>

          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="User ID (e.g., admin or c1)" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/80 dark:border-slate-700/50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-500"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key size={18} className="text-slate-400" />
                </div>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/80 dark:border-slate-700/50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
            >
              Secure Login <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 w-full text-center">
            <p className="text-xs text-slate-500 font-medium">Demo Credentials:</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Admin: <b>admin</b> / <b>password123</b></p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Parent: <b>c1</b> / <b>password123</b></p>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

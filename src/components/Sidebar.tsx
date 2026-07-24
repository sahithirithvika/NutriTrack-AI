"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Radar, Mic, Home, LogOut, Plus, HeartPulse, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import AddPatientModal from "@/components/AddPatientModal";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useAppStore(state => state.currentUser);
  const logout = useAppStore(state => state.logout);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = currentUser === "admin"
    ? [
        { href: "/",      icon: Radar, label: "Village Radar",    desc: "Patient overview" },
        { href: "/voice", icon: Mic,   label: "Ambient Copilot",  desc: "AI voice screening" },
      ]
    : [
        { href: "/", icon: Home, label: "Health Dashboard", desc: "Your child's status" },
      ];

  const initials = currentUser === "admin" ? "AD" : (currentUser ?? "").toUpperCase();
  const displayName = currentUser === "admin" ? "Anganwadi Admin" : "Parent Account";
  const displaySub  = currentUser === "admin" ? "BioMed Bharat '26" : `ID: ${currentUser}`;

  return (
    <>
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-64 h-full flex flex-col flex-shrink-0 z-50 relative"
        style={{ background: "linear-gradient(180deg, #1B5E20 0%, #2E7D32 60%, #33691E 100%)" }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)" }} />
        <div className="absolute bottom-20 left-0 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)" }} />

        {/* Logo */}
        <div className="px-6 py-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/25 backdrop-blur-sm">
            <HeartPulse size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-base tracking-tight leading-none">NutriTrack AI</p>
            <p className="text-green-300/70 text-[10px] font-medium tracking-widest uppercase mt-0.5">Health Platform</p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto no-scrollbar">
          <p className="px-3 text-[10px] font-bold text-green-300/50 uppercase tracking-widest mb-3">Navigation</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 cursor-pointer group relative",
                    isActive
                      ? "bg-white/18 border border-white/20"
                      : "hover:bg-white/10"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: "rgba(255,255,255,0.14)" }}
                    />
                  )}
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative z-10",
                    isActive ? "bg-white/25" : "bg-white/10 group-hover:bg-white/18"
                  )}>
                    <Icon size={18} className={isActive ? "text-white" : "text-green-200"} />
                  </div>
                  <div className="flex-1 relative z-10 min-w-0">
                    <p className={cn("text-sm font-semibold leading-none", isActive ? "text-white" : "text-green-100")}>{item.label}</p>
                    <p className="text-[11px] text-green-300/60 mt-0.5 truncate">{item.desc}</p>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-white/60 relative z-10 shrink-0" />}
                </motion.div>
              </Link>
            );
          })}

          {/* Register child CTA — admin only */}
          {currentUser === "admin" && (
            <div className="pt-4 mt-2 border-t border-white/10">
              <p className="px-3 text-[10px] font-bold text-green-300/50 uppercase tracking-widest mb-3">Actions</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/18 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Plus size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white leading-none">Register Child</p>
                  <p className="text-[11px] text-green-300/60 mt-0.5">Add to ICDS network</p>
                </div>
              </motion.button>
            </div>
          )}
        </div>

        {/* User + Sign Out */}
        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/8">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/20 shrink-0">
              <span className="text-white font-black text-xs">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-none">{displayName}</p>
              <p className="text-[11px] text-green-300/60 mt-0.5 truncate">{displaySub}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ x: 3 }}
            onClick={() => { logout(); router.push("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-red-500/20 text-green-200 hover:text-red-300 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-red-500/20 flex items-center justify-center transition-all">
              <LogOut size={16} />
            </div>
            <span className="text-sm font-semibold">Sign Out</span>
          </motion.button>
        </div>
      </motion.aside>

      <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

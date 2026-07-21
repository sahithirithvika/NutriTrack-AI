"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Radar, Mic, User, Settings, LogOut, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import AddPatientModal from "@/components/AddPatientModal";
import { toast } from "sonner";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useAppStore(state => state.currentUser);
  const logout = useAppStore(state => state.logout);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = currentUser === 'admin' ? [
    { href: "/", icon: Radar, label: "Village Radar" },
    { href: "/voice", icon: Mic, label: "Ambient Copilot" },
  ] : [
    { href: "/", icon: User, label: "Parent Home" }
  ];

  return (
    <div className="w-64 h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm flex-shrink-0 z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md" style={{ backgroundColor: "var(--color-bio-green)" }}>
          NT
        </div>
        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">NutriTrack AI</span>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Platform</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "dark:bg-slate-900 bg-slate-50" 
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200"
              )}
              style={isActive ? { color: "var(--color-bio-green)", borderColor: "rgba(46,125,50,0.2)", borderWidth: "1px" } : {}}
            >
              <Icon size={20} style={isActive ? { color: "var(--color-bio-green)" } : {}} className={cn(!isActive && "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors mb-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 flex items-center justify-center overflow-hidden">
            <User size={20} className="text-slate-500" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">
              {currentUser === 'admin' ? "Team Sapphire" : "Parent Account"}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {currentUser === 'admin' ? "BioMed Bharat '26" : `ID: ${currentUser}`}
            </p>
          </div>
          
          <button 
            onClick={() => toast.info("Settings panel is locked for the BioMed Bharat demo.")}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-1"
          >
            <Settings size={18} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
          </button>
        </div>

        {/* Register Child Button - Only for Admin */}
        {currentUser === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 font-bold text-sm transition-all border border-indigo-100 dark:border-indigo-500/20 mb-3"
          >
            <Plus size={18} /> Register Child
          </button>
        )}

        <button 
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="flex items-center justify-center gap-3 w-full px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold text-sm transition-all group mt-2"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>

      <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

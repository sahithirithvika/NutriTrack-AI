"use client";

import { Search, Filter, ShieldAlert, AlertTriangle, ArrowRight, User } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function VillageRadar() {
  const children = useAppStore(state => state.children);
  const currentUser = useAppStore(state => state.currentUser);
  const router = useRouter();
  
  const criticalCount = children.filter(c => c.risk === "critical").length;
  const warningCount = children.filter(c => c.risk === "warning").length;

  // PARENT DASHBOARD VIEW
  if (currentUser !== 'admin') {
    const child = children.find(c => c.id === currentUser);
    if (!child) return null;

    const isCritical = child.risk === "critical";
    const isWarning = child.risk === "warning";
    const isHealthy = child.risk === "healthy";

    return (
      <div className="flex flex-col h-full bg-transparent p-10 overflow-y-auto items-center justify-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 text-center">Health Summary Dashboard</h1>
          <p className="text-slate-500 mb-12 text-center">A high-level overview of {child.name}'s current clinical status and improvements.</p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[40px] p-10 border border-white/80 dark:border-slate-700/50 shadow-2xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden"
          >
            {isCritical && <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>}
            {isWarning && <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>}
            {isHealthy && <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>}

            <div className="flex items-center gap-6 mb-10 z-10 relative">
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg text-slate-400 font-bold text-2xl border border-slate-100 dark:border-slate-700">
                {child.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">{child.name}</h2>
                <p className="text-slate-500 font-medium">{child.ageMonths} months • {child.gender}</p>
              </div>
              <div className="ml-auto flex gap-3">
                {isCritical && <span className="bg-red-50 text-red-600 dark:bg-red-500/10 px-4 py-2 rounded-xl text-sm font-bold border border-red-100 dark:border-red-500/20">Critical Risk</span>}
                {isWarning && <span className="bg-amber-50 text-amber-600 dark:bg-amber-500/10 px-4 py-2 rounded-xl text-sm font-bold border border-amber-100 dark:border-amber-500/20">Warning</span>}
                {isHealthy && <span className="bg-green-50 text-green-600 dark:bg-green-500/10 px-4 py-2 rounded-xl text-sm font-bold border border-green-100 dark:border-green-500/20">Healthy</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10 z-10 relative">
              <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm p-6 rounded-[24px] border border-white/50">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Current Weight</p>
                <p className="font-black text-4xl text-slate-900 dark:text-white">{child.weightKg} <span className="text-xl text-slate-500 font-semibold">kg</span></p>
              </div>
              
              <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm p-6 rounded-[24px] border border-white/50 flex flex-col justify-center">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">3-Month Health Velocity</p>
                <div className="flex items-center gap-3">
                  <p className={`font-black text-4xl ${child.velocity3mo < 0 ? "text-red-500" : "text-green-500"}`}>
                    {child.velocity3mo > 0 ? "+" : ""}{child.velocity3mo} <span className="text-xl font-semibold opacity-70">kg</span>
                  </p>
                  {child.velocity3mo < 0 ? (
                    <span className="text-sm font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-lg">Health Decrement</span>
                  ) : (
                    <span className="text-sm font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-3 py-1 rounded-lg">Health Improvement</span>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => router.push(`/child/${child.id}`)}
              className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 transition-all text-lg group"
            >
              View Deep Clinical Profile <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD VIEW
  return (
    <div className="flex flex-col h-full bg-transparent p-10 overflow-y-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Patient Dashboard</h1>
        <p className="text-sm text-slate-500 font-medium">BioMed Bharat '26 • {children.length} Children Monitored</p>
      </div>

      {/* Vibrant Flash Cards */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-[32px] shadow-2xl shadow-blue-500/30 border border-blue-400/30 flex items-center justify-between transform transition-transform hover:-translate-y-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-100 mb-2">Total Monitored</p>
            <p className="text-5xl font-extrabold">{children.length}</p>
          </div>
          <div className="w-16 h-16 rounded-[20px] bg-white/20 text-white flex items-center justify-center backdrop-blur-md">
            <User size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white p-8 rounded-[32px] shadow-2xl shadow-red-500/30 border border-red-400/30 flex items-center justify-between transform transition-transform hover:-translate-y-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-100 mb-2">Critical (SAM)</p>
            <p className="text-5xl font-extrabold">{criticalCount}</p>
          </div>
          <div className="w-16 h-16 rounded-[20px] bg-white/20 text-white flex items-center justify-center backdrop-blur-md">
            <ShieldAlert size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-8 rounded-[32px] shadow-2xl shadow-amber-500/30 border border-amber-300/30 flex items-center justify-between transform transition-transform hover:-translate-y-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-100 mb-2">Warning (MAM)</p>
            <p className="text-5xl font-extrabold">{warningCount}</p>
          </div>
          <div className="w-16 h-16 rounded-[20px] bg-white/20 text-white flex items-center justify-center backdrop-blur-md">
            <AlertTriangle size={32} />
          </div>
        </div>
      </div>

      {/* Patient Grid */}
      <h2 className="text-2xl font-bold mb-8">Patient Roster</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {children.map((child, i) => {
          const isCritical = child.risk === "critical";
          const isWarning = child.risk === "warning";
          
          return (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => router.push(`/child/${child.id}`)}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[32px] p-8 border border-white/80 dark:border-slate-700/50 shadow-2xl shadow-slate-200/40 dark:shadow-none cursor-pointer group relative overflow-hidden h-full flex flex-col transition-all"
            >
                {/* Decorative background gradient */}
                {isCritical && <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>}
                {isWarning && <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>}
                {!isCritical && !isWarning && <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>}

                <div className="flex justify-between items-start mb-8 z-10">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg ${
                      isCritical ? "bg-red-500 shadow-red-500/30" : isWarning ? "bg-amber-500 shadow-amber-500/30" : "bg-green-500 shadow-green-500/30"
                    }`}>
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white">{child.name}</h3>
                      <p className="text-sm text-slate-500 font-medium">{child.ageMonths}m • {child.gender}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 z-10 flex-1">
                  <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm p-4 rounded-[20px] flex flex-col justify-center border border-white/50">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Weight</p>
                    <p className="font-bold text-xl text-slate-900 dark:text-white">{child.weightKg} kg</p>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm p-4 rounded-[20px] flex flex-col justify-center border border-white/50">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">3mo Velocity</p>
                    <p className={`font-bold text-xl ${child.velocity3mo < 0 ? "text-red-500" : "text-green-500"}`}>
                      {child.velocity3mo > 0 ? "+" : ""}{child.velocity3mo} kg
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 z-10">
                  <div className="flex items-center gap-2">
                    {isCritical && <span className="bg-red-50 text-red-600 dark:bg-red-500/10 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100 dark:border-red-500/20">Critical Risk</span>}
                    {isWarning && <span className="bg-amber-50 text-amber-600 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-100 dark:border-amber-500/20">Warning</span>}
                    {!isCritical && !isWarning && <span className="bg-green-50 text-green-600 dark:bg-green-500/10 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-100 dark:border-green-500/20">Healthy</span>}
                  </div>
                  <div className="flex items-center gap-2 text-blue-500 font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    View Profile <ArrowRight size={18} />
                  </div>
                </div>
              </motion.div>
            );
        })}
      </div>
    </div>
  );
}

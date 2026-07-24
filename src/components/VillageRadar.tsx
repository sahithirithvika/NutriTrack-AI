"use client";

import { ShieldAlert, AlertTriangle, Users, ArrowRight, TrendingUp, TrendingDown, MapPin, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { motion, type Variants, type Transition } from "framer-motion";
import { useRouter } from "next/navigation";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } as Transition,
  }),
};

export default function VillageRadar() {
  const children = useAppStore(state => state.children);
  const currentUser = useAppStore(state => state.currentUser);
  const router = useRouter();

  const criticalCount = children.filter(c => c.risk === "critical").length;
  const warningCount  = children.filter(c => c.risk === "warning").length;
  const healthyCount  = children.filter(c => c.risk === "healthy").length;

  /* ─── PARENT VIEW ─── */
  if (currentUser !== "admin") {
    const child = children.find(c => c.id === currentUser);
    if (!child) return null;

    const isCritical = child.risk === "critical";
    const isWarning  = child.risk === "warning";
    const isHealthy  = child.risk === "healthy";

    const riskColor  = isCritical ? "#B71C1C" : isWarning ? "#E65100" : "#1B5E20";
    const riskBg     = isCritical ? "#FFEBEE" : isWarning ? "#FFF3E0" : "#E8F5E9";
    const riskBorder = isCritical ? "#FFCDD2" : isWarning ? "#FFE0B2" : "#C8E6C9";
    const riskLabel  = isCritical ? "Critical Risk" : isWarning ? "Needs Attention" : "Healthy";

    return (
      <div className="h-full overflow-y-auto mesh-bg">
        <div className="max-w-3xl mx-auto px-8 py-12">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} style={{ color: "var(--color-bio-green-mid)" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-bio-green-mid)" }}>Health Summary</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight gradient-text">Good morning,</h1>
            <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-bio-green)" }}>{child.name.split(" ")[0]}'s Dashboard</h2>
            <p className="mt-2 text-sm font-medium" style={{ color: "var(--color-muted, #6B7B6B)" }}>Last updated today · {child.location}</p>
          </motion.div>

          {/* Status Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl p-8 mb-6 relative overflow-hidden"
            style={{ background: riskBg, border: `1.5px solid ${riskBorder}` }}
          >
            {/* Decorative blob */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-30 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${riskColor}, transparent)` }} />

            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full pulse-ring" style={{ background: riskColor }} />
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: riskColor }}>{riskLabel}</span>
                </div>
                <h3 className="text-2xl font-black mt-2" style={{ color: riskColor }}>{child.aiPrediction}</h3>
                <p className="text-sm font-medium mt-1" style={{ color: riskColor, opacity: 0.7 }}>{child.ageMonths} months · {child.gender} · {child.location}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg"
                style={{ background: riskColor }}>
                {child.name.charAt(0)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/80">
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: riskColor, opacity: 0.7 }}>Current Weight</p>
                <p className="text-3xl font-black" style={{ color: riskColor }}>{child.weightKg}<span className="text-base font-semibold opacity-60 ml-1">kg</span></p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/80">
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: riskColor, opacity: 0.7 }}>3-Month Velocity</p>
                <div className="flex items-center gap-2">
                  {child.velocity3mo < 0
                    ? <TrendingDown size={20} style={{ color: "#B71C1C" }} />
                    : <TrendingUp size={20} style={{ color: "#1B5E20" }} />}
                  <p className="text-3xl font-black" style={{ color: child.velocity3mo < 0 ? "#B71C1C" : "#1B5E20" }}>
                    {child.velocity3mo > 0 ? "+" : ""}{child.velocity3mo}<span className="text-base font-semibold opacity-60 ml-1">kg</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Flags */}
          {child.flags.filter(f => f !== "None").length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="rounded-2xl p-4 mb-6 flex flex-wrap gap-2"
              style={{ background: "#FFF3E0", border: "1px solid #FFE0B2" }}>
              {child.flags.map((f, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#FFE0B2", color: "#E65100" }}>{f}</span>
              ))}
            </motion.div>
          )}

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/child/${child.id}`)}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-base group transition-all"
            style={{
              background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)",
              boxShadow: "0 8px 32px rgba(46,125,50,0.35)",
            }}
          >
            <Sparkles size={18} />
            View Full Clinical Profile
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    );
  }

  /* ─── ADMIN VIEW ─── */
  const stats = [
    { label: "Total Monitored", value: children.length, icon: Users,        color: "#1B5E20", bg: "#E8F5E9", border: "#C8E6C9" },
    { label: "Critical (SAM)",  value: criticalCount,   icon: ShieldAlert,  color: "#B71C1C", bg: "#FFEBEE", border: "#FFCDD2" },
    { label: "Warning (MAM)",   value: warningCount,    icon: AlertTriangle, color: "#E65100", bg: "#FFF3E0", border: "#FFE0B2" },
    { label: "Healthy",         value: healthyCount,    icon: TrendingUp,   color: "#2E7D32", bg: "#F1F8E9", border: "#DCEDC8" },
  ];

  return (
    <div className="h-full overflow-y-auto mesh-bg">
      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} style={{ color: "var(--color-bio-green-mid)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-bio-green-mid)" }}>Admin Panel</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight gradient-text">Patient Dashboard</h1>
              <p className="text-sm font-medium mt-1" style={{ color: "var(--color-muted, #6B7B6B)" }}>BioMed Bharat '26 · {children.length} children monitored</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border" style={{ background: "#E8F5E9", borderColor: "#C8E6C9" }}>
              <div className="w-2 h-2 rounded-full bg-green-500 pulse-ring" />
              <span className="text-xs font-bold" style={{ color: "#1B5E20" }}>Live Monitoring</span>
            </div>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-5 mb-10">
          {stats.map((s, i) => (
            <motion.div key={s.label} custom={i} variants={cardVariants} initial="hidden" animate="visible"
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-2xl p-5 flex flex-col gap-3 border transition-all cursor-default"
              style={{ background: s.bg, borderColor: s.border }}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: "white", borderColor: s.border }}>
                  <s.icon size={20} style={{ color: s.color }} />
                </div>
                <span className="text-4xl font-black" style={{ color: s.color }}>{s.value}</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: s.color, opacity: 0.7 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Patient grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black" style={{ color: "var(--color-bio-green)" }}>Patient Roster</h2>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl" style={{ background: "#E8F5E9", color: "#1B5E20" }}>{children.length} records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
          {children.map((child, i) => {
            const isCritical = child.risk === "critical";
            const isWarning  = child.risk === "warning";
            const riskColor  = isCritical ? "#B71C1C" : isWarning ? "#E65100" : "#1B5E20";
            const riskBg     = isCritical ? "#FFEBEE" : isWarning ? "#FFF3E0" : "#E8F5E9";
            const riskBorder = isCritical ? "#FFCDD2" : isWarning ? "#FFE0B2" : "#C8E6C9";
            const riskLabel  = isCritical ? "Critical" : isWarning ? "Warning" : "Healthy";

            return (
              <motion.div
                key={child.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5, scale: 1.015 }}
                onClick={() => router.push(`/child/${child.id}`)}
                className="glass-card rounded-3xl p-6 cursor-pointer group relative overflow-hidden flex flex-col gap-4 transition-all"
                style={{ boxShadow: "0 4px 24px rgba(27,94,32,0.08)" }}
              >
                {/* Colour streak */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: riskColor }} />

                {/* Avatar + name */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md shrink-0"
                    style={{ background: riskColor }}>
                    {child.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base truncate" style={{ color: "var(--color-bio-green)" }}>{child.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} style={{ color: "var(--color-muted, #6B7B6B)" }} />
                      <p className="text-xs font-medium truncate" style={{ color: "var(--color-muted, #6B7B6B)" }}>{child.location}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-black shrink-0" style={{ background: riskBg, color: riskColor, border: `1px solid ${riskBorder}` }}>{riskLabel}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Age", value: `${child.ageMonths}m` },
                    { label: "Weight", value: `${child.weightKg}kg` },
                    { label: "Velocity", value: `${child.velocity3mo > 0 ? "+" : ""}${child.velocity3mo}kg`, color: child.velocity3mo < 0 ? "#B71C1C" : "#1B5E20" },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-2.5 text-center" style={{ background: "#F1F8E9", border: "1px solid #DCEDC8" }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#558B2F" }}>{s.label}</p>
                      <p className="text-sm font-black" style={{ color: s.color ?? "var(--color-bio-green)" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "#E8F5E9" }}>
                  <p className="text-xs font-medium" style={{ color: "#558B2F" }}>{child.aiPrediction}</p>
                  <div className="flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all" style={{ color: "var(--color-bio-green-mid)" }}>
                    View Profile <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

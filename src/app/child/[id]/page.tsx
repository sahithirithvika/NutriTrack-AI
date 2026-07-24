"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  ArrowLeft, MapPin, AlertTriangle, ShieldAlert, Activity,
  Info, CheckCircle2, HeartHandshake, Apple, CalendarHeart,
  Download, Calculator, Sparkles, TrendingUp, TrendingDown, User
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { calculateNutritionalRisk } from "@/lib/who-zscore";

export default function ChildProfilePage() {
  const params      = useParams();
  const router      = useRouter();
  const children    = useAppStore(state => state.children);
  const currentUser = useAppStore(state => state.currentUser);
  const [child, setChild]             = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const found = children.find(c => c.id === params.id);
    setChild(found);
    if (currentUser && currentUser !== "admin" && currentUser !== params.id) {
      setIsAuthorized(false);
      toast.error("Access denied.");
      setTimeout(() => router.push("/"), 1500);
    }
  }, [children, params.id, currentUser, router]);

  if (!isAuthorized) return (
    <div className="flex h-full items-center justify-center flex-col gap-4 mesh-bg">
      <ShieldAlert size={48} style={{ color: "#B71C1C" }} />
      <h1 className="text-2xl font-black" style={{ color: "#B71C1C" }}>Access Denied</h1>
      <p className="text-sm font-medium" style={{ color: "#6B7B6B" }}>You don't have permission to view this profile.</p>
      <button onClick={() => router.push("/")}
        className="px-6 py-3 rounded-2xl text-white font-bold text-sm mt-2"
        style={{ background: "var(--color-bio-green-mid)" }}>Return to Dashboard</button>
    </div>
  );

  if (!child) return (
    <div className="flex h-full items-center justify-center flex-col gap-4 mesh-bg">
      <div className="w-10 h-10 border-3 border-green-200 border-t-green-600 rounded-full animate-spin" />
    </div>
  );

  const isCritical  = child.risk === "critical";
  const isWarning   = child.risk === "warning";
  const riskColor   = isCritical ? "#B71C1C" : isWarning ? "#E65100" : "#1B5E20";
  const riskBg      = isCritical ? "#FFEBEE" : isWarning ? "#FFF3E0" : "#E8F5E9";
  const riskBorder  = isCritical ? "#FFCDD2" : isWarning ? "#FFE0B2" : "#C8E6C9";
  const { zScore, explanation } = calculateNutritionalRisk(child.ageMonths, child.weightKg, child.gender);

  const actionPlans: Record<string, { icon: any; title: string; desc: string }[]> = {
    critical: [
      { icon: MapPin,        title: "Immediate Visit",    desc: "Visit your local Anganwadi center today for urgent clinical evaluation." },
      { icon: Apple,         title: "RUTF Rations",       desc: "Collect free Ready-to-Use Therapeutic Food (RUTF) packets from the center." },
      { icon: Info,          title: "Hydration",          desc: "Ensure the child drinks clean, boiled water frequently to prevent dehydration." },
    ],
    warning: [
      { icon: Apple,         title: "Increase Calories",  desc: "Add a spoon of ghee or oil to daily dal to increase caloric density." },
      { icon: CheckCircle2,  title: "Protein Focus",      desc: "Ensure they eat eggs or thick lentils at least twice a day." },
      { icon: CalendarHeart, title: "Schedule Visit",     desc: "Schedule a follow-up weight measurement at the Anganwadi center next week." },
    ],
    healthy: [
      { icon: CheckCircle2,  title: "Great Progress!",    desc: "Your child is growing perfectly. Keep up the excellent work!" },
      { icon: Apple,         title: "Maintain Diet",      desc: "Continue feeding them a balanced diet of rice, dal, and fresh vegetables." },
      { icon: CalendarHeart, title: "Next Checkup",       desc: "No urgent action needed. Return for a routine checkup in 3 months." },
    ],
  };
  const plans = actionPlans[child.risk] ?? actionPlans.healthy;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto mesh-bg">

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b"
        style={{ background: "rgba(253,250,244,0.85)", backdropFilter: "blur(20px)", borderColor: "#D8EDD8" }}>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
            style={{ background: "#E8F5E9", color: "#1B5E20", border: "1px solid #C8E6C9" }}>
            <ArrowLeft size={20} />
          </motion.button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow"
              style={{ background: riskColor }}>{child.name.charAt(0)}</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black" style={{ color: "var(--color-bio-green)" }}>{child.name}</h1>
                <span className="px-2.5 py-0.5 rounded-xl text-[11px] font-black"
                  style={{ background: riskBg, color: riskColor, border: `1px solid ${riskBorder}` }}>
                  {child.risk.charAt(0).toUpperCase() + child.risk.slice(1)} Risk
                </span>
              </div>
              <p className="text-xs font-medium mt-0.5" style={{ color: "#6B7B6B" }}>
                NT-{child.id.toUpperCase()} · {child.ageMonths}mo · {child.gender} · {child.location}
              </p>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => toast.success("Dossier exported securely.")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm"
          style={{ background: riskColor, boxShadow: `0 6px 20px ${riskColor}40` }}>
          <Download size={15} /> Export Passport
        </motion.button>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-6">

          {/* ── Left col ── */}
          <div className="col-span-8 space-y-6">

            {/* Stat pills */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Current Weight", value: `${child.weightKg} kg`, sub: "Measured today", icon: Activity, color: riskColor, bg: riskBg, border: riskBorder },
                { label: "3mo Velocity",   value: `${child.velocity3mo > 0 ? "+" : ""}${child.velocity3mo} kg`,
                  sub: child.velocity3mo < 0 ? "Declining" : "Improving",
                  icon: child.velocity3mo < 0 ? TrendingDown : TrendingUp,
                  color: child.velocity3mo < 0 ? "#B71C1C" : "#1B5E20",
                  bg: child.velocity3mo < 0 ? "#FFEBEE" : "#E8F5E9",
                  border: child.velocity3mo < 0 ? "#FFCDD2" : "#C8E6C9" },
                { label: "AI Prediction",  value: child.aiPrediction, sub: "WHO standard", icon: Sparkles, color: riskColor, bg: riskBg, border: riskBorder },
              ].map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-5 relative overflow-hidden"
                  style={{ background: s.bg, border: `1.5px solid ${s.border}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: s.color, opacity: 0.7 }}>{s.label}</p>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "white", border: `1px solid ${s.border}` }}>
                      <s.icon size={15} style={{ color: s.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[11px] font-medium mt-1" style={{ color: s.color, opacity: 0.6 }}>{s.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Growth chart */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="glass-card rounded-3xl p-7" style={{ border: "1.5px solid #D8EDD8", boxShadow: "0 4px 24px rgba(27,94,32,0.08)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#E8F5E9" }}>
                  <Activity size={18} style={{ color: "#1B5E20" }} />
                </div>
                <div>
                  <h2 className="text-base font-black" style={{ color: "var(--color-bio-green)" }}>WHO Growth Trajectory</h2>
                  <p className="text-xs font-medium" style={{ color: "#6B7B6B" }}>Weight-for-age vs WHO optimal zone</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-6 p-3 rounded-2xl" style={{ background: "#F1F8E9", border: "1px solid #DCEDC8" }}>
                {[
                  { dot: "#4CAF50", label: "WHO Optimal Zone", dashed: false },
                  { dot: "#1B5E20", label: "Actual Weight Path", dashed: false },
                  { dot: riskColor, label: "AI 6-Month Forecast", dashed: true },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-2">
                    {l.dashed
                      ? <div className="w-6 h-0 border-t-2 border-dashed" style={{ borderColor: l.dot }} />
                      : <div className="w-3 h-3 rounded-full" style={{ background: l.dot }} />}
                    <span className="text-[11px] font-bold" style={{ color: "#2E7D32" }}>{l.label}</span>
                  </div>
                ))}
              </div>

              {/* SVG chart */}
              <div className="relative h-56 ml-10 border-b-2 border-l-2" style={{ borderColor: "#C8E6C9" }}>
                {["8kg", "12kg", "16kg"].map((l, i) => (
                  <span key={l} className="absolute -left-10 text-[11px] font-bold" style={{ bottom: `${i * 50}%`, color: "#6B7B6B" }}>{l}</span>
                ))}
                <span className="absolute left-0 -bottom-7 text-[11px] font-bold" style={{ color: "#6B7B6B" }}>Past</span>
                <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-[11px] font-black" style={{ color: "var(--color-bio-green)" }}>Now</span>
                <span className="absolute right-0 -bottom-7 text-[11px] font-bold" style={{ color: riskColor }}>+6 mo</span>

                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="whoZone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,90 Q 50,60 100,35 L 100,75 Q 50,100 0,130 Z" fill="url(#whoZone)" />
                  <motion.path
                    d={`M 0,${isCritical ? 115 : isWarning ? 95 : 75} Q 25,${isCritical ? 125 : isWarning ? 90 : 70} 50,${isCritical ? 150 : isWarning ? 105 : 65}`}
                    fill="none" stroke="#1B5E20" strokeWidth="3" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: "easeOut" }} />
                  <motion.path
                    d={`M 50,${isCritical ? 150 : isWarning ? 105 : 65} Q 75,${isCritical ? 170 : isWarning ? 115 : 55} 100,${isCritical ? 190 : isWarning ? 125 : 45}`}
                    fill="none" stroke={riskColor} strokeWidth="3" strokeDasharray="7 5" strokeLinecap="round"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} />
                </svg>
                <motion.div
                  className="absolute left-1/2 w-5 h-5 rounded-full -translate-x-1/2 -translate-y-1/2 border-[3px] shadow-lg"
                  style={{ top: `${isCritical ? 150 : isWarning ? 105 : 65}px`, background: riskColor, borderColor: "white" }}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4, type: "spring" }} />
              </div>
            </motion.div>

            {/* Action plan */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="glass-card rounded-3xl p-7" style={{ border: "1.5px solid #D8EDD8", boxShadow: "0 4px 24px rgba(27,94,32,0.08)" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#E8F5E9" }}>
                  <HeartHandshake size={18} style={{ color: "#1B5E20" }} />
                </div>
                <div>
                  <h2 className="text-base font-black" style={{ color: "var(--color-bio-green)" }}>AI Nutrition Action Plan</h2>
                  <p className="text-xs font-medium" style={{ color: "#6B7B6B" }}>Personalized steps based on current risk assessment</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {plans.map((p, i) => (
                  <motion.div key={p.title}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.08 }}
                    className="rounded-2xl p-5 flex flex-col gap-3"
                    style={{ background: riskBg, border: `1px solid ${riskBorder}` }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "white", border: `1px solid ${riskBorder}` }}>
                      <p.icon size={17} style={{ color: riskColor }} />
                    </div>
                    <div>
                      <p className="text-sm font-black" style={{ color: riskColor }}>{i + 1}. {p.title}</p>
                      <p className="text-xs font-medium mt-1 leading-relaxed" style={{ color: riskColor, opacity: 0.75 }}>{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right col ── */}
          <div className="col-span-4 space-y-5">

            {/* Z-Score card */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="rounded-3xl p-6" style={{ background: riskBg, border: `1.5px solid ${riskBorder}` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "white", border: `1px solid ${riskBorder}` }}>
                  <Calculator size={18} style={{ color: riskColor }} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: riskColor, opacity: 0.7 }}>WHO Z-Score</p>
                  <p className="text-2xl font-black" style={{ color: riskColor }}>{zScore > 0 ? "+" : ""}{zScore} <span className="text-sm font-bold opacity-60">SD</span></p>
                </div>
              </div>
              <p className="text-xs font-medium leading-relaxed" style={{ color: riskColor, opacity: 0.75 }}>
                {explanation} — based on {child.gender}, {child.ageMonths}m, {child.weightKg}kg
              </p>
            </motion.div>

            {/* Clinical flags */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="glass-card rounded-3xl p-6" style={{ border: "1.5px solid #D8EDD8", boxShadow: "0 4px 24px rgba(27,94,32,0.08)" }}>
              <div className="flex items-center gap-2 mb-4">
                <User size={16} style={{ color: "#1B5E20" }} />
                <h3 className="text-sm font-black" style={{ color: "var(--color-bio-green)" }}>Clinical Flags</h3>
              </div>
              <div className="space-y-3">
                {child.flags.map((flag: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl" style={{ background: riskBg, border: `1px solid ${riskBorder}` }}>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "white", border: `1px solid ${riskBorder}` }}>
                      {flag === "None" ? <CheckCircle2 size={13} style={{ color: "#1B5E20" }} /> : <ShieldAlert size={13} style={{ color: riskColor }} />}
                    </div>
                    <div>
                      <p className="text-xs font-black" style={{ color: riskColor }}>{flag}</p>
                      <p className="text-[11px] font-medium mt-0.5 leading-snug" style={{ color: riskColor, opacity: 0.7 }}>
                        {flag === "None" ? "No red flags detected." : "Detected via AI analysis. Intervention recommended."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Clinical guidance */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="rounded-2xl p-5" style={{ background: riskBg, border: `1.5px solid ${riskBorder}` }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} style={{ color: riskColor }} />
                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: riskColor }}>Clinical Guidance</p>
              </div>
              <p className="text-xs font-semibold leading-relaxed" style={{ color: riskColor, opacity: 0.85 }}>
                {isCritical
                  ? "Clinical action required immediately. Notify PHC supervisor and escalate."
                  : isWarning
                  ? "Schedule follow-up in 15 days to monitor velocity trends."
                  : "Maintain routine ICDS monitoring schedule. Next visit in 3 months."}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

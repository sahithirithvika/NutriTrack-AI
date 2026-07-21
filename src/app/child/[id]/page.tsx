"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { ArrowLeft, User, MapPin, AlertTriangle, ShieldAlert, Activity, Info, CheckCircle2, HeartHandshake, Apple, CalendarHeart, Download, Calculator } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { calculateNutritionalRisk } from "@/lib/who-zscore";

export default function ChildProfilePage() {
  const params = useParams();
  const router = useRouter();
  const children = useAppStore(state => state.children);
  const currentUser = useAppStore(state => state.currentUser);
  const [child, setChild] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(true);
  
  useEffect(() => {
    const foundChild = children.find(c => c.id === params.id);
    setChild(foundChild);

    // Access control: only admin can view all profiles, parents can only view their own child
    if (currentUser && currentUser !== 'admin' && currentUser !== params.id) {
      setIsAuthorized(false);
      toast.error("You don't have permission to view this profile.");
      setTimeout(() => router.push("/"), 1500);
    }
  }, [children, params.id, currentUser, router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-slate-500">You don't have permission to view this profile.</p>
        <button onClick={() => router.push("/")} className="px-6 py-2 bg-slate-900 text-white rounded-lg mt-4">Return to Dashboard</button>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Child not found</h1>
        <button onClick={() => router.push("/")} className="px-6 py-2 bg-slate-900 text-white rounded-lg">Return to Dashboard</button>
      </div>
    );
  }

  const isCritical = child.risk === "critical";
  const isWarning = child.risk === "warning";
  const themeColor = isCritical ? "var(--color-terra-red)" : isWarning ? "var(--color-amber-warn)" : "var(--color-bio-green)";
  
  const { zScore, explanation } = calculateNutritionalRisk(child.ageMonths, child.weightKg, child.gender);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 overflow-y-auto"
    >
      {/* Premium Header */}
      <div className="px-10 py-8 border-b border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80">
        <div className="flex items-center gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button onClick={() => router.push("/")} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft size={24} />
            </button>
          </motion.div>
          <div className="flex items-center gap-5">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl"
              style={{ backgroundColor: themeColor }}
            >
              {child.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">{child.name}</h1>
                <span 
                  className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider"
                  style={{ 
                    backgroundColor: isCritical ? 'rgba(239,68,68,0.1)' : isWarning ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                    color: themeColor,
                    border: `1px solid ${isCritical ? 'rgba(239,68,68,0.2)' : isWarning ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)'}`
                  }}
                >
                  {child.risk} Risk
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-1">ID: NT-{child.id.toUpperCase()} • {child.ageMonths} Months • {child.gender} • {child.location}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => toast.success("Dossier exported securely.")}
            className="px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            style={{ backgroundColor: themeColor, boxShadow: `0 10px 25px -5px ${themeColor}60` }}
          >
            <Download size={18} /> Export Passport
          </button>
        </div>
      </div>

      <div className="flex-1 p-10">
        <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          {/* Main Visual Data - 8 Columns */}
          <div className="col-span-8 space-y-8">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none relative overflow-hidden">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Current Weight</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">{child.weightKg} <span className="text-xl text-slate-400">kg</span></p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">3mo Velocity</p>
                <p className={`text-4xl font-bold ${child.velocity3mo < 0 ? "text-red-500" : "text-green-500"}`}>
                  {child.velocity3mo > 0 ? "+" : ""}{child.velocity3mo} <span className="text-xl opacity-50">kg</span>
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">AI Prediction</p>
                <p className="text-3xl font-bold" style={{ color: themeColor }}>{child.aiPrediction}</p>
              </div>
            </div>

            {/* Growth Curve */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-white/80 dark:border-slate-700/50 shadow-2xl shadow-slate-200/40 dark:shadow-none">
              <div className="flex flex-col mb-10">
                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-white mb-2">
                  <Activity size={24} style={{ color: themeColor }} /> 
                  WHO/ICDS Growth Trajectory
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  This chart maps the child's weight over time against the World Health Organization's standard for healthy growth. The AI predicts future risk based on current velocity.
                </p>
                
                {/* Clear Legend for Laypeople */}
                <div className="flex flex-wrap items-center gap-6 mt-6 p-4 bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-green-500/20 border border-green-500/50"></div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">WHO Optimal Growth Zone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-[2px] bg-slate-900 dark:bg-white rounded-full"></div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Child's Actual Weight Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-[2px] rounded-full border-t-2 border-dashed" style={{ borderColor: themeColor }}></div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">AI 6-Month Predictive Forecast</span>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[300px] w-full border-b-2 border-l-2 border-slate-200 dark:border-slate-800 ml-8">
                {/* Labels */}
                <div className="absolute -left-10 bottom-0 text-xs font-bold text-slate-400">8kg</div>
                <div className="absolute -left-12 top-1/2 text-xs font-bold text-slate-400">12kg</div>
                <div className="absolute -left-12 top-0 text-xs font-bold text-slate-400">16kg</div>
                
                <div className="absolute left-0 -bottom-8 text-xs font-bold text-slate-400">Past</div>
                <div className="absolute left-1/2 -bottom-8 text-xs font-bold text-slate-900 dark:text-white">Present</div>
                <div className="absolute right-0 -bottom-8 text-xs font-bold" style={{ color: themeColor }}>+6 Months</div>

                {/* Simulated Chart specific to child */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* WHO Green Zone */}
                  <path d="M 0,100 Q 50,70 100,40 L 100,80 Q 50,110 0,140 Z" fill="var(--color-bio-green)" opacity="0.15" />
                  
                  {/* Actual Path */}
                  <motion.path 
                    d={`M 0,${isCritical ? 120 : isWarning ? 100 : 80} Q 25,${isCritical ? 130 : isWarning ? 95 : 75} 50,${isCritical ? 160 : isWarning ? 110 : 70}`} 
                    fill="none" 
                    stroke="currentColor" 
                    className="text-slate-900 dark:text-white" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  
                  {/* Prediction Path */}
                  <motion.path 
                    d={`M 50,${isCritical ? 160 : isWarning ? 110 : 70} Q 75,${isCritical ? 180 : isWarning ? 120 : 60} 100,${isCritical ? 200 : isWarning ? 130 : 50}`} 
                    fill="none" 
                    stroke={themeColor}
                    strokeWidth="4" 
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  />
                </svg>
                
                {/* Current Dot */}
                <motion.div 
                  className="absolute left-1/2 w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2 border-[4px] border-white dark:border-slate-900 shadow-xl"
                  style={{ top: `${isCritical ? 160 : isWarning ? 110 : 70}px`, backgroundColor: "var(--foreground)" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, type: "spring" }}
                ></motion.div>
              </div>
            </div>
            
            {/* AI NUTRITION ACTION PLAN (Parent Feature) */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-white/80 dark:border-slate-700/50 shadow-2xl shadow-slate-200/40 dark:shadow-none">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <HeartHandshake size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Nutrition Action Plan</h2>
                  <p className="text-sm text-slate-500 font-medium">Personalized daily steps for you to take.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {child.risk === "critical" && (
                  <>
                    <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-3xl border border-red-100 dark:border-red-500/20">
                      <div className="flex items-center gap-3 text-red-600 dark:text-red-400 font-bold mb-3"><MapPin size={20} /> 1. Immediate Visit</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Please visit your local Anganwadi center today. Your child needs urgent clinical evaluation.</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-3xl border border-red-100 dark:border-red-500/20">
                      <div className="flex items-center gap-3 text-red-600 dark:text-red-400 font-bold mb-3"><Apple size={20} /> 2. RUTF Rations</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Collect your free Ready-to-Use Therapeutic Food (RUTF) packets from the center.</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-3xl border border-red-100 dark:border-red-500/20">
                      <div className="flex items-center gap-3 text-red-600 dark:text-red-400 font-bold mb-3"><Info size={20} /> 3. Hydration</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Ensure the child drinks clean, boiled water frequently to prevent dehydration from fever.</p>
                    </div>
                  </>
                )}

                {child.risk === "warning" && (
                  <>
                    <div className="bg-amber-50 dark:bg-amber-500/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-500/20">
                      <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-bold mb-3"><Apple size={20} /> 1. Increase Calories</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Add a spoon of ghee or oil to their daily dal to increase caloric density.</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-500/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-500/20">
                      <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-bold mb-3"><CheckCircle2 size={20} /> 2. Protein Focus</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Ensure they are eating eggs or thick lentils at least twice a day.</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-500/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-500/20">
                      <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-bold mb-3"><CalendarHeart size={20} /> 3. Schedule Visit</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Schedule a follow-up weight measurement at the Anganwadi center next week.</p>
                    </div>
                  </>
                )}

                {child.risk === "healthy" && (
                  <>
                    <div className="bg-green-50 dark:bg-green-500/10 p-6 rounded-3xl border border-green-100 dark:border-green-500/20">
                      <div className="flex items-center gap-3 text-green-600 dark:text-green-400 font-bold mb-3"><CheckCircle2 size={20} /> 1. Great Job!</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Your child is growing perfectly. Keep up the excellent work!</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-500/10 p-6 rounded-3xl border border-green-100 dark:border-green-500/20">
                      <div className="flex items-center gap-3 text-green-600 dark:text-green-400 font-bold mb-3"><Apple size={20} /> 2. Maintain Diet</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Continue feeding them a balanced diet of rice, dal, and fresh vegetables.</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-500/10 p-6 rounded-3xl border border-green-100 dark:border-green-500/20">
                      <div className="flex items-center gap-3 text-green-600 dark:text-green-400 font-bold mb-3"><CalendarHeart size={20} /> 3. Next Checkup</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">No urgent action needed. Return for a routine checkup in 3 months.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Side Panel - 4 Columns */}
          <div className="col-span-4 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-none h-full">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <User size={24} style={{ color: themeColor }} />
                Assessment Details
              </h3>
              
              <div className="space-y-6">
                {/* Real Z-Score Calculation block */}
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${themeColor}20`, color: themeColor }}>
                    <Calculator size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight">WHO Z-Score: {zScore > 0 ? "+" : ""}{zScore} SD</p>
                    <p className="text-sm text-slate-500 mt-2">
                      {explanation} based on {child.gender}, {child.ageMonths}m, {child.weightKg}kg.
                    </p>
                  </div>
                </div>

                {child.flags.map((flag: string, idx: number) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${themeColor}20`, color: themeColor }}>
                      {flag === "None" ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{flag}</p>
                      <p className="text-sm text-slate-500 mt-2">
                        {flag === "None" ? "No developmental or nutritional red flags detected." : "Detected via multi-modal AI analysis. Immediate intervention protocol recommended."}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="mt-8 p-6 rounded-3xl" style={{ backgroundColor: `${themeColor}10`, border: `1px solid ${themeColor}30` }}>
                  <p className="text-sm font-semibold" style={{ color: themeColor }}>
                    {isCritical ? "Clinical action required immediately. Notify PHC supervisor." : isWarning ? "Schedule follow-up in 15 days to monitor velocity." : "Maintain routine ICDS monitoring schedule."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

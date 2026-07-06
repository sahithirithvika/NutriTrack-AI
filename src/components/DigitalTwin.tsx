"use client";

import { ArrowLeft, Activity, ShieldAlert, BrainCircuit, FileText, Download, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DigitalTwin() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      {/* Clinical Header */}
      <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-md flex items-center justify-center border border-slate-300 dark:border-slate-700">
              <UserIcon size={24} className="text-slate-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Aarav Sharma</h1>
                <span className="bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border border-red-200 dark:border-red-500/20">
                  Critical Risk
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-0.5">ID: NT-8492 • 36 Months • Male • Anganwadi Center 4</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => toast.info("Opening full clinical history panel...")}
            className="px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
          >
            Clinical History
          </button>
          <button 
            onClick={() => toast.success("Dossier exported securely.")}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md text-sm font-semibold hover:opacity-90 flex items-center gap-2 shadow-sm"
          >
            <Download size={16} /> Export Dossier
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8">
        <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          {/* Main Clinical Chart - 8 Columns */}
          <div className="col-span-8 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Activity size={16} /> Growth Trajectory vs WHO/ICDS Reference
                </h2>
                <span className="text-xs font-semibold text-slate-400">Last updated: 2 days ago</span>
              </div>
              
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
                <div className="flex gap-10 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Current Weight</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">12.0 <span className="text-lg text-slate-400 font-medium">kg</span></p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Weight Velocity (3mo)</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">-1.2 <span className="text-lg text-red-400/50 font-medium">kg</span></p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">AI Prediction (6mo)</p>
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-500">SAM Onset</p>
                  </div>
                </div>

                <div className="relative h-64 w-full border-b border-l border-slate-300 dark:border-slate-700 ml-6">
                  {/* Y axis labels */}
                  <div className="absolute -left-8 bottom-0 text-xs text-slate-400">10kg</div>
                  <div className="absolute -left-8 top-1/2 text-xs text-slate-400">15kg</div>
                  <div className="absolute -left-8 top-0 text-xs text-slate-400">20kg</div>
                  
                  {/* X axis labels */}
                  <div className="absolute left-0 -bottom-6 text-xs text-slate-400">24m</div>
                  <div className="absolute left-1/4 -bottom-6 text-xs text-slate-400">30m</div>
                  <div className="absolute left-1/2 -bottom-6 text-xs font-bold text-slate-900 dark:text-white">36m (Now)</div>
                  <div className="absolute right-0 -bottom-6 text-xs font-bold text-amber-600">42m (Pred)</div>

                  {/* SVG Chart */}
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* WHO Green Zone */}
                    <path d="M 0,80 Q 50,50 100,20 L 100,60 Q 50,90 0,120 Z" fill="var(--color-bio-green)" opacity="0.1" />
                    {/* Actual Path */}
                    <path d="M 0,100 Q 25,95 50,110" fill="none" stroke="currentColor" className="text-slate-900 dark:text-white" strokeWidth="2" />
                    <circle cx="0%" cy="100px" r="4" fill="currentColor" className="text-slate-900 dark:text-white" />
                    <circle cx="25%" cy="95px" r="4" fill="currentColor" className="text-slate-900 dark:text-white" />
                    <circle cx="50%" cy="110px" r="5" fill="currentColor" className="text-red-500" strokeWidth="2" stroke="white" />
                    {/* Prediction Path */}
                    <path d="M 50,110 Q 75,130 100,150" fill="none" stroke="currentColor" className="text-amber-500" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-4">
                <FileText size={16} /> Clinical Notes
              </h2>
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
                Patient exhibits lethargy and flatlined weight velocity over the past 90 days. Ambient voice logs from Anganwadi worker indicate absence of 3-word sentence formulation, suggesting developmental speech delay in addition to nutritional risks. Immediate nutritional intervention recommended to prevent Severe Acute Malnutrition (SAM).
              </div>
            </section>
          </div>

          {/* Right Sidebar - 4 Columns */}
          <div className="col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">AI Risk Factors</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Weight Velocity</p>
                    <p className="text-xs text-slate-500 mt-0.5">Bottom 5th percentile for age group.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <BrainCircuit size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Speech Delay</p>
                    <p className="text-xs text-slate-500 mt-0.5">Failure to formulate 3-word sentences at 36m.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">Milestone Log</h3>
              <div className="relative border-l border-slate-200 dark:border-slate-700 ml-2 space-y-6 pb-2 mt-2">
                <div className="relative pl-6">
                  <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-white dark:ring-slate-950"></div>
                  <p className="text-xs font-bold text-red-500">36 Months</p>
                  <p className="text-sm text-slate-900 dark:text-white font-medium">Missed: Complex sentences</p>
                </div>
                <div className="relative pl-6 opacity-60">
                  <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-950"></div>
                  <p className="text-xs font-bold text-slate-500">24 Months</p>
                  <p className="text-sm text-slate-900 dark:text-white font-medium">Achieved: Independent walking</p>
                </div>
                <div className="relative pl-6 opacity-60">
                  <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-950"></div>
                  <p className="text-xs font-bold text-slate-500">12 Months</p>
                  <p className="text-sm text-slate-900 dark:text-white font-medium">Achieved: First words</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

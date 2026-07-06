"use client";

import { useState } from "react";
import { X, UserPlus, Scale, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { calculateNutritionalRisk } from "@/lib/who-zscore";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPatientModal({ isOpen, onClose }: Props) {
  const addChild = useAppStore(state => state.addChild);
  const children = useAppStore(state => state.children);

  const [name, setName] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [gender, setGender] = useState("Male");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ageMonths || !weightKg) {
      toast.error("Please fill in all fields.");
      return;
    }

    const age = parseInt(ageMonths);
    const weight = parseFloat(weightKg);

    // AI/Mathematical Risk Calculation
    const { risk } = calculateNutritionalRisk(age, weight, gender);

    const newId = `c${children.length + 1}`;

    addChild({
      id: newId,
      name,
      ageMonths: age,
      weightKg: weight,
      gender,
      risk,
      location: "New Registration",
      flags: ["Newly Registered"],
      velocity3mo: 0,
      aiPrediction: "Monitoring Started",
      password: "password123" // Default password for demo
    });

    toast.success(`${name} registered successfully with ID: ${newId}. Risk: ${risk.toUpperCase()}`);
    
    // Reset and close
    setName("");
    setAgeMonths("");
    setWeightKg("");
    setGender("Male");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          ></motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center">
                <UserPlus size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Register Patient</h2>
                <p className="text-sm text-slate-500">Add a new child to the ICDS network.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><User size={16} /></div>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium" placeholder="e.g. Rahul Sharma" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Age (Months)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Calendar size={16} /></div>
                    <input type="number" value={ageMonths} onChange={e => setAgeMonths(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium" placeholder="e.g. 24" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Weight (kg)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Scale size={16} /></div>
                    <input type="number" step="0.1" value={weightKg} onChange={e => setWeightKg(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium" placeholder="e.g. 10.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium appearance-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <button type="submit" className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-1">
                Save & Analyze Risk
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

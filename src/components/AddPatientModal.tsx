"use client";

import { useState } from "react";
import { X, UserPlus, Scale, Calendar, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { calculateNutritionalRisk } from "@/lib/who-zscore";
import { toast } from "sonner";

interface Props { isOpen: boolean; onClose: () => void; }

export default function AddPatientModal({ isOpen, onClose }: Props) {
  const addChild   = useAppStore(state => state.addChild);
  const children   = useAppStore(state => state.children);

  const [name,      setName]      = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [weightKg,  setWeightKg]  = useState("");
  const [gender,    setGender]    = useState("Male");
  const [loading,   setLoading]   = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ageMonths || !weightKg) { toast.error("Please fill in all fields."); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 500));

    const age    = parseInt(ageMonths);
    const weight = parseFloat(weightKg);
    const { risk } = calculateNutritionalRisk(age, weight, gender);
    const newId  = `c${children.length + 1}`;

    addChild({ id: newId, name, ageMonths: age, weightKg: weight, gender, risk,
      location: "New Registration", flags: ["Newly Registered"],
      velocity3mo: 0, aiPrediction: "Monitoring Started", password: "password123" });

    toast.success(`${name} registered! ID: ${newId} · Risk: ${risk.toUpperCase()}`);
    setName(""); setAgeMonths(""); setWeightKg(""); setGender("Male");
    setLoading(false);
    onClose();
  };

  const fieldClass = "w-full py-3 px-4 rounded-2xl text-sm font-medium transition-all";
  const fieldStyle = { background: "rgba(200,230,201,0.25)", border: "1.5px solid #C8E6C9", color: "var(--color-bio-green)" };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ background: "rgba(27,94,32,0.35)", backdropFilter: "blur(6px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "#FDFAF4", border: "1.5px solid #C8E6C9", boxShadow: "0 32px 80px rgba(27,94,32,0.25)" }}
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #1B5E20, #4CAF50, #1B5E20)" }} />

            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-7">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #1B5E20, #43A047)" }}>
                    <UserPlus size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black" style={{ color: "var(--color-bio-green)" }}>Register Patient</h2>
                    <p className="text-xs font-medium mt-0.5" style={{ color: "#6B7B6B" }}>Add child to the ICDS network</p>
                  </div>
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "#E8F5E9", color: "#1B5E20" }}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest pl-1" style={{ color: "var(--color-bio-green-mid)" }}>Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User size={15} style={{ color: "var(--color-bio-green-mid)" }} />
                    </div>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className={`${fieldClass} pl-10`} style={fieldStyle} />
                  </div>
                </div>

                {/* Age + Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest pl-1" style={{ color: "var(--color-bio-green-mid)" }}>Age (Months)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Calendar size={15} style={{ color: "var(--color-bio-green-mid)" }} />
                      </div>
                      <input type="number" value={ageMonths} onChange={e => setAgeMonths(e.target.value)}
                        placeholder="e.g. 24"
                        className={`${fieldClass} pl-10`} style={fieldStyle} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest pl-1" style={{ color: "var(--color-bio-green-mid)" }}>Weight (kg)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Scale size={15} style={{ color: "var(--color-bio-green-mid)" }} />
                      </div>
                      <input type="number" step="0.1" value={weightKg} onChange={e => setWeightKg(e.target.value)}
                        placeholder="e.g. 10.5"
                        className={`${fieldClass} pl-10`} style={fieldStyle} />
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest pl-1" style={{ color: "var(--color-bio-green-mid)" }}>Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)}
                    className={`${fieldClass} appearance-none`} style={fieldStyle}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 mt-2"
                  style={{
                    background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)",
                    boxShadow: "0 8px 32px rgba(46,125,50,0.35)",
                    opacity: loading ? 0.8 : 1,
                  }}
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <><Sparkles size={16} /> Analyze &amp; Register</>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import { create } from 'zustand';

export type RiskLevel = 'healthy' | 'warning' | 'critical';

export interface Child {
  id: string;
  name: string;
  ageMonths: number;
  weightKg: number;
  risk: RiskLevel;
  gender: string;
  location: string;
  flags: string[];
  velocity3mo: number;
  aiPrediction: string;
  password?: string;
}

interface AppState {
  children: Child[];
  currentUser: string | null; // 'admin' or 'c1', 'c2', etc.
  login: (user: string) => void;
  logout: () => void;
  addChild: (child: Child) => void;
  updateChild: (id: string, updates: Partial<Child>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
  children: [
    { 
      id: "c1", 
      name: "Aarav Sharma", 
      ageMonths: 36, 
      weightKg: 12.0, 
      risk: "critical",
      gender: "Male",
      location: "Anganwadi Center 4",
      flags: ["Lethargy", "Speech Delay"],
      velocity3mo: -1.2,
      aiPrediction: "SAM Onset",
      password: "password123"
    },
    { 
      id: "c2", 
      name: "Meera Patel", 
      ageMonths: 24, 
      weightKg: 10.5, 
      risk: "healthy",
      gender: "Female",
      location: "Anganwadi Center 2",
      flags: ["None"],
      velocity3mo: +0.8,
      aiPrediction: "Optimal Growth",
      password: "password123"
    },
    { 
      id: "c3", 
      name: "Rohan Kumar", 
      ageMonths: 42, 
      weightKg: 13.1, 
      risk: "warning",
      gender: "Male",
      location: "Anganwadi Center 4",
      flags: ["Mild Stunting"],
      velocity3mo: -0.4,
      aiPrediction: "MAM Risk",
      password: "password123"
    },
    { 
      id: "c4", 
      name: "Diya Singh", 
      ageMonths: 18, 
      weightKg: 8.2, 
      risk: "critical",
      gender: "Female",
      location: "Anganwadi Center 1",
      flags: ["Frequent Infections"],
      velocity3mo: -0.9,
      aiPrediction: "SAM Risk",
      password: "password123"
    },
    { 
      id: "c5", 
      name: "Kabir Das", 
      ageMonths: 48, 
      weightKg: 15.5, 
      risk: "healthy",
      gender: "Male",
      location: "Anganwadi Center 2",
      flags: ["None"],
      velocity3mo: +0.5,
      aiPrediction: "Optimal Growth",
      password: "password123"
    }
  ],
  addChild: (child) => set((state) => ({ children: [...state.children, child] })),
  updateChild: (id, updates) => set((state) => ({
    children: state.children.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
}));

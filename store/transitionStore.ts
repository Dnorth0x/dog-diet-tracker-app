import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransitionPlan, TransitionProgress } from '@/types/TransitionPhase';
import { sampleTransitionPlan } from '@/constants/sampleData';

interface TransitionState {
  plans: TransitionPlan[];
  isLoading: boolean;
  
  // Actions
  addPlan: (plan: Omit<TransitionPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlan: (id: string, updates: Partial<TransitionPlan>) => void;
  deletePlan: (id: string) => void;
  getActivePlan: (dogId: string) => TransitionPlan | null;
  getPlansForDog: (dogId: string) => TransitionPlan[];
  getCurrentProgress: (planId: string) => TransitionProgress | null;
  deactivateAllPlans: (dogId: string) => void;
}

export const useTransitionStore = create<TransitionState>()(
  persist(
    (set, get) => ({
      plans: [sampleTransitionPlan], // Start with sample data
      isLoading: false,
      
      addPlan: (planData) => {
        const newPlan: TransitionPlan = {
          ...planData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set(state => ({
          plans: [...state.plans, newPlan],
        }));
      },
      
      updatePlan: (id, updates) => {
        set(state => ({
          plans: state.plans.map(plan =>
            plan.id === id
              ? { ...plan, ...updates, updatedAt: new Date() }
              : plan
          ),
        }));
      },
      
      deletePlan: (id) => {
        set(state => ({
          plans: state.plans.filter(plan => plan.id !== id),
        }));
      },
      
      getActivePlan: (dogId) => {
        return get().plans.find(plan => plan.dogId === dogId && plan.isActive) || null;
      },
      
      getPlansForDog: (dogId) => {
        return get().plans.filter(plan => plan.dogId === dogId);
      },
      
      getCurrentProgress: (planId) => {
        const plan = get().plans.find(p => p.id === planId);
        if (!plan) return null;
        
        const today = new Date();
        const daysSinceStart = Math.floor(
          (today.getTime() - plan.startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
        
        const currentPhase = plan.phases.find(
          phase => daysSinceStart >= phase.startDay && daysSinceStart <= phase.endDay
        ) || plan.phases[plan.phases.length - 1];
        
        const percentComplete = Math.min(100, (daysSinceStart / plan.totalDays) * 100);
        const daysRemaining = Math.max(0, plan.totalDays - daysSinceStart + 1);
        
        return {
          currentDay: daysSinceStart,
          currentPhase,
          daysRemaining,
          percentComplete,
          adherenceRate: 85, // TODO: Calculate from feeding entries
        };
      },
      
      deactivateAllPlans: (dogId) => {
        set(state => ({
          plans: state.plans.map(plan =>
            plan.dogId === dogId ? { ...plan, isActive: false } : plan
          ),
        }));
      },
    }),
    {
      name: 'transition-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false;
      },
    }
  )
);
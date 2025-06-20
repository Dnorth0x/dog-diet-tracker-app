import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '@/types/common';

interface AppSettingsState extends AppSettings {
  isLoading: boolean;
  
  // Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  weightUnit: 'pounds',
  foodUnit: 'cups',
  reminderEnabled: false,
  reminderTime: '08:00',
  transitionReminderEnabled: true,
  theme: 'system',
};

export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      isLoading: false,
      
      updateSettings: (updates) => {
        set(state => ({ ...state, ...updates }));
      },
      
      resetSettings: () => {
        set({ ...defaultSettings, isLoading: false });
      },
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false;
      },
    }
  )
);
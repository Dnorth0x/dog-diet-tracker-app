import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '@/types/common';

interface AppSettingsState extends AppSettings {
  isLoading: boolean;
  
  // Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  getColors: () => any;
  getFontSizes: () => any;
}

const defaultSettings: AppSettings = {
  weightUnit: 'pounds',
  foodUnit: 'cups',
  reminderEnabled: false,
  reminderTime: '08:00',
  transitionReminderEnabled: true,
  theme: 'light',
  accentColor: 'blue',
  fontSize: 'medium',
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
      
      getColors: () => {
        const { theme, accentColor } = get();
        const { getColors } = require('@/constants/colors');
        return getColors(theme, accentColor);
      },
      
      getFontSizes: () => {
        const { fontSize } = get();
        const { fontSizes } = require('@/constants/colors');
        return fontSizes[fontSize as keyof typeof fontSizes];
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
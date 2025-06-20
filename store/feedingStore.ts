import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeedingEntry } from '@/types/FeedingEntry';
import { sampleFeedingEntries } from '@/constants/sampleData';

interface FeedingState {
  entries: FeedingEntry[];
  isLoading: boolean;
  
  // Actions
  addEntry: (entry: Omit<FeedingEntry, 'id' | 'createdAt' | 'updatedAt' | 'averageWeight'>) => void;
  updateEntry: (id: string, updates: Partial<FeedingEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesForDog: (dogId: string) => FeedingEntry[];
  getEntryByDate: (dogId: string, date: string) => FeedingEntry | undefined;
  getRecentEntries: (dogId: string, days: number) => FeedingEntry[];
}

const calculateAverageWeight = (amWeight?: number, pmWeight?: number): number | undefined => {
  if (amWeight && pmWeight) {
    return Math.round((amWeight + pmWeight) / 2 * 10) / 10;
  }
  return amWeight || pmWeight;
};

export const useFeedingStore = create<FeedingState>()(
  persist(
    (set, get) => ({
      entries: sampleFeedingEntries, // Start with sample data
      isLoading: false,
      
      addEntry: (entryData) => {
        const averageWeight = calculateAverageWeight(entryData.amWeight, entryData.pmWeight);
        
        const newEntry: FeedingEntry = {
          ...entryData,
          id: Date.now().toString(),
          averageWeight,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set(state => ({
          entries: [...state.entries, newEntry],
        }));
      },
      
      updateEntry: (id, updates) => {
        set(state => ({
          entries: state.entries.map(entry => {
            if (entry.id === id) {
              const updatedEntry = { ...entry, ...updates, updatedAt: new Date() };
              updatedEntry.averageWeight = calculateAverageWeight(
                updatedEntry.amWeight, 
                updatedEntry.pmWeight
              );
              return updatedEntry;
            }
            return entry;
          }),
        }));
      },
      
      deleteEntry: (id) => {
        set(state => ({
          entries: state.entries.filter(entry => entry.id !== id),
        }));
      },
      
      getEntriesForDog: (dogId) => {
        return get().entries
          .filter(entry => entry.dogId === dogId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      
      getEntryByDate: (dogId, date) => {
        return get().entries.find(entry => entry.dogId === dogId && entry.date === date);
      },
      
      getRecentEntries: (dogId, days) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return get().entries
          .filter(entry => 
            entry.dogId === dogId && 
            new Date(entry.date) >= cutoffDate
          )
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
    }),
    {
      name: 'feeding-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false;
      },
    }
  )
);
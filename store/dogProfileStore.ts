import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DogProfile, DogGoal } from '@/types/DogProfile';
import { sampleDog } from '@/constants/sampleData';

interface DogProfileState {
  profiles: DogProfile[];
  activeProfileId: string | null;
  isLoading: boolean;
  
  // Actions
  addProfile: (profile: Omit<DogProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProfile: (id: string, updates: Partial<DogProfile>) => void;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;
  getActiveProfile: () => DogProfile | null;
  getProfileById: (id: string) => DogProfile | null;
}

export const useDogProfileStore = create<DogProfileState>()(
  persist(
    (set, get) => ({
      profiles: [sampleDog], // Start with sample data
      activeProfileId: sampleDog.id,
      isLoading: false,
      
      addProfile: (profileData) => {
        const newProfile: DogProfile = {
          ...profileData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set(state => ({
          profiles: [...state.profiles, newProfile],
          activeProfileId: state.activeProfileId || newProfile.id,
        }));
      },
      
      updateProfile: (id, updates) => {
        set(state => ({
          profiles: state.profiles.map(profile =>
            profile.id === id
              ? { ...profile, ...updates, updatedAt: new Date() }
              : profile
          ),
        }));
      },
      
      deleteProfile: (id) => {
        set(state => {
          const newProfiles = state.profiles.filter(p => p.id !== id);
          const newActiveId = state.activeProfileId === id 
            ? (newProfiles[0]?.id || null)
            : state.activeProfileId;
          
          return {
            profiles: newProfiles,
            activeProfileId: newActiveId,
          };
        });
      },
      
      setActiveProfile: (id) => {
        set({ activeProfileId: id });
      },
      
      getActiveProfile: () => {
        const { profiles, activeProfileId } = get();
        return profiles.find(p => p.id === activeProfileId) || null;
      },
      
      getProfileById: (id) => {
        return get().profiles.find(p => p.id === id) || null;
      },
    }),
    {
      name: 'dog-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false;
      },
    }
  )
);
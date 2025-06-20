import { UUID } from './common';

export interface FeedingEntry {
  id: UUID;
  dogId: UUID;
  date: string; // YYYY-MM-DD format
  amWeight?: number; // pounds
  pmWeight?: number; // pounds
  averageWeight?: number; // calculated
  foodAmount: number; // cups or grams
  calories: number;
  notes?: string;
  followedPlanToday: boolean;
  oldFoodAmount?: number; // for transition tracking
  newFoodAmount?: number; // for transition tracking
  createdAt: Date;
  updatedAt: Date;
}

export interface WeightTrend {
  date: string;
  weight: number;
  trend: 'up' | 'down' | 'stable';
}
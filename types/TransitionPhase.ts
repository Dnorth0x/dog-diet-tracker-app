import { UUID } from './common';

export interface TransitionPhase {
  id: UUID;
  phaseLabel: string;
  startDay: number;
  endDay: number;
  newFoodPercentage: number; // 0-100
  oldFoodPercentage: number; // 0-100
  description?: string;
}

export interface TransitionPlan {
  id: UUID;
  dogId: UUID;
  name: string;
  startDate: Date;
  phases: TransitionPhase[];
  oldFoodName: string;
  newFoodName: string;
  totalDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransitionProgress {
  currentDay: number;
  currentPhase: TransitionPhase;
  daysRemaining: number;
  percentComplete: number;
  adherenceRate: number; // percentage of days followed
}
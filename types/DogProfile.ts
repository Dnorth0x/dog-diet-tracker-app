import { UUID } from './common';

export interface DogProfile {
  id: UUID;
  name: string;
  breed: string;
  dateOfBirth: Date;
  idealWeight: number; // in pounds
  currentWeight?: number;
  notes?: string;
  allergies?: string[];
  photoUri?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DogGoal {
  type: 'maintain' | 'lose' | 'gain';
  targetWeight?: number;
  targetDate?: Date;
  weeklyWeightChange?: number; // pounds per week
}
import { DogProfile } from '@/types/DogProfile';
import { FeedingEntry } from '@/types/FeedingEntry';
import { TransitionPhase, TransitionPlan } from '@/types/TransitionPhase';

export const sampleDog: DogProfile = {
  id: 'sample-dog-1',
  name: 'Devo',
  breed: 'Mixed',
  dateOfBirth: new Date('2020-01-01'),
  idealWeight: 25.0,
  currentWeight: 27.5,
  notes: 'Prefers lamb-based food. Transition started June 1st.',
  allergies: ['chicken', 'corn'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const defaultTransitionPhases: TransitionPhase[] = [
  {
    id: 'phase-1',
    phaseLabel: 'Days 1-3',
    startDay: 1,
    endDay: 3,
    newFoodPercentage: 25,
    oldFoodPercentage: 75,
    description: 'Start with 25% new food mixed with 75% old food',
  },
  {
    id: 'phase-2',
    phaseLabel: 'Days 4-6',
    startDay: 4,
    endDay: 6,
    newFoodPercentage: 50,
    oldFoodPercentage: 50,
    description: 'Equal parts new and old food',
  },
  {
    id: 'phase-3',
    phaseLabel: 'Days 7-9',
    startDay: 7,
    endDay: 9,
    newFoodPercentage: 75,
    oldFoodPercentage: 25,
    description: '75% new food with 25% old food',
  },
  {
    id: 'phase-4',
    phaseLabel: 'Days 10-12',
    startDay: 10,
    endDay: 12,
    newFoodPercentage: 90,
    oldFoodPercentage: 10,
    description: 'Almost fully transitioned to new food',
  },
  {
    id: 'phase-5',
    phaseLabel: 'Day 13+',
    startDay: 13,
    endDay: 14,
    newFoodPercentage: 100,
    oldFoodPercentage: 0,
    description: 'Complete transition to new food',
  },
];

export const sampleTransitionPlan: TransitionPlan = {
  id: 'transition-1',
  dogId: sampleDog.id,
  name: 'Lamb to Salmon Transition',
  startDate: new Date('2024-06-01'),
  phases: defaultTransitionPhases,
  oldFoodName: 'Lamb & Rice Formula',
  newFoodName: 'Salmon & Sweet Potato',
  totalDays: 14,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const sampleFeedingEntries: FeedingEntry[] = [
  {
    id: 'entry-1',
    dogId: sampleDog.id,
    date: '2024-06-01',
    amWeight: 27.8,
    pmWeight: 27.6,
    averageWeight: 27.7,
    foodAmount: 2.5,
    calories: 850,
    followedPlanToday: true,
    oldFoodAmount: 1.875, // 75% of 2.5
    newFoodAmount: 0.625, // 25% of 2.5
    notes: 'Started transition today. Devo seems to like the new food!',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: 'entry-2',
    dogId: sampleDog.id,
    date: '2024-06-02',
    amWeight: 27.5,
    pmWeight: 27.4,
    averageWeight: 27.45,
    foodAmount: 2.5,
    calories: 850,
    followedPlanToday: true,
    oldFoodAmount: 1.875,
    newFoodAmount: 0.625,
    createdAt: new Date('2024-06-02'),
    updatedAt: new Date('2024-06-02'),
  },
];
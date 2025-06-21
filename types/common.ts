export type UUID = string;

export interface BaseEntity {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSettings {
  weightUnit: 'pounds' | 'kilograms';
  foodUnit: 'cups' | 'grams';
  reminderEnabled: boolean;
  reminderTime: string; // HH:MM format
  transitionReminderEnabled: boolean;
  theme: 'light' | 'dark';
  accentColor: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  fontSize: 'small' | 'medium' | 'large';
  animationSpeed: 'slow' | 'normal' | 'fast';
  cardRadius: 'sharp' | 'rounded' | 'very-rounded';
}
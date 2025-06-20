export interface CaloricGuidance {
  weightRangeLow: number; // pounds
  weightRangeHigh: number; // pounds
  maintainCalories: number;
  loseWeightCalories: number;
  gainWeightCalories: number;
  activityMultiplier: {
    sedentary: number;
    moderate: number;
    active: number;
    veryActive: number;
  };
}

export interface FoodRecommendation {
  caloriesPerCup: number;
  recommendedCups: number;
  brandName?: string;
  foodType: 'dry' | 'wet' | 'raw' | 'mixed';
}

export type ActivityLevel = 'sedentary' | 'moderate' | 'active' | 'veryActive';
export type WeightGoal = 'maintain' | 'lose' | 'gain';
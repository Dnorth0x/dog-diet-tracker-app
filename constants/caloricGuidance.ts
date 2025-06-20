import { CaloricGuidance } from '@/types/CaloricGuidance';

export const caloricGuidanceTable: CaloricGuidance[] = [
  {
    weightRangeLow: 5,
    weightRangeHigh: 10,
    maintainCalories: 300,
    loseWeightCalories: 240,
    gainWeightCalories: 360,
    activityMultiplier: {
      sedentary: 0.8,
      moderate: 1.0,
      active: 1.2,
      veryActive: 1.4,
    },
  },
  {
    weightRangeLow: 11,
    weightRangeHigh: 20,
    maintainCalories: 500,
    loseWeightCalories: 400,
    gainWeightCalories: 600,
    activityMultiplier: {
      sedentary: 0.8,
      moderate: 1.0,
      active: 1.2,
      veryActive: 1.4,
    },
  },
  {
    weightRangeLow: 21,
    weightRangeHigh: 35,
    maintainCalories: 750,
    loseWeightCalories: 600,
    gainWeightCalories: 900,
    activityMultiplier: {
      sedentary: 0.8,
      moderate: 1.0,
      active: 1.2,
      veryActive: 1.4,
    },
  },
  {
    weightRangeLow: 36,
    weightRangeHigh: 50,
    maintainCalories: 1000,
    loseWeightCalories: 800,
    gainWeightCalories: 1200,
    activityMultiplier: {
      sedentary: 0.8,
      moderate: 1.0,
      active: 1.2,
      veryActive: 1.4,
    },
  },
  {
    weightRangeLow: 51,
    weightRangeHigh: 75,
    maintainCalories: 1300,
    loseWeightCalories: 1040,
    gainWeightCalories: 1560,
    activityMultiplier: {
      sedentary: 0.8,
      moderate: 1.0,
      active: 1.2,
      veryActive: 1.4,
    },
  },
  {
    weightRangeLow: 76,
    weightRangeHigh: 100,
    maintainCalories: 1600,
    loseWeightCalories: 1280,
    gainWeightCalories: 1920,
    activityMultiplier: {
      sedentary: 0.8,
      moderate: 1.0,
      active: 1.2,
      veryActive: 1.4,
    },
  },
];

export const getCaloriesForWeight = (
  weight: number,
  goal: 'maintain' | 'lose' | 'gain',
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'veryActive' = 'moderate'
): number => {
  const guidance = caloricGuidanceTable.find(
    g => weight >= g.weightRangeLow && weight <= g.weightRangeHigh
  );
  
  if (!guidance) {
    // Fallback calculation for weights outside our table
    const baseCalories = weight * 30; // rough estimate: 30 calories per pound
    const goalMultiplier = goal === 'lose' ? 0.8 : goal === 'gain' ? 1.2 : 1.0;
    const activityMultipliers = { sedentary: 0.8, moderate: 1.0, active: 1.2, veryActive: 1.4 };
    return Math.round(baseCalories * goalMultiplier * activityMultipliers[activityLevel]);
  }
  
  let baseCalories: number;
  switch (goal) {
    case 'lose':
      baseCalories = guidance.loseWeightCalories;
      break;
    case 'gain':
      baseCalories = guidance.gainWeightCalories;
      break;
    default:
      baseCalories = guidance.maintainCalories;
  }
  
  return Math.round(baseCalories * guidance.activityMultiplier[activityLevel]);
};

export const getFoodAmountForCalories = (
  calories: number,
  caloriesPerCup: number = 340 // average dry dog food
): number => {
  return Math.round((calories / caloriesPerCup) * 10) / 10; // round to 1 decimal
};
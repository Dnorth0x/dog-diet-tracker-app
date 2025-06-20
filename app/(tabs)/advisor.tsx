import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useDogProfileStore } from '@/store/dogProfileStore';
import { getCaloriesForWeight, getFoodAmountForCalories } from '@/constants/caloricGuidance';
import { WeightGoal, ActivityLevel } from '@/types/CaloricGuidance';
import Button from '@/components/Button';
import { Calculator, Target } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

export default function CalorieAdvisorScreen() {
  const { getActiveProfile } = useDogProfileStore();
  
  const activeProfile = getActiveProfile();
  
  const [currentWeight, setCurrentWeight] = useState(activeProfile?.currentWeight?.toString() || '');
  const [goal, setGoal] = useState<WeightGoal>('maintain');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [caloriesPerCup, setCaloriesPerCup] = useState('340');
  const [recommendation, setRecommendation] = useState<{
    calories: number;
    foodAmount: number;
  } | null>(null);
  
  const calculateRecommendation = () => {
    if (!currentWeight || isNaN(parseFloat(currentWeight))) {
      Alert.alert('Invalid Input', 'Please enter a valid current weight');
      return;
    }
    
    const weight = parseFloat(currentWeight);
    const caloriesPerCupNum = parseFloat(caloriesPerCup) || 340;
    
    const calories = getCaloriesForWeight(weight, goal, activityLevel);
    const foodAmount = getFoodAmountForCalories(calories, caloriesPerCupNum);
    
    setRecommendation({ calories, foodAmount });
  };
  
  const goalLabels = {
    maintain: 'Maintain Current Weight',
    lose: 'Lose Weight',
    gain: 'Gain Weight',
  };
  
  const activityLabels = {
    sedentary: 'Sedentary (minimal exercise)',
    moderate: 'Moderate (daily walks)',
    active: 'Active (regular exercise)',
    veryActive: 'Very Active (intense daily exercise)',
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Calorie Advisor",
          headerRight: () => (
            <Calculator size={24} color={colors.gray600} style={{ marginRight: 16 }} />
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Personalized Feeding Recommendations</Text>
          <Text style={styles.subtitle}>
            Get science-based calorie and portion recommendations for {activeProfile?.name || 'your dog'}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dog Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Current Weight (lbs)</Text>
            <TextInput
              style={styles.input}
              value={currentWeight}
              onChangeText={setCurrentWeight}
              placeholder="25.0"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.gray400}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Weight Goal</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={goal}
                onValueChange={setGoal}
                style={styles.picker}
              >
                {Object.entries(goalLabels).map(([value, label]) => (
                  <Picker.Item key={value} label={label} value={value} />
                ))}
              </Picker>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Activity Level</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={activityLevel}
                onValueChange={setActivityLevel}
                style={styles.picker}
              >
                {Object.entries(activityLabels).map(([value, label]) => (
                  <Picker.Item key={value} label={label} value={value} />
                ))}
              </Picker>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Food Calories per Cup</Text>
            <TextInput
              style={styles.input}
              value={caloriesPerCup}
              onChangeText={setCaloriesPerCup}
              placeholder="340"
              keyboardType="number-pad"
              placeholderTextColor={colors.gray400}
            />
            <Text style={styles.inputHint}>Check your dog food packaging for this information</Text>
          </View>
        </View>
        
        <Button
          title="Calculate Recommendation"
          onPress={calculateRecommendation}
          style={styles.calculateButton}
        />
        
        {recommendation && (
          <View style={styles.recommendationSection}>
            <View style={styles.recommendationHeader}>
              <Target size={24} color={colors.primary} />
              <Text style={styles.recommendationTitle}>Your Recommendation</Text>
            </View>
            
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationLabel}>Daily Calories</Text>
                <Text style={styles.recommendationValue}>{recommendation.calories} cal</Text>
              </View>
              
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationLabel}>Daily Food Amount</Text>
                <Text style={styles.recommendationValue}>{recommendation.foodAmount} cups</Text>
              </View>
            </View>
            
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                💡 This is a general guideline. Consult your veterinarian for personalized advice, especially if your dog has health conditions or special dietary needs.
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feeding Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tip}>• Divide daily food into 2-3 meals for better digestion</Text>
            <Text style={styles.tip}>• Adjust portions based on body condition and activity</Text>
            <Text style={styles.tip}>• Monitor weight weekly and adjust as needed</Text>
            <Text style={styles.tip}>• Treats should not exceed 10% of daily calories</Text>
            <Text style={styles.tip}>• Fresh water should always be available</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray800,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray600,
    lineHeight: 22,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.gray800,
  },
  inputHint: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  calculateButton: {
    marginBottom: 16,
  },
  recommendationSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray800,
  },
  recommendationCard: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationLabel: {
    fontSize: 16,
    color: colors.white,
  },
  recommendationValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  disclaimer: {
    backgroundColor: colors.gray50,
    borderRadius: 8,
    padding: 12,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.gray600,
    lineHeight: 16,
  },
  tipsList: {
    gap: 8,
  },
  tip: {
    fontSize: 14,
    color: colors.gray700,
    lineHeight: 20,
  },
});
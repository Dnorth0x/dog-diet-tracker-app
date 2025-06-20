import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Switch, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useDogProfileStore } from '@/store/dogProfileStore';
import { useFeedingStore } from '@/store/feedingStore';
import { useTransitionStore } from '@/store/transitionStore';
import Button from '@/components/Button';
import { Calendar, Save } from 'lucide-react-native';

export default function DailyLogScreen() {
  const { getActiveProfile } = useDogProfileStore();
  const { addEntry, updateEntry, getEntryByDate } = useFeedingStore();
  const { getActivePlan, getCurrentProgress } = useTransitionStore();
  
  const activeProfile = getActiveProfile();
  const activePlan = activeProfile ? getActivePlan(activeProfile.id) : null;
  const progress = activePlan ? getCurrentProgress(activePlan.id) : null;
  
  const today = new Date().toISOString().split('T')[0];
  const existingEntry = activeProfile ? getEntryByDate(activeProfile.id, today) : null;
  
  const [amWeight, setAmWeight] = useState(existingEntry?.amWeight?.toString() || '');
  const [pmWeight, setPmWeight] = useState(existingEntry?.pmWeight?.toString() || '');
  const [foodAmount, setFoodAmount] = useState(existingEntry?.foodAmount?.toString() || '');
  const [calories, setCalories] = useState(existingEntry?.calories?.toString() || '');
  const [notes, setNotes] = useState(existingEntry?.notes || '');
  const [followedPlan, setFollowedPlan] = useState(existingEntry?.followedPlanToday ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate suggested food amounts based on transition plan
  const suggestedOldFood = progress && foodAmount ? 
    (parseFloat(foodAmount) * progress.currentPhase.oldFoodPercentage / 100).toFixed(1) : '';
  const suggestedNewFood = progress && foodAmount ? 
    (parseFloat(foodAmount) * progress.currentPhase.newFoodPercentage / 100).toFixed(1) : '';
  
  const handleSave = async () => {
    if (!activeProfile) {
      Alert.alert('Error', 'No active dog profile found');
      return;
    }
    
    if (!foodAmount || !calories) {
      Alert.alert('Missing Information', 'Please enter food amount and calories');
      return;
    }
    
    setIsSubmitting(true);
    
    const entryData = {
      dogId: activeProfile.id,
      date: today,
      amWeight: amWeight ? parseFloat(amWeight) : undefined,
      pmWeight: pmWeight ? parseFloat(pmWeight) : undefined,
      foodAmount: parseFloat(foodAmount),
      calories: parseInt(calories),
      notes: notes.trim() || undefined,
      followedPlanToday: followedPlan,
      oldFoodAmount: suggestedOldFood ? parseFloat(suggestedOldFood) : undefined,
      newFoodAmount: suggestedNewFood ? parseFloat(suggestedNewFood) : undefined,
    };
    
    try {
      if (existingEntry) {
        updateEntry(existingEntry.id, entryData);
      } else {
        addEntry(entryData);
      }
      
      Alert.alert('Success', 'Daily log saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save daily log');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate average weight safely
  const calculateAverageWeight = () => {
    const am = parseFloat(amWeight);
    const pm = parseFloat(pmWeight);
    if (!isNaN(am) && !isNaN(pm)) {
      return ((am + pm) / 2).toFixed(1);
    }
    return null;
  };
  
  if (!activeProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No active dog profile found. Please create a profile first.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: `${activeProfile.name}'s Daily Log`,
          headerRight: () => (
            <Calendar size={24} color={colors.gray600} style={{ marginRight: 16 }} />
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}</Text>
          {progress && (
            <View style={styles.transitionInfo}>
              <Text style={styles.transitionText}>
                Day {progress.currentDay} of {activePlan?.totalDays} - {progress.currentPhase.phaseLabel}
              </Text>
              <Text style={styles.transitionDescription}>
                {progress.currentPhase.description}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Tracking</Text>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>AM Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={amWeight}
                onChangeText={setAmWeight}
                placeholder="27.5"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.gray400}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>PM Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={pmWeight}
                onChangeText={setPmWeight}
                placeholder="27.3"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.gray400}
              />
            </View>
          </View>
          {calculateAverageWeight() && (
            <Text style={styles.averageWeight}>
              Average: {calculateAverageWeight()} lbs
            </Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food & Nutrition</Text>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Total Food (cups)</Text>
              <TextInput
                style={styles.input}
                value={foodAmount}
                onChangeText={setFoodAmount}
                placeholder="2.5"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.gray400}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Calories</Text>
              <TextInput
                style={styles.input}
                value={calories}
                onChangeText={setCalories}
                placeholder="850"
                keyboardType="number-pad"
                placeholderTextColor={colors.gray400}
              />
            </View>
          </View>
          
          {progress && foodAmount && (
            <View style={styles.transitionBreakdown}>
              <Text style={styles.breakdownTitle}>Food Mix Breakdown:</Text>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownText}>
                  {activePlan?.oldFoodName}: {suggestedOldFood} cups ({progress.currentPhase.oldFoodPercentage}%)
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownText}>
                  {activePlan?.newFoodName}: {suggestedNewFood} cups ({progress.currentPhase.newFoodPercentage}%)
                </Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan Adherence</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Followed transition plan today</Text>
            <Switch
              value={followedPlan}
              onValueChange={setFollowedPlan}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any observations about appetite, behavior, or health..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={colors.gray400}
          />
        </View>
        
        <Button
          title={existingEntry ? "Update Entry" : "Save Entry"}
          onPress={handleSave}
          isLoading={isSubmitting}
          style={styles.saveButton}
        />
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
  date: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray800,
    marginBottom: 8,
  },
  transitionInfo: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  transitionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  transitionDescription: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
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
  averageWeight: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  transitionBreakdown: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 8,
  },
  breakdownRow: {
    marginBottom: 4,
  },
  breakdownText: {
    fontSize: 14,
    color: colors.gray600,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    color: colors.gray700,
    flex: 1,
  },
  notesInput: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.gray800,
    minHeight: 100,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    margin: 20,
  },
});
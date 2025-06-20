import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useDogProfileStore } from '@/store/dogProfileStore';
import { useTransitionStore } from '@/store/transitionStore';
import TransitionProgressCard from '@/components/TransitionProgressCard';
import TransitionPhaseList from '@/components/TransitionPhaseList';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import { ArrowRightLeft, Plus } from 'lucide-react-native';

export default function TransitionScreen() {
  const { getActiveProfile } = useDogProfileStore();
  const { getActivePlan, getCurrentProgress, addPlan, deactivateAllPlans } = useTransitionStore();
  
  const activeProfile = getActiveProfile();
  const activePlan = activeProfile ? getActivePlan(activeProfile.id) : null;
  const progress = activePlan ? getCurrentProgress(activePlan.id) : null;
  
  const handleStartNewTransition = () => {
    Alert.alert(
      'Start New Transition',
      'This will deactivate any current transition plan. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start New', 
          onPress: () => {
            if (activeProfile) {
              deactivateAllPlans(activeProfile.id);
              // In a real app, navigate to transition setup screen
              Alert.alert('Feature Coming Soon', 'Transition plan creation will be available in the next update.');
            }
          }
        },
      ]
    );
  };
  
  if (!activeProfile) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="No Active Profile"
          message="Please create and select a dog profile to manage food transitions."
          buttonTitle="Go to Profile"
          onButtonPress={() => {}}
        />
      </View>
    );
  }
  
  if (!activePlan) {
    return (
      <>
        <Stack.Screen 
          options={{
            title: "Food Transition",
            headerRight: () => (
              <ArrowRightLeft size={24} color={colors.gray600} style={{ marginRight: 16 }} />
            ),
          }}
        />
        <View style={styles.container}>
          <EmptyState
            title="No Active Transition"
            message={`${activeProfile.name} doesn't have an active food transition plan. Start one to gradually switch between foods.`}
            buttonTitle="Start Transition"
            onButtonPress={handleStartNewTransition}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Food Transition",
          headerRight: () => (
            <ArrowRightLeft size={24} color={colors.gray600} style={{ marginRight: 16 }} />
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.planTitle}>{activePlan.name}</Text>
          <Text style={styles.planSubtitle}>
            {activePlan.oldFoodName} → {activePlan.newFoodName}
          </Text>
        </View>
        
        {progress && <TransitionProgressCard progress={progress} plan={activePlan} />}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transition Schedule</Text>
          <TransitionPhaseList 
            phases={activePlan.phases} 
            currentDay={progress?.currentDay || 1}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Success</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tip}>• Mix foods thoroughly to prevent selective eating</Text>
            <Text style={styles.tip}>• Monitor for digestive upset and slow down if needed</Text>
            <Text style={styles.tip}>• Keep meal times consistent during transition</Text>
            <Text style={styles.tip}>• Track daily adherence in your feeding log</Text>
            <Text style={styles.tip}>• Contact your vet if you notice persistent issues</Text>
          </View>
        </View>
        
        <Button
          title="Start New Transition"
          variant="outline"
          onPress={handleStartNewTransition}
          style={styles.newTransitionButton}
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
  planTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray800,
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 16,
    color: colors.gray600,
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
  tipsList: {
    gap: 8,
  },
  tip: {
    fontSize: 14,
    color: colors.gray700,
    lineHeight: 20,
  },
  newTransitionButton: {
    marginTop: 8,
    marginBottom: 40,
  },
});
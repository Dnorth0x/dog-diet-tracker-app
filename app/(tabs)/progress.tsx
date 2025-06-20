import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useDogProfileStore } from '@/store/dogProfileStore';
import { useFeedingStore } from '@/store/feedingStore';
import WeightChart from '@/components/WeightChart';
import StatsCard from '@/components/StatsCard';
import EmptyState from '@/components/EmptyState';
import { TrendingUp, Scale, Target, Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const { getActiveProfile } = useDogProfileStore();
  const { getEntriesForDog, getRecentEntries } = useFeedingStore();
  
  const activeProfile = getActiveProfile();
  const allEntries = activeProfile ? getEntriesForDog(activeProfile.id) : [];
  const recentEntries = activeProfile ? getRecentEntries(activeProfile.id, 30) : [];
  
  const calculateStats = () => {
    if (allEntries.length === 0) {
      return {
        currentWeight: activeProfile?.currentWeight || 0,
        weightChange: 0,
        averageCalories: 0,
        adherenceRate: 0,
        totalEntries: 0,
      };
    }
    
    const latestEntry = allEntries[0];
    const oldestEntry = allEntries[allEntries.length - 1];
    
    const currentWeight = latestEntry.averageWeight || latestEntry.amWeight || latestEntry.pmWeight || 0;
    const startWeight = oldestEntry.averageWeight || oldestEntry.amWeight || oldestEntry.pmWeight || 0;
    const weightChange = currentWeight - startWeight;
    
    const totalCalories = allEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const averageCalories = Math.round(totalCalories / allEntries.length);
    
    const followedPlanCount = allEntries.filter(entry => entry.followedPlanToday).length;
    const adherenceRate = Math.round((followedPlanCount / allEntries.length) * 100);
    
    return {
      currentWeight,
      weightChange,
      averageCalories,
      adherenceRate,
      totalEntries: allEntries.length,
    };
  };
  
  const stats = calculateStats();
  
  if (!activeProfile) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="No Active Profile"
          message="Please create and select a dog profile to view progress."
          buttonTitle="Go to Profile"
          onButtonPress={() => {}}
        />
      </View>
    );
  }
  
  if (allEntries.length < 2) {
    return (
      <>
        <Stack.Screen 
          options={{
            title: `${activeProfile.name}'s Progress`,
          }}
        />
        <View style={styles.container}>
          <EmptyState
            title="Not Enough Data"
            message="Add at least 2 daily log entries to see progress charts and trends."
            buttonTitle="Add Entry"
            onButtonPress={() => {}}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: `${activeProfile.name}'s Progress`,
          headerRight: () => (
            <TrendingUp size={24} color={colors.gray600} style={{ marginRight: 16 }} />
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <WeightChart entries={recentEntries} />
        
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        
        <View style={styles.statsRow}>
          <StatsCard
            title="Current Weight"
            value={`${stats.currentWeight.toFixed(1)} lbs`}
            subtitle={`Goal: ${activeProfile.idealWeight} lbs`}
            icon={<Scale size={24} color={colors.primary} />}
          />
          <StatsCard
            title="Weight Change"
            value={`${stats.weightChange >= 0 ? '+' : ''}${stats.weightChange.toFixed(1)} lbs`}
            subtitle="since start"
            icon={<Target size={24} color={stats.weightChange > 0 ? colors.warning : colors.success} />}
          />
        </View>
        
        <View style={styles.statsRow}>
          <StatsCard
            title="Avg. Calories"
            value={stats.averageCalories}
            subtitle="per day"
            icon={<TrendingUp size={24} color={colors.primary} />}
          />
          <StatsCard
            title="Plan Adherence"
            value={`${stats.adherenceRate}%`}
            subtitle={`${stats.totalEntries} total entries`}
            icon={<Calendar size={24} color={colors.primary} />}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Trends</Text>
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>Weight Trend (Last 7 Days)</Text>
            <Text style={[
              styles.trendValue,
              { color: stats.weightChange > 0 ? colors.warning : colors.success }
            ]}>
              {stats.weightChange > 0 ? 'Increasing' : stats.weightChange < 0 ? 'Decreasing' : 'Stable'}
            </Text>
          </View>
          
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>Feeding Consistency</Text>
            <Text style={[
              styles.trendValue,
              { color: stats.adherenceRate >= 80 ? colors.success : colors.warning }
            ]}>
              {stats.adherenceRate >= 80 ? 'Excellent' : stats.adherenceRate >= 60 ? 'Good' : 'Needs Improvement'}
            </Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: 12,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  trendLabel: {
    fontSize: 16,
    color: colors.gray700,
  },
  trendValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
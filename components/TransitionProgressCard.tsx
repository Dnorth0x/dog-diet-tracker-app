import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TransitionProgress, TransitionPlan } from '@/types/TransitionPhase';
import { useAppSettingsStore } from '@/store/appSettingsStore';
import { ArrowRight, Calendar, Target } from 'lucide-react-native';

interface TransitionProgressCardProps {
  progress: TransitionProgress;
  plan: TransitionPlan;
}

const TransitionProgressCard: React.FC<TransitionProgressCardProps> = ({ progress, plan }) => {
  const { getColors, getFontSizes, getBorderRadius } = useAppSettingsStore();
  const colors = getColors();
  const fontSizes = getFontSizes();
  const borderRadius = getBorderRadius();
  
  const getProgressColor = (percent: number) => {
    if (percent >= 80) return colors.success;
    if (percent >= 50) return colors.primary;
    if (percent >= 25) return colors.warning;
    return colors.error;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderRadius: borderRadius,
      padding: 16,
      marginBottom: 16,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: fontSizes.lg,
      fontWeight: '600',
      color: colors.gray800,
    },
    dayCounter: {
      fontSize: fontSizes.sm,
      color: colors.gray600,
      backgroundColor: colors.gray100,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: borderRadius * 0.33,
    },
    progressBarContainer: {
      marginBottom: 16,
    },
    progressBarBackground: {
      height: 8,
      backgroundColor: colors.gray200,
      borderRadius: borderRadius * 0.33,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressBarFill: {
      height: '100%',
      borderRadius: borderRadius * 0.33,
    },
    progressPercent: {
      fontSize: fontSizes.xs,
      color: colors.gray600,
      textAlign: 'center',
    },
    phaseInfo: {
      marginBottom: 16,
    },
    phaseTitle: {
      fontSize: fontSizes.base,
      fontWeight: '600',
      color: colors.gray800,
      marginBottom: 4,
    },
    phaseDescription: {
      fontSize: fontSizes.sm,
      color: colors.gray600,
      lineHeight: 20,
    },
    mixRatio: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    foodRatio: {
      flex: 1,
    },
    ratioBar: {
      height: 6,
      borderRadius: borderRadius * 0.25,
      overflow: 'hidden',
      marginBottom: 6,
    },
    ratioFill: {
      height: '100%',
      borderRadius: borderRadius * 0.25,
    },
    ratioLabel: {
      fontSize: fontSizes.xs,
      color: colors.gray600,
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.gray200,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    statText: {
      fontSize: fontSizes.xs,
      color: colors.gray600,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Current Progress</Text>
        <Text style={styles.dayCounter}>
          Day {progress.currentDay} of {plan.totalDays}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill,
              { 
                width: `${progress.percentComplete}%`,
                backgroundColor: getProgressColor(progress.percentComplete)
              }
            ]} 
          />
        </View>
        <Text style={styles.progressPercent}>
          {Math.round(progress.percentComplete)}% Complete
        </Text>
      </View>
      
      <View style={styles.phaseInfo}>
        <Text style={styles.phaseTitle}>{progress.currentPhase.phaseLabel}</Text>
        <Text style={styles.phaseDescription}>
          {progress.currentPhase.description}
        </Text>
      </View>
      
      <View style={styles.mixRatio}>
        <View style={styles.foodRatio}>
          <View style={[styles.ratioBar, { backgroundColor: colors.gray400 }]}>
            <View 
              style={[
                styles.ratioFill,
                { 
                  width: `${progress.currentPhase.oldFoodPercentage}%`,
                  backgroundColor: colors.gray600
                }
              ]} 
            />
          </View>
          <Text style={styles.ratioLabel}>
            {plan.oldFoodName}: {progress.currentPhase.oldFoodPercentage}%
          </Text>
        </View>
        
        <ArrowRight size={16} color={colors.gray400} />
        
        <View style={styles.foodRatio}>
          <View style={[styles.ratioBar, { backgroundColor: colors.gray200 }]}>
            <View 
              style={[
                styles.ratioFill,
                { 
                  width: `${progress.currentPhase.newFoodPercentage}%`,
                  backgroundColor: colors.primary
                }
              ]} 
            />
          </View>
          <Text style={styles.ratioLabel}>
            {plan.newFoodName}: {progress.currentPhase.newFoodPercentage}%
          </Text>
        </View>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Calendar size={16} color={colors.gray500} />
          <Text style={styles.statText}>
            {progress.daysRemaining} days remaining
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Target size={16} color={colors.gray500} />
          <Text style={styles.statText}>
            {Math.round(progress.adherenceRate)}% adherence
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TransitionProgressCard;
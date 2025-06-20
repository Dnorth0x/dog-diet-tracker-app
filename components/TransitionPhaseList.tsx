import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TransitionPhase } from '@/types/TransitionPhase';
import { colors } from '@/constants/colors';
import { CheckCircle, Circle, Clock } from 'lucide-react-native';

interface TransitionPhaseListProps {
  phases: TransitionPhase[];
  currentDay: number;
}

const TransitionPhaseList: React.FC<TransitionPhaseListProps> = ({ phases, currentDay }) => {
  const getPhaseStatus = (phase: TransitionPhase) => {
    if (currentDay > phase.endDay) return 'completed';
    if (currentDay >= phase.startDay && currentDay <= phase.endDay) return 'current';
    return 'upcoming';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color={colors.success} />;
      case 'current':
        return <Clock size={20} color={colors.primary} />;
      default:
        return <Circle size={20} color={colors.gray400} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'current':
        return colors.primary;
      default:
        return colors.gray400;
    }
  };

  return (
    <View style={styles.container}>
      {phases.map((phase, index) => {
        const status = getPhaseStatus(phase);
        const isLast = index === phases.length - 1;
        
        return (
          <View key={phase.id} style={styles.phaseItem}>
            <View style={styles.phaseIndicator}>
              {getStatusIcon(status)}
              {!isLast && (
                <View 
                  style={[
                    styles.connector,
                    { backgroundColor: status === 'completed' ? colors.success : colors.gray300 }
                  ]} 
                />
              )}
            </View>
            
            <View style={styles.phaseContent}>
              <View style={styles.phaseHeader}>
                <Text 
                  style={[
                    styles.phaseLabel,
                    { color: getStatusColor(status) }
                  ]}
                >
                  {phase.phaseLabel}
                </Text>
                <Text style={styles.phasePercentage}>
                  {phase.newFoodPercentage}% new food
                </Text>
              </View>
              
              <Text style={styles.phaseDescription}>
                {phase.description}
              </Text>
              
              <View style={styles.ratioVisualization}>
                <View style={styles.ratioBar}>
                  <View 
                    style={[
                      styles.oldFoodPortion,
                      { width: `${phase.oldFoodPercentage}%` }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.newFoodPortion,
                      { width: `${phase.newFoodPercentage}%` }
                    ]} 
                  />
                </View>
                <View style={styles.ratioLabels}>
                  <Text style={styles.ratioText}>
                    Old: {phase.oldFoodPercentage}%
                  </Text>
                  <Text style={styles.ratioText}>
                    New: {phase.newFoodPercentage}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  phaseItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  phaseIndicator: {
    alignItems: 'center',
    marginRight: 12,
  },
  connector: {
    width: 2,
    height: 40,
    marginTop: 8,
  },
  phaseContent: {
    flex: 1,
    paddingBottom: 8,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  phaseLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  phasePercentage: {
    fontSize: 12,
    color: colors.gray500,
    backgroundColor: colors.gray100,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  phaseDescription: {
    fontSize: 14,
    color: colors.gray600,
    marginBottom: 8,
    lineHeight: 20,
  },
  ratioVisualization: {
    marginTop: 8,
  },
  ratioBar: {
    height: 6,
    backgroundColor: colors.gray200,
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 4,
  },
  oldFoodPortion: {
    backgroundColor: colors.gray500,
  },
  newFoodPortion: {
    backgroundColor: colors.primary,
  },
  ratioLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratioText: {
    fontSize: 10,
    color: colors.gray500,
  },
});

export default TransitionPhaseList;
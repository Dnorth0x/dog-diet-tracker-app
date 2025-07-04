import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FeedingEntry } from '@/types/FeedingEntry';
import { formatShortDate } from '@/utils/dateUtils';
import { useAppSettingsStore } from '@/store/appSettingsStore';

interface WeightChartProps {
  entries: FeedingEntry[];
  days?: number;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 64; // Account for padding
const chartHeight = 200;

const WeightChart: React.FC<WeightChartProps> = ({ entries, days = 14 }) => {
  const { getColors, getFontSizes, getBorderRadius } = useAppSettingsStore();
  const colors = getColors();
  const fontSizes = getFontSizes();
  const borderRadius = getBorderRadius();
  
  if (entries.length < 2) {
    const styles = createStyles(colors, fontSizes, borderRadius);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Weight Trends</Text>
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>Not enough data to show trends</Text>
          <Text style={styles.emptySubtext}>Add more daily logs to see weight charts</Text>
        </View>
      </View>
    );
  }
  
  // Get entries with weight data, sorted by date
  const weightEntries = entries
    .filter(entry => entry.averageWeight || entry.amWeight || entry.pmWeight)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-days);
  
  if (weightEntries.length < 2) {
    const styles = createStyles(colors, fontSizes, borderRadius);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Weight Trends</Text>
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>Not enough weight data</Text>
          <Text style={styles.emptySubtext}>Record AM/PM weights to see trends</Text>
        </View>
      </View>
    );
  }
  
  // Calculate chart data
  const weights = weightEntries.map(entry => 
    entry.averageWeight || entry.amWeight || entry.pmWeight || 0
  );
  
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight || 1; // Avoid division by zero
  
  // Generate points for the line
  const points = weightEntries.map((entry, index) => {
    const weight = entry.averageWeight || entry.amWeight || entry.pmWeight || 0;
    const x = (index / (weightEntries.length - 1)) * chartWidth;
    const y = chartHeight - ((weight - minWeight) / weightRange) * (chartHeight - 40);
    return { x, y, weight, date: entry.date };
  });

  // Calculate weight change safely
  const latestWeight = points[points.length - 1]?.weight || 0;
  const firstWeight = points[0]?.weight || 0;
  const weightChange = latestWeight - firstWeight;
  const weightChangeText = weightChange >= 0 ? `+${weightChange.toFixed(1)}` : weightChange.toFixed(1);

  const styles = createStyles(colors, fontSizes, borderRadius);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Trends</Text>
      <View style={styles.chartContainer}>
        <View style={styles.yAxisLabels}>
          <Text style={styles.axisLabel}>{maxWeight.toFixed(1)}</Text>
          <Text style={styles.axisLabel}>{((minWeight + maxWeight) / 2).toFixed(1)}</Text>
          <Text style={styles.axisLabel}>{minWeight.toFixed(1)}</Text>
        </View>
        
        <View style={styles.chartArea}>
          <View style={styles.gridLines}>
            {[0, 1, 2].map(i => (
              <View 
                key={i} 
                style={[
                  styles.gridLine, 
                  { top: (i * (chartHeight - 40)) / 2 }
                ]} 
              />
            ))}
          </View>
          
          {points.map((point, index) => (
            <View
              key={index}
              style={[
                styles.dataPoint,
                {
                  left: point.x - 4,
                  top: point.y - 4,
                }
              ]}
            />
          ))}
          
          {points.slice(0, -1).map((point, index) => {
            const nextPoint = points[index + 1];
            const length = Math.sqrt(
              Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
            );
            const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
            
            return (
              <View
                key={index}
                style={[
                  styles.trendLine,
                  {
                    left: point.x,
                    top: point.y,
                    width: length,
                    transform: [{ rotate: `${angle}deg` }],
                  }
                ]}
              />
            );
          })}
        </View>
      </View>
      
      <View style={styles.xAxisLabels}>
        <Text style={styles.axisLabel}>
          {formatShortDate(new Date(weightEntries[0].date))}
        </Text>
        <Text style={styles.axisLabel}>
          {formatShortDate(new Date(weightEntries[Math.floor(weightEntries.length / 2)].date))}
        </Text>
        <Text style={styles.axisLabel}>
          {formatShortDate(new Date(weightEntries[weightEntries.length - 1].date))}
        </Text>
      </View>
      
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Latest: {latestWeight.toFixed(1)} lbs
        </Text>
        <Text style={styles.summaryText}>
          Change: {weightChangeText} lbs
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: any, fontSizes: any, borderRadius: number) => StyleSheet.create({
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
  title: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: 16,
  },
  emptyChart: {
    height: chartHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray50,
    borderRadius: borderRadius * 0.67,
  },
  emptyText: {
    fontSize: fontSizes.base,
    color: colors.gray600,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: fontSizes.sm,
    color: colors.gray500,
  },
  chartContainer: {
    flexDirection: 'row',
    height: chartHeight,
  },
  yAxisLabels: {
    width: 40,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  axisLabel: {
    fontSize: fontSizes.sm,
    color: colors.gray500,
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
    marginLeft: 8,
  },
  gridLines: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: chartHeight - 40,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.gray200,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  trendLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: colors.primary,
    transformOrigin: '0 50%',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginLeft: 48,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  summaryText: {
    fontSize: fontSizes.sm,
    color: colors.gray600,
  },
});

export default WeightChart;
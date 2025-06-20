import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FeedingEntry } from '@/types/FeedingEntry';
import { colors } from '@/constants/colors';
import { formatShortDate } from '@/utils/dateUtils';

interface WeightChartProps {
  entries: FeedingEntry[];
  days?: number;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 64; // Account for padding
const chartHeight = 200;

const WeightChart: React.FC<WeightChartProps> = ({ entries, days = 14 }) => {
  if (entries.length < 2) {
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
  
  // Generate SVG path for the line
  const points = weightEntries.map((entry, index) => {
    const weight = entry.averageWeight || entry.amWeight || entry.pmWeight || 0;
    const x = (index / (weightEntries.length - 1)) * chartWidth;
    const y = chartHeight - ((weight - minWeight) / weightRange) * (chartHeight - 40);
    return { x, y, weight, date: entry.date };
  });
  
  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

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
          {/* Grid lines */}
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
          
          {/* Data points */}
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
          
          {/* Trend line (simplified with View components) */}
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
      
      {/* X-axis labels */}
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
          Latest: {points[points.length - 1].weight.toFixed(1)} lbs
        </Text>
        <Text style={styles.summaryText}>
          Change: {(points[points.length - 1].weight - points[0].weight >= 0 ? '+' : '')}
          {(points[points.length - 1].weight - points[0].weight).toFixed(1)} lbs
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: 16,
  },
  emptyChart: {
    height: chartHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray600,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
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
    fontSize: 12,
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
    fontSize: 14,
    color: colors.gray600,
  },
});

export default WeightChart;
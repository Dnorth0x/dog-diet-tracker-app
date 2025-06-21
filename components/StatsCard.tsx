import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSettingsStore } from '@/store/appSettingsStore';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon }) => {
  const { getColors, getFontSizes } = useAppSettingsStore();
  const colors = getColors();
  const fontSizes = getFontSizes();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 16,
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
      marginBottom: 8,
    },
    title: {
      fontSize: fontSizes.sm,
      color: colors.gray600,
      fontWeight: '500',
    },
    iconContainer: {
      opacity: 0.7,
    },
    value: {
      fontSize: fontSizes['2xl'],
      fontWeight: '700',
      color: colors.gray800,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: fontSizes.xs,
      color: colors.gray500,
    },
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

export default StatsCard;
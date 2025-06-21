import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSettingsStore } from '@/store/appSettingsStore';
import Button from './Button';
import { BookOpen } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  buttonTitle,
  onButtonPress,
}) => {
  const { getColors, getFontSizes } = useAppSettingsStore();
  const colors = getColors();
  const fontSizes = getFontSizes();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.gray100,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: fontSizes.xl,
      fontWeight: '700',
      color: colors.gray800,
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      fontSize: fontSizes.base,
      color: colors.gray600,
      textAlign: 'center',
      marginBottom: 24,
    },
    button: {
      minWidth: 150,
    },
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <BookOpen size={48} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

export default EmptyState;
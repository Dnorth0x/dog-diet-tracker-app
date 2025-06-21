import React from 'react';
import { 
  Text, 
  StyleSheet, 
  Pressable, 
  PressableProps, 
  ActivityIndicator 
} from 'react-native';
import { useAppSettingsStore } from '@/store/appSettingsStore';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  ...props 
}) => {
  const { getColors, getFontSizes, getBorderRadius } = useAppSettingsStore();
  const colors = getColors();
  const fontSizes = getFontSizes();
  const borderRadius = getBorderRadius();
  
  const getBackgroundColor = () => {
    if (disabled) return colors.gray300;
    
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.gray500;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return colors.white;
      case 'outline':
        return colors.primary;
      default:
        return colors.white;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.gray300;
    
    return variant === 'outline' ? colors.primary : 'transparent';
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return fontSizes.sm;
      case 'medium':
        return fontSizes.base;
      case 'large':
        return fontSizes.lg;
      default:
        return fontSizes.base;
    }
  };

  const styles = StyleSheet.create({
    button: {
      borderRadius: borderRadius * 0.67, // Slightly smaller radius for buttons
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor(),
      ...getPadding(),
    },
    text: {
      fontWeight: '600',
      color: getTextColor(),
      fontSize: getFontSize(),
    },
  });

  return (
    <Pressable
      style={[styles.button, style]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={styles.text}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;
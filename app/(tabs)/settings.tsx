import React from 'react';
import { ScrollView, StyleSheet, View, Text, Switch, Alert, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useAppSettingsStore } from '@/store/appSettingsStore';
import { Bell, Scale, Utensils, Moon, Sun, Palette, Type, Info, HelpCircle, Check } from 'lucide-react-native';

export default function SettingsScreen() {
  const { 
    weightUnit, 
    foodUnit, 
    reminderEnabled, 
    transitionReminderEnabled, 
    theme,
    accentColor,
    fontSize,
    updateSettings,
    getColors,
    getFontSizes
  } = useAppSettingsStore();
  
  const colors = getColors();
  const fontSizes = getFontSizes();
  const styles = createStyles(colors, fontSizes);
  
  const handleWeightUnitToggle = () => {
    updateSettings({ 
      weightUnit: weightUnit === 'pounds' ? 'kilograms' : 'pounds' 
    });
  };
  
  const handleFoodUnitToggle = () => {
    updateSettings({ 
      foodUnit: foodUnit === 'cups' ? 'grams' : 'cups' 
    });
  };
  
  const handleReminderToggle = () => {
    updateSettings({ reminderEnabled: !reminderEnabled });
  };
  
  const handleTransitionReminderToggle = () => {
    updateSettings({ transitionReminderEnabled: !transitionReminderEnabled });
  };
  
  const handleThemeToggle = () => {
    updateSettings({ theme: theme === 'light' ? 'dark' : 'light' });
  };
  
  const handleAccentColorChange = (color: string) => {
    updateSettings({ accentColor: color as any });
  };
  
  const handleFontSizeChange = (size: string) => {
    updateSettings({ fontSize: size as any });
  };
  
  const showComingSoon = () => {
    Alert.alert('Coming Soon', 'This feature will be available in a future update.');
  };

  const accentColors = [
    { key: 'blue', name: 'Ocean Blue', color: '#6A8CAF' },
    { key: 'green', name: 'Forest Green', color: '#7CB342' },
    { key: 'purple', name: 'Royal Purple', color: '#8E24AA' },
    { key: 'orange', name: 'Sunset Orange', color: '#FB8C00' },
    { key: 'pink', name: 'Cherry Pink', color: '#E91E63' },
  ];

  const fontSizeOptions = [
    { key: 'small', name: 'Small', description: 'Compact text' },
    { key: 'medium', name: 'Medium', description: 'Default size' },
    { key: 'large', name: 'Large', description: 'Easy to read' },
  ];

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Settings",
          headerStyle: { backgroundColor: colors.white },
          headerTitleStyle: { color: colors.gray800 },
        }}
      />
      <ScrollView style={[styles.container]} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Scale size={20} color={colors.gray600} />
              <Text style={styles.settingLabel}>Weight Unit</Text>
            </View>
            <View style={styles.unitToggle}>
              <Text style={[styles.unitText, { color: weightUnit === 'pounds' ? colors.primary : colors.gray500 }]}>
                lbs
              </Text>
              <Switch
                value={weightUnit === 'kilograms'}
                onValueChange={handleWeightUnitToggle}
                trackColor={{ false: colors.gray300, true: colors.primary }}
                thumbColor={colors.white}
              />
              <Text style={[styles.unitText, { color: weightUnit === 'kilograms' ? colors.primary : colors.gray500 }]}>
                kg
              </Text>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Utensils size={20} color={colors.gray600} />
              <Text style={styles.settingLabel}>Food Unit</Text>
            </View>
            <View style={styles.unitToggle}>
              <Text style={[styles.unitText, { color: foodUnit === 'cups' ? colors.primary : colors.gray500 }]}>
                cups
              </Text>
              <Switch
                value={foodUnit === 'grams'}
                onValueChange={handleFoodUnitToggle}
                trackColor={{ false: colors.gray300, true: colors.primary }}
                thumbColor={colors.white}
              />
              <Text style={[styles.unitText, { color: foodUnit === 'grams' ? colors.primary : colors.gray500 }]}>
                grams
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.gray600} />
              <View>
                <Text style={styles.settingLabel}>Daily Feeding Reminders</Text>
                <Text style={styles.settingDescription}>Get reminded to log daily meals</Text>
              </View>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={handleReminderToggle}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.gray600} />
              <View>
                <Text style={styles.settingLabel}>Transition Phase Reminders</Text>
                <Text style={styles.settingDescription}>Get notified when transition phases change</Text>
              </View>
            </View>
            <Switch
              value={transitionReminderEnabled}
              onValueChange={handleTransitionReminderToggle}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {theme === 'dark' ? (
                <Moon size={20} color={colors.gray600} />
              ) : (
                <Sun size={20} color={colors.gray600} />
              )}
              <View>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  {theme === 'dark' ? 'Dark theme active' : 'Light theme active'}
                </Text>
              </View>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={handleThemeToggle}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingContainer}>
            <View style={styles.settingInfo}>
              <Palette size={20} color={colors.gray600} />
              <View>
                <Text style={styles.settingLabel}>Accent Color</Text>
                <Text style={styles.settingDescription}>Choose your favorite color theme</Text>
              </View>
            </View>
            <View style={styles.colorGrid}>
              {accentColors.map((color) => (
                <TouchableOpacity
                  key={color.key}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.color },
                    accentColor === color.key && styles.selectedColor
                  ]}
                  onPress={() => handleAccentColorChange(color.key)}
                >
                  {accentColor === color.key && (
                    <Check size={16} color={colors.white} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.settingContainer}>
            <View style={styles.settingInfo}>
              <Type size={20} color={colors.gray600} />
              <View>
                <Text style={styles.settingLabel}>Font Size</Text>
                <Text style={styles.settingDescription}>Adjust text size for better readability</Text>
              </View>
            </View>
            <View style={styles.fontSizeOptions}>
              {fontSizeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.fontSizeOption,
                    fontSize === option.key && { backgroundColor: colors.primary }
                  ]}
                  onPress={() => handleFontSizeChange(option.key)}
                >
                  <Text style={[
                    styles.fontSizeText,
                    fontSize === option.key && { color: colors.white }
                  ]}>
                    {option.name}
                  </Text>
                  <Text style={[
                    styles.fontSizeDescription,
                    fontSize === option.key && { color: colors.white }
                  ]}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={showComingSoon}>
            <View style={styles.settingInfo}>
              <HelpCircle size={20} color={colors.gray600} />
              <Text style={styles.settingLabel}>Help & FAQ</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={showComingSoon}>
            <View style={styles.settingInfo}>
              <Info size={20} color={colors.gray600} />
              <Text style={styles.settingLabel}>About</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Dog Diet Tracker v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for dog parents</Text>
        </View>
      </ScrollView>
    </>
  );
}

const createStyles = (colors: any, fontSizes: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  content: {
    padding: 16,
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
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  settingContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingLabel: {
    fontSize: fontSizes.base,
    color: colors.gray700,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: fontSizes.sm,
    color: colors.gray500,
    marginTop: 2,
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitText: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 20,
    color: colors.gray400,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: colors.gray300,
  },
  fontSizeOptions: {
    marginTop: 12,
    gap: 8,
  },
  fontSizeOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.gray100,
  },
  fontSizeText: {
    fontSize: fontSizes.base,
    fontWeight: '500',
    color: colors.gray700,
  },
  fontSizeDescription: {
    fontSize: fontSizes.sm,
    color: colors.gray500,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  footerText: {
    fontSize: fontSizes.sm,
    color: colors.gray500,
    marginBottom: 4,
  },
});
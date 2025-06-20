import React from 'react';
import { ScrollView, StyleSheet, View, Text, Switch, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAppSettingsStore } from '@/store/appSettingsStore';
import { Bell, Scale, Utensils, Moon, Info, HelpCircle } from 'lucide-react-native';

export default function SettingsScreen() {
  const { 
    weightUnit, 
    foodUnit, 
    reminderEnabled, 
    transitionReminderEnabled, 
    theme,
    updateSettings 
  } = useAppSettingsStore();
  
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
  
  const showComingSoon = () => {
    Alert.alert('Coming Soon', 'This feature will be available in a future update.');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Settings",
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
              <Moon size={20} color={colors.gray600} />
              <View>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Coming soon</Text>
              </View>
            </View>
            <Text style={styles.comingSoon}>Soon</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <HelpCircle size={20} color={colors.gray600} />
              <Text style={styles.settingLabel}>Help & FAQ</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Info size={20} color={colors.gray600} />
              <Text style={styles.settingLabel}>About</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Dog Diet Tracker v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for dog parents</Text>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 16,
    color: colors.gray700,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
  },
  comingSoon: {
    fontSize: 12,
    color: colors.gray500,
    backgroundColor: colors.gray200,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  arrow: {
    fontSize: 20,
    color: colors.gray400,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: colors.gray500,
    marginBottom: 4,
  },
});
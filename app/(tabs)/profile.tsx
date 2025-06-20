import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useDogProfileStore } from '@/store/dogProfileStore';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import { Dog, Camera, Edit3, Plus } from 'lucide-react-native';

export default function ProfileScreen() {
  const { profiles, getActiveProfile, updateProfile, addProfile, setActiveProfile } = useDogProfileStore();
  
  const activeProfile = getActiveProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(activeProfile?.name || '');
  const [breed, setBreed] = useState(activeProfile?.breed || '');
  const [idealWeight, setIdealWeight] = useState(activeProfile?.idealWeight?.toString() || '');
  const [currentWeight, setCurrentWeight] = useState(activeProfile?.currentWeight?.toString() || '');
  const [notes, setNotes] = useState(activeProfile?.notes || '');
  const [allergies, setAllergies] = useState(activeProfile?.allergies?.join(', ') || '');
  
  const handleSave = () => {
    if (!activeProfile) return;
    
    if (!name.trim() || !breed.trim() || !idealWeight) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    const allergiesArray = allergies
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);
    
    updateProfile(activeProfile.id, {
      name: name.trim(),
      breed: breed.trim(),
      idealWeight: parseFloat(idealWeight),
      currentWeight: currentWeight ? parseFloat(currentWeight) : undefined,
      notes: notes.trim() || undefined,
      allergies: allergiesArray.length > 0 ? allergiesArray : undefined,
    });
    
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };
  
  const handleAddNewProfile = () => {
    Alert.alert('Add New Dog', 'This feature will be available in the next update.');
  };
  
  const calculateAge = (dateOfBirth: Date): string => {
    const today = new Date();
    const years = today.getFullYear() - dateOfBirth.getFullYear();
    const months = today.getMonth() - dateOfBirth.getMonth();
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} old`;
    } else {
      return `${months} month${months > 1 ? 's' : ''} old`;
    }
  };
  
  if (!activeProfile) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="No Dog Profile"
          message="Create your first dog profile to start tracking their diet and health."
          buttonTitle="Create Profile"
          onButtonPress={handleAddNewProfile}
        />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Dog Profile",
          headerRight: () => (
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Edit3 size={24} color={colors.gray600} style={{ marginRight: 16 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Dog size={48} color={colors.gray500} />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Dog's name"
                placeholderTextColor={colors.gray400}
              />
            ) : (
              <Text style={styles.profileName}>{activeProfile.name}</Text>
            )}
            <Text style={styles.profileAge}>
              {calculateAge(new Date(activeProfile.dateOfBirth))}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Breed</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={breed}
                onChangeText={setBreed}
                placeholder="Mixed, Golden Retriever, etc."
                placeholderTextColor={colors.gray400}
              />
            ) : (
              <Text style={styles.inputValue}>{activeProfile.breed}</Text>
            )}
          </View>
          
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ideal Weight (lbs)</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={idealWeight}
                  onChangeText={setIdealWeight}
                  placeholder="25.0"
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.gray400}
                />
              ) : (
                <Text style={styles.inputValue}>{activeProfile.idealWeight} lbs</Text>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Weight (lbs)</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={currentWeight}
                  onChangeText={setCurrentWeight}
                  placeholder="27.5"
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.gray400}
                />
              ) : (
                <Text style={styles.inputValue}>
                  {activeProfile.currentWeight ? `${activeProfile.currentWeight} lbs` : 'Not set'}
                </Text>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Known Allergies</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={allergies}
                onChangeText={setAllergies}
                placeholder="chicken, corn, wheat (comma separated)"
                placeholderTextColor={colors.gray400}
              />
            ) : (
              <Text style={styles.inputValue}>
                {activeProfile.allergies?.length ? activeProfile.allergies.join(', ') : 'None listed'}
              </Text>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Notes</Text>
            {isEditing ? (
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any special notes about diet, behavior, or health..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={colors.gray400}
              />
            ) : (
              <Text style={styles.inputValue}>
                {activeProfile.notes || 'No notes added'}
              </Text>
            )}
          </View>
        </View>
        
        {isEditing && (
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => {
                setIsEditing(false);
                // Reset form values
                setName(activeProfile.name);
                setBreed(activeProfile.breed);
                setIdealWeight(activeProfile.idealWeight.toString());
                setCurrentWeight(activeProfile.currentWeight?.toString() || '');
                setNotes(activeProfile.notes || '');
                setAllergies(activeProfile.allergies?.join(', ') || '');
              }}
              style={styles.cancelButton}
            />
            <Button
              title="Save Changes"
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>
        )}
        
        {profiles.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other Dogs</Text>
            {profiles
              .filter(p => p.id !== activeProfile.id)
              .map(profile => (
                <TouchableOpacity
                  key={profile.id}
                  style={styles.profileItem}
                  onPress={() => setActiveProfile(profile.id)}
                >
                  <Text style={styles.profileItemName}>{profile.name}</Text>
                  <Text style={styles.profileItemBreed}>{profile.breed}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}
        
        <Button
          title="Add Another Dog"
          variant="outline"
          onPress={handleAddNewProfile}
          style={styles.addButton}
        />
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray800,
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray800,
    marginBottom: 4,
    padding: 0,
  },
  profileAge: {
    fontSize: 16,
    color: colors.gray600,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 16,
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.gray800,
  },
  inputValue: {
    fontSize: 16,
    color: colors.gray800,
    paddingVertical: 12,
  },
  notesInput: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.gray800,
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  profileItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray800,
  },
  profileItemBreed: {
    fontSize: 14,
    color: colors.gray600,
  },
  addButton: {
    marginBottom: 40,
  },
});
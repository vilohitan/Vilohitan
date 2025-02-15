import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Switch
} from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';

const MatchPreferencesScreen = () => {
  const [preferences, setPreferences] = useState({
    ageRange: [18, 35],
    distance: 25,
    showMe: 'everyone', // 'women', 'men', 'everyone'
    lookingFor: ['dating', 'relationship'], // multiple possible values
    interestedIn: ['men'], // 'men', 'women', 'everyone'
    showOnlyVerified: false,
    hideAge: false,
    hideDistance: false,
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Match Preferences</Text>
        <Text style={styles.lastUpdated}>
          Last updated: 2025-02-14 19:12:09
        </Text>
      </View>

      {/* Age Range Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Age Range</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.rangeText}>
            {preferences.ageRange[0]} - {preferences.ageRange[1]} years
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={18}
            maximumValue={100}
            values={preferences.ageRange}
            onValueChange={(values) => updatePreference('ageRange', values)}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.background.medium}
          />
        </View>
      </View>

      {/* Distance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Maximum Distance</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.rangeText}>{preferences.distance} km</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={100}
            value={preferences.distance}
            onValueChange={(value) => updatePreference('distance', value)}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.background.medium}
          />
        </View>
      </View>

      {/* Show Me Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Show Me</Text>
        {['women', 'men', 'everyone'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              preferences.showMe === option && styles.selectedOption
            ]}
            onPress={() => updatePreference('showMe', option)}
          >
            <Text style={[
              styles.optionText,
              preferences.showMe === option && styles.selectedOptionText
            ]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Looking For Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Looking For</Text>
        <View style={styles.tagsContainer}>
          {['dating', 'relationship', 'friendship', 'networking'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.tag,
                preferences.lookingFor.includes(option) && styles.selectedTag
              ]}
              onPress={() => {
                const newValues = preferences.lookingFor.includes(option)
                  ? preferences.lookingFor.filter(item => item !== option)
                  : [...preferences.lookingFor, option];
                updatePreference('lookingFor', newValues);
              }}
            >
              <Text style={[
                styles.tagText,
                preferences.lookingFor.includes(option) && styles.selectedTagText
              ]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Privacy Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Show Only Verified Profiles</Text>
          <Switch
            value={preferences.showOnlyVerified}
            onValueChange={(value) => updatePreference('showOnlyVerified', value)}
            trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
            thumbColor={COLORS.background.light}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Hide My Age</Text>
          <Switch
            value={preferences.hideAge}
            onValueChange={(value) => updatePreference('hideAge', value)}
            trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
            thumbColor={COLORS.background.light}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Hide My Distance</Text>
          <Switch
            value={preferences.hideDistance}
            onValueChange={(value) => updatePreference('hideDistance', value)}
            trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
            thumbColor={COLORS.background.light}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.medium,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
  },
  lastUpdated: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  section: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.medium,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  sliderContainer: {
    marginTop: SPACING.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  optionButton: {
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.background.medium,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: COLORS.text.light,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  tag: {
    backgroundColor: COLORS.background.medium,
    padding: SPACING.sm,
    borderRadius: 20,
    margin: SPACING.xs,
  },
  selectedTag: {
    backgroundColor: COLORS.primary,
  },
  tagText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  selectedTagText: {
    color: COLORS.text.light,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  switchLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  saveButton: {
    margin: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    ...SHADOWS.small,
  },
  saveButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.light,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default MatchPreferencesScreen;
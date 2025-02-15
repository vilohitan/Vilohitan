import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DiscoverySettingsScreen = () => {
  const [settings, setSettings] = useState({
    discoveryEnabled: true,
    showInDiscovery: true,
    globalMode: false,
    incognitoMode: false,
    distance: 25,
    verifiedOnly: true,
    activeRecently: true,
    showLastSeen: true,
    autoMatchPreferences: true
  });

  const handleSettingChange = (setting, value) => {
    if (setting === 'incognitoMode' && value) {
      Alert.alert(
        'Enable Incognito Mode?',
        'Only users you like will be able to see your profile. This may reduce your matches.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Enable',
            onPress: () => setSettings(prev => ({ ...prev, [setting]: value }))
          }
        ]
      );
    } else {
      setSettings(prev => ({ ...prev, [setting]: value }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discovery Settings</Text>
        <Text style={styles.lastUpdated}>
          Last updated: 2025-02-14 19:15:21
        </Text>
        <Text style={styles.subtitle}>
          Control who sees your profile and how you discover others
        </Text>
      </View>

      {/* Main Discovery Controls */}
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Discovery</Text>
            <Text style={styles.settingDescription}>
              Turn off to pause all new matches
            </Text>
          </View>
          <Switch
            value={settings.discoveryEnabled}
            onValueChange={(value) => handleSettingChange('discoveryEnabled', value)}
            trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
            thumbColor={COLORS.background.light}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Show Me in Discovery</Text>
            <Text style={styles.settingDescription}>
              Control whether others can discover your profile
            </Text>
          </View>
          <Switch
            value={settings.showInDiscovery}
            onValueChange={(value) => handleSettingChange('showInDiscovery', value)}
            trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
            thumbColor={COLORS.background.light}
          />
        </View>
      </View>

      {/* Location Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Global Mode</Text>
            <Text style={styles.settingDescription}>
              Match with people anywhere in the world
            </Text>
          </View>
          <Switch
            value={settings.globalMode}
            onValueChange={(value) => handleSettingChange('globalMode', value)}
            trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
            thumbColor={COLORS.background.light}
          />
        </View>

        {!settings.globalMode && (
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceText}>
              Maximum Distance: {settings.distance} km
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={100}
              value={settings.distance}
              onValueChange={(value) => handleSettingChange('distance', value)}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.background.medium}
            />
          </View>
        )}
      </View>

      {/* Privacy Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Incognito Mode</Text>
            <Text style={styles.settingDescription}>
              Only be visible to profiles you like
            </Text>
          </View>
          <Switch
            value={settings.incognitoMode}
            onValueChange={(value) => handleSettingChange('incognitoMode', value)}
            trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
            thumbColor={COLORS.background.light}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Show Last Seen</Text>
            <Text style={styles.settingDescription}>
              Let matches see when you were last active
            </Text>
          </View>
          <Switch
            value={settings.showLastSeen}
            onValueChange={(value) => handleSettingChange('showLastSeen', value)}
            trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
            thumbColor={COLORS.background.light}
          />
        </View>
      </View>

      {/* Match Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Match Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Verified Profiles Only</Text>
            <Text style={styles.settingDescription}>
              Only show profiles that are verified
            </Text>
          </View>
          <Switch
            value={settings.verifiedOnly}
            onValueChange={(value) => handleSettingChange('verifiedOnly', value)}
            trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
            thumbColor={COLORS.background.light}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Recently Active</Text>
            <Text style={styles.settingDescription}>
              Prioritize active profiles in last 24 hours
            </Text>
          </View>
          <Switch
            value={settings.activeRecently}
            onValueChange={(value) => handleSettingChange('activeRecently', value)}
            trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
            thumbColor={COLORS.background.light}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <Text style={styles.userInfo}>
        Settings for: vilohitan
      </Text>
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  lastUpdated: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  distanceContainer: {
    marginTop: SPACING.md,
  },
  distanceText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  slider: {
    width: '100%',
    height: 40,
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
  userInfo: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});

export default DiscoverySettingsScreen;
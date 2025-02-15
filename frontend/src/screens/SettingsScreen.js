import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  Switch, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    location: true,
    darkMode: false,
    privateBio: false,
  });

  const SettingItem = ({ icon, title, description, value, onToggle, type = 'switch' }) => (
    <View style={styles.settingItem}>
      <Icon name={icon} size={24} color={COLORS.primary} style={styles.settingIcon} />
      
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>

      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
          thumbColor={COLORS.background.light}
        />
      ) : (
        <Icon name="chevron-right" size={24} color={COLORS.text.secondary} />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity 
          style={styles.profilePreview}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>vilohitan</Text>
            <Text style={styles.profileEmail}>vilohitan@example.com</Text>
          </View>
          <Icon name="chevron-right" size={24} color={COLORS.text.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <SettingItem
          icon="bell-outline"
          title="Push Notifications"
          description="Receive match and message notifications"
          value={settings.notifications}
          onToggle={(value) => setSettings(prev => ({ ...prev, notifications: value }))}
        />
        <SettingItem
          icon="map-marker-outline"
          title="Location Services"
          description="Allow access to your location"
          value={settings.location}
          onToggle={(value) => setSettings(prev => ({ ...prev, location: value }))}
        />
        <SettingItem
          icon="eye-off-outline"
          title="Private Bio"
          description="Hide your bio from non-matches"
          value={settings.privateBio}
          onToggle={(value) => setSettings(prev => ({ ...prev, privateBio: value }))}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          icon="account-outline"
          title="Discovery Settings"
          description="Age range, distance, gender"
          type="button"
          onPress={() => navigation.navigate('DiscoverySettings')}
        />
        <SettingItem
          icon="theme-light-dark"
          title="Dark Mode"
          value={settings.darkMode}
          onToggle={(value) => setSettings(prev => ({ ...prev, darkMode: value }))}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem
          icon="help-circle-outline"
          title="Help Center"
          type="button"
        />
        <SettingItem
          icon="shield-check-outline"
          title="Privacy Policy"
          type="button"
        />
        <SettingItem
          icon="file-document-outline"
          title="Terms of Service"
          type="button"
        />
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    padding: SPACING.md,
  },
  profilePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background.medium,
    marginBottom: SPACING.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  profileEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background.light,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.medium,
  },
  settingIcon: {
    marginRight: SPACING.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  settingDescription: {
    ...TYPOGRAPHY.caption,
    color: ▋
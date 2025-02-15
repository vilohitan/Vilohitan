import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image,
  StyleSheet 
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EditProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    name: 'vilohitan',
    age: '28',
    bio: 'Software developer by day, musician by night 🎸',
    occupation: 'Software Developer',
    location: 'New York City',
    interests: ['Music', 'Technology', 'Travel', 'Photography'],
    photos: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
      'https://example.com/photo3.jpg'
    ]
  });

  const [selectedInterests, setSelectedInterests] = useState(new Set(profile.interests));

  const interests = [
    'Music', 'Technology', 'Travel', 'Photography', 'Sports',
    'Art', 'Food', 'Movies', 'Books', 'Fitness', 'Fashion',
    'Gaming', 'Nature', 'Pets', 'Dancing'
  ];

  const handleSave = () => {
    // Save profile changes
    navigation.goBack();
  };

  const toggleInterest = (interest) => {
    const newSelected = new Set(selectedInterests);
    if (newSelected.has(interest)) {
      newSelected.delete(interest);
    } else if (newSelected.size < 5) {
      newSelected.add(interest);
    }
    setSelectedInterests(newSelected);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Photos Section */}
        <View style={styles.photosSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {profile.photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity style={styles.deletePhotoButton}>
                  <Icon name="close" size={20} color={COLORS.text.light} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoButton}>
              <Icon name="plus" size={32} color={COLORS.primary} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Basic Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={profile.age}
              keyboardType="numeric"
              onChangeText={(text) => setProfile({ ...profile, age: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={profile.bio}
              multiline
              numberOfLines={4}
              onChangeText={(text) => setProfile({ ...profile, bio: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Occupation</Text>
            <TextInput
              style={styles.input}
              value={profile.occupation}
              onChangeText={(text) => setProfile({ ...profile, occupation: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={profile.location}
              onChangeText={(text) => setProfile({ ...profile, location: text })}
            />
          </View>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests (Max 5)</Text>
          <View style={styles.interestsContainer}>
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestTag,
                  selectedInterests.has(interest) && styles.selectedInterest
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[
                  styles.interestText,
                  selectedInterests.has(interest) && styles.selectedInterestText
                ]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Last Updated */}
        <Text style={styles.lastUpdated}>
          Last updated: 2025-02-14 19:08:30
        </Text>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  photosSection: {
    padding: SPACING.md,
    backgroundColor: COLORS.background.medium,
  },
  photoContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  photo: {
    width: 120,
    height: 160,
    borderRadius: 12,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: SPACING.xs,
  },
  addPhotoButton: {
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: COLORS.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
  },
  addPhotoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
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
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  input: {
    ...TYPOGRAPHY.body,
    backgroundColor: COLORS.background.medium,
    borderRadius: 8,
    padding: SPACING.md,
    color: COLORS.text.primary,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  interestTag: {
    backgroundColor: COLORS.background.medium,
    padding: SPACING.sm,
    borderRadius: 20,
    margin: SPACING.xs,
  },
  selectedInterest: {
    backgroundColor: COLORS.primary,
  },
  interestText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary,
  },
  selectedInterestText: {
    color: COLORS.text.light,
  },
  lastUpdated: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
    padding: SPACING.lg,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 8,
    ...SHADOWS.small,
  },
  saveButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.light,
    textAlign: 'center',
    fontWeight: '600',
  }, ▋
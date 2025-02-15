import React, { useState } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
  const [userProfile] = useState({
    name: 'vilohitan',
    age: 28,
    bio: 'Software developer by day, musician by night 🎸',
    photos: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
      'https://example.com/photo3.jpg'
    ],
    interests: ['Music', 'Technology', 'Travel', 'Photography'],
    location: 'New York City',
    occupation: 'Software Developer'
  });

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: userProfile.photos[0] }} 
          style={styles.coverPhoto}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{userProfile.name}, {userProfile.age}</Text>
          <Text style={styles.location}>
            <Icon name="map-marker" size={16} color={COLORS.primary} />
            {userProfile.location}
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="heart" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>128</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="message" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Chats</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="star" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Super Likes</Text>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.bio}>{userProfile.bio}</Text>
      </View>

      {/* Interests Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.interestsContainer}>
          {userProfile.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Photos Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.photosGrid}>
          {userProfile.photos.map((photo, index) => (
            <Image 
              key={index}
              source={{ uri: photo }} 
              style={styles.gridPhoto}
            />
          ))}
          <TouchableOpacity style={styles.addPhotoButton}>
            <Icon name="plus" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  header: {
    height: 300,
  },
  coverPhoto: {
    width: '100%',
    height: 250,
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  name: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.light,
    marginBottom: SPACING.xs,
  },
  location: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.light,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.background.medium,
    ...SHADOWS.small,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  bio: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: COLORS.background.medium,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  interestText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  gridPhoto: {
    width: '33%',
    aspectRatio: 1,
    margin: SPACING.xs,
    borderRadius: 8,
  },
  addPhotoButton: {
    width: '33%',
    aspectRatio: 1,
    margin: SPACING.xs,
    borderRadius: 8,
    backgroundColor: COLORS.background.medium,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
  },
});

export default ProfileScreen;
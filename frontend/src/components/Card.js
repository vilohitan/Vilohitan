import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from '../theme/tokens';

const { width } = Dimensions.get('window');

const Card = ({ user, onLike, onDislike, onSuperLike }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.photos[0] }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user.name}, {user.age}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        
        <View style={styles.interestContainer}>
          {user.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - SPACING.xl,
    height: height * 0.7,
    borderRadius: 20,
    backgroundColor: COLORS.background.light,
    ...SHADOWS.medium
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  infoContainer: {
    padding: SPACING.md
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary
  },
  bio: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md
  },
  interestTag: {
    backgroundColor: COLORS.background.medium,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs
  },
  interestText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary
  }
});

export default Card;
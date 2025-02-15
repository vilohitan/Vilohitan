import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, SHADOWS } from '../theme/tokens';

const ActionButtons = ({ onLike, onDislike, onSuperLike }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.dislikeButton]}
        onPress={onDislike}
      >
        <Icon name="close" size={30} color={COLORS.error} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.superLikeButton]}
        onPress={onSuperLike}
      >
        <Icon name="star" size={30} color={COLORS.superLike} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.likeButton]}
        onPress={onLike}
      >
        <Icon name="heart" size={30} color={COLORS.like} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background.light
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.light,
    ...SHADOWS.small
  },
  dislikeButton: {
    borderWidth: 2,
    borderColor: COLORS.error
  },
  superLikeButton: {
    borderWidth: 2,
    borderColor: COLORS.superLike
  },
  likeButton: {
    borderWidth: 2,
    borderColor: COLORS.like
  }
});

export default ActionButtons;
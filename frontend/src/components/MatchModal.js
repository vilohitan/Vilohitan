import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/tokens';

const MatchModal = ({ visible, matchedUser, onClose, onMessage }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.matchText}>It's a Match!</Text>
          <View style={styles.photosContainer}>
            <Image
              source={{ uri: matchedUser.photo }}
              style={styles.photo}
            />
            <Image
              source={{ uri: currentUser.photo }}
              style={styles.photo}
            />
          </View>
          <Text style={styles.description}>
            You and {matchedUser.name} have liked each other!
          </Text>
          
          <TouchableOpacity
            style={[styles.button, styles.messageButton]}
            onPress={onMessage}
          >
            <Text style={styles.buttonText}>Send a Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.keepSwipingButton]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, styles.keepSwipingText]}>
              Keep Swiping
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: '80%',
    backgroundColor: COLORS.background.light,
    borderRadius: 20,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.medium
  },
  matchText: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.lg
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: SPACING.sm
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl
  },
  button: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: 25,
    marginBottom: SPACING.md
  },
  messageButton: {
    backgroundColor: COLORS.primary
  },
  keepSwipingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.light,
    textAlign: 'center'
  },
  keepSwipingText: {
    color: COLORS.primary
  }
});

export default MatchModal;
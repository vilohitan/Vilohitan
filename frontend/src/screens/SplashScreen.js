import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/tokens';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-transition after 2.5 seconds
    setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        Connect. Match. Thrive.
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.xl,
  },
  tagline: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    textAlign: 'center',
  },
});

export default SplashScreen;
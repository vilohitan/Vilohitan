import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder } from 'react-native';
import { COLORS, SPACING } from '../theme/tokens';
import Card from '../components/Card';
import ActionButtons from '../components/ActionButtons';

const SWIPE_THRESHOLD = 120;

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-width/2, 0, width/2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        resetPosition();
      }
    }
  });

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false
    }).start();
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: width + 100, y: gesture.dy },
      duration: 250,
      useNativeDriver: false
    }).start(() => nextCard());
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -width - 100, y: gesture.dy },
      duration: 250,
      useNativeDriver: false
    }).start(() => nextCard());
  };

  const nextCard = () => {
    setCurrentIndex(currentIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.animatedCard,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotation }
              ]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <Card user={users[currentIndex]} />
        </Animated.View>
        {currentIndex < users.length - 1 && (
          <View style={styles.nextCard}>
            <Card user={users[currentIndex + 1]} />
          </View>
        )}
      </View>
      <ActionButtons
        onLike={swipeRight}
        onDislike={swipeLeft}
        onSuperLike={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.medium
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  animatedCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: SPACING.md
  },
  nextCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: SPACING.md,
    transform: [{ scale: 0.95 }]
  }
});

export default HomeScreen;
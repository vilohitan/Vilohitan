import { Animated, Easing } from 'react-native';
import { InteractionManager } from 'react-native';
import { requestAnimationFrame } from 'react-native';

class AnimationPerformanceTest {
  constructor() {
    this.timestamp = '2025-02-14 19:48:02';
    this.user = 'vilohitan';
    this.metrics = {
      frames: [],
      drops: 0,
      animations: new Map()
    };
    this.targetFPS = 60;
    this.frameDuration = 1000 / this.targetFPS;
  }

  async testAnimation(animation, duration = 1000) {
    const frames = [];
    let lastFrameTime = performance.now();
    let droppedFrames = 0;

    const animationId = `${animation.name}_${Date.now()}`;
    this.metrics.animations.set(animationId, {
      name: animation.name,
      startTime: this.timestamp
    });

    return new Promise((resolve) => {
      const animate = () => {
        const currentTime = performance.now();
        const delta = currentTime - lastFrameTime;

        if (delta > this.frameDuration + 5) { // 5ms threshold for dropped frames
          droppedFrames++;
          this.metrics.drops++;
        }

        frames.push({
          timestamp: currentTime,
          delta,
          dropped: delta > this.frameDuration + 5
        });

        lastFrameTime = currentTime;

        if (frames.length * this.frameDuration < duration) {
          requestAnimationFrame(animate);
        } else {
          this.metrics.animations.get(animationId).endTime = this.timestamp;
          this.metrics.animations.get(animationId).metrics = {
            totalFrames: frames.length,
            droppedFrames,
            averageFPS: (frames.length * 1000) / duration
          };
          resolve(this.analyzePerformance(frames, droppedFrames));
        }
      };

      animation.start();
      requestAnimationFrame(animate);
    });
  }

  createTestAnimation(config) {
    const { type, duration, fromValue, toValue } = config;
    const animatedValue = new Animated.Value(fromValue);

    const animation = Animated[type](animatedValue, {
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.easeInOut
    });

    return {
      name: `${type}_animation`,
      start: () => animation.start(),
      getValue: () => animatedValue
    };
  }

  async testComplexAnimation(animations) {
    const results = [];
    
    for (const animation of animations) {
      const result = await this.testAnimation(animation);
      results.push({
        animation: animation.name,
        ...result
      });
    }

    return {
      timestamp: this.timestamp,
      results,
      summary: this.calculateComplexAnimationMetrics(results)
    };
  }

  async testInteractionAnimation(interaction, animation) {
    return new Promise((resolve) => {
      InteractionManager.runAfterInteractions(() => {
        this.testAnimation(animation).then(resolve);
      });

      interaction();
    });
  }

  analyzePerformance(frames, droppedFrames) {
    const totalDuration = frames[frames.length - 1].timestamp - frames[0].timestamp;
    const actualFPS = (frames.length * 1000) / totalDuration;
    const jank = this.calculateJank(frames);

    return {
      timestamp: this.timestamp,
      metrics: {
        totalFrames: frames.length,
        droppedFrames,
        actualFPS,
        targetFPS: this.targetFPS,
        jankScore: jank.score,
        smoothness: (1 - droppedFrames / frames.length) * 100,
        averageFrameDuration: totalDuration / frames.length
      },
      jankInstances: jank.instances,
      performance: this.getPerformanceGrade(actualFPS, droppedFrames)
    };
  }

  calculateJank(frames) {
    const jankThreshold = this.frameDuration * 2; // 2 frames worth of time
    const instances = frames.filter(frame => frame.delta > jankThreshold);
    
    return {
      score: instances.length / frames.length,
      instances: instances.map(frame => ({
        timestamp: frame.timestamp,
        duration: frame.delta
      }))
    };
  }

  getPerformanceGrade(fps, droppedFrames) {
    if (fps >= 58 && droppedFrames === 0) return 'Excellent';
    if (fps >= 55 && droppedFrames <= 2) return 'Good';
    if (fps >= 45 && droppedFrames <= 5) return 'Fair';
    return 'Poor';
  }

  calculateComplexAnimationMetrics(results) {
    return {
      averageFPS: results.reduce((acc, r) => acc + r.metrics.actualFPS, 0) / results.length,
      totalDroppedFrames: results.reduce((acc, r) => acc + r.metrics.droppedFrames, 0),
      overallPerformance: this.getOverallPerformance(results)
    };
  }

  getOverallPerformance(results) {
    const grades = results.map(r => r.performance);
    if (grades.every(g => g === 'Excellent')) return 'Excellent';
    if (grades.every(g => g === 'Good' || g === 'Excellent')) return 'Good';
    if (grades.some(g => g === 'Poor')) return 'Poor';
    return 'Fair';
  }

  generateReport() {
    return {
      timestamp: this.timestamp,
      user: this.user,
      animations: Array.from(this.metrics.animations.entries()),
      summary: {
        totalAnimations: this.metrics.animations.size,
        totalDroppedFrames: this.metrics.drops,
        averagePerformance: Array.from(this.metrics.animations.values())
          .reduce((acc, anim) => acc + anim.metrics?.averageFPS || 0, 0) / 
          this.metrics.animations.size
      }
    };
  }
}

export default new AnimationPerformanceTest();
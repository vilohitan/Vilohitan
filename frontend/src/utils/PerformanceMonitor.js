import { InteractionManager } from 'react-native';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      lastUpdate: '2025-02-14 19:19:12',
      user: 'vilohitan',
      screenLoadTimes: {},
      memoryWarnings: 0,
      frameDrops: 0,
      interactions: {}
    };
  }

  trackScreenLoad(screenName, startTime) {
    const loadTime = Date.now() - startTime;
    this.metrics.screenLoadTimes[screenName] = {
      time: loadTime,
      timestamp: '2025-02-14 19:19:12'
    };

    if (loadTime > 500) {
      console.warn(`Slow screen load: ${screenName} (${loadTime}ms)`);
    }
  }

  async deferredOperation(operation) {
    return new Promise((resolve) => {
      InteractionManager.runAfterInteractions(() => {
        const result = operation();
        resolve(result);
      });
    });
  }

  startInteractionTimer(interactionName) {
    this.metrics.interactions[interactionName] = {
      startTime: Date.now(),
      timestamp: '2025-02-14 19:19:12'
    };
  }

  endInteractionTimer(interactionName) {
    if (this.metrics.interactions[interactionName]) {
      const duration = Date.now() - this.metrics.interactions[interactionName].startTime;
      this.metrics.interactions[interactionName].duration = duration;

      if (duration > 100) {
        console.warn(`Slow interaction: ${interactionName} (${duration}ms)`);
      }
    }
  }

  reportMemoryWarning() {
    this.metrics.memoryWarnings++;
    console.warn(`Memory warning #${this.metrics.memoryWarnings} for user ${this.user}`);
  }

  reportFrameDrop() {
    this.metrics.frameDrops++;
  }

  getMetrics() {
    return {
      ...this.metrics,
      timestamp: '2025-02-14 19:19:12'
    };
  }
}

export default new PerformanceMonitor();
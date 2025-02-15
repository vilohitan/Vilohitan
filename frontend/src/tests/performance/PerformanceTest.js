import { PerformanceObserver, performance } from 'perf_hooks';
import { render } from '@testing-library/react-native';

class PerformanceTest {
  constructor() {
    this.metrics = {
      timestamp: '2025-02-14 19:41:36',
      user: 'vilohitan',
      renderTimes: [],
      memoryUsage: [],
      interactionTimes: []
    };

    this.setupPerformanceObserver();
  }

  setupPerformanceObserver() {
    const obs = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.metrics.renderTimes.push({
          component: entry.name,
          duration: entry.duration,
          timestamp: '2025-02-14 19:41:36'
        });
      });
    });
    
    obs.observe({ entryTypes: ['measure'] });
  }

  async measureComponentRender(Component, props = {}) {
    performance.mark('renderStart');
    
    const { rerender } = render(<Component {...props} />);
    
    performance.mark('renderEnd');
    performance.measure('renderDuration', 'renderStart', 'renderEnd');

    return rerender;
  }

  async measureInteraction(interaction) {
    const start = performance.now();
    await interaction();
    const duration = performance.now() - start;

    this.metrics.interactionTimes.push({
      type: interaction.name,
      duration,
      timestamp: '2025-02-14 19:41:36'
    });

    return duration;
  }

  recordMemoryUsage() {
    const memory = process.memoryUsage();
    this.metrics.memoryUsage.push({
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal,
      external: memory.external,
      timestamp: '2025-02-14 19:41:36'
    });
  }

  generateReport() {
    return {
      ...this.metrics,
      averageRenderTime: this.calculateAverageRenderTime(),
      averageMemoryUsage: this.calculateAverageMemoryUsage(),
      timestamp: '2025-02-14 19:41:36'
    };
  }

  calculateAverageRenderTime() {
    const times = this.metrics.renderTimes.map(m => m.duration);
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  calculateAverageMemoryUsage() {
    const usage = this.metrics.memoryUsage.map(m => m.heapUsed);
    return usage.reduce((a, b) => a + b, 0) / usage.length;
  }
}

export default new PerformanceTest();
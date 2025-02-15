import { performance } from 'perf_hooks';

class LoadTest {
  constructor() {
    this.timestamp = '2025-02-14 19:43:52';
    this.user = 'vilohitan';
    this.metrics = {
      requests: [],
      responses: [],
      errors: []
    };
  }

  async simulateLoad(config) {
    const {
      endpoint,
      method = 'GET',
      concurrentUsers = 1,
      requestsPerUser = 1,
      delay = 0
    } = config;

    const startTime = performance.now();
    const promises = [];

    for (let user = 0; user < concurrentUsers; user++) {
      for (let req = 0; req < requestsPerUser; req++) {
        promises.push(
          this.makeRequest(endpoint, method, user, req, delay)
        );
      }
    }

    const results = await Promise.allSettled(promises);
    const endTime = performance.now();

    return this.analyzeResults(results, endTime - startTime);
  }

  async makeRequest(endpoint, method, userId, reqId, delay) {
    const requestStart = performance.now();

    try {
      if (delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const response = await fetch(endpoint, { method });
      const responseTime = performance.now() - requestStart;

      this.recordMetric('responses', {
        userId,
        reqId,
        responseTime,
        status: response.status,
        timestamp: this.timestamp
      });

      return { success: true, responseTime };
    } catch (error) {
      this.recordMetric('errors', {
        userId,
        reqId,
        error: error.message,
        timestamp: this.timestamp
      });

      return { success: false, error: error.message };
    }
  }

  recordMetric(type, data) {
    this.metrics[type].push(data);
  }

  analyzeResults(results, totalTime) {
    const successful = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');

    const responseTimes = successful
      .map(r => r.value.responseTime)
      .filter(Boolean);

    return {
      timestamp: this.timestamp,
      user: this.user,
      summary: {
        totalRequests: results.length,
        successfulRequests: successful.length,
        failedRequests: failed.length,
        totalTime,
        averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
        minResponseTime: Math.min(...responseTimes),
        maxResponseTime: Math.max(...responseTimes),
        requestsPerSecond: (successful.length / totalTime) * 1000
      },
      metrics: this.metrics
    };
  }

  async testMemoryUnderLoad(component, iterations = 100) {
    const memorySnapshots = [];

    for (let i = 0; i < iterations; i++) {
      const snapshot = process.memoryUsage();
      memorySnapshots.push({
        iteration: i,
        heapUsed: snapshot.heapUsed,
        timestamp: this.timestamp
      });

      // Render component
      await this.renderComponent(component);
    }

    return this.analyzeMemoryUsage(memorySnapshots);
  }

  analyzeMemoryUsage(snapshots) {
    const heapUsage = snapshots.map(s => s.heapUsed);
    const memoryGrowth = heapUsage[heapUsage.length - 1] - heapUsage[0];

    return {
      timestamp: this.timestamp,
      user: this.user,
      memoryMetrics: {
        initialHeap: heapUsage[0],
        finalHeap: heapUsage[heapUsage.length - 1],
        memoryGrowth,
        averageHeapUsage: heapUsage.reduce((a, b) => a + b, 0) / heapUsage.length
      },
      snapshots
    };
  }
}

export default new LoadTest();
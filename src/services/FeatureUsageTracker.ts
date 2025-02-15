interface FeatureUsage {
  featureId: string;
  userId: string;
  timestamp: string;
  duration: number;
  success: boolean;
  metrics: Record<string, any>;
}

class FeatureUsageTracker {
  private usageStream: Subject<FeatureUsage>;
  private analyticsBuffer: FeatureUsage[];
  private batchSize: number;
  private flushInterval: number;

  constructor() {
    this.usageStream = new Subject<FeatureUsage>();
    this.analyticsBuffer = [];
    this.batchSize = 100;
    this.flushInterval = 5000; // 5 seconds
    this.initializePeriodicFlush();
  }

  trackFeatureUsage(
    featureId: string,
    userId: string,
    metrics: Record<string, any>
  ) {
    const usage: FeatureUsage = {
      featureId,
      userId,
      timestamp: new Date().toISOString(),
      duration: metrics.duration || 0,
      success: metrics.success || true,
      metrics
    };

    this.usageStream.next(usage);
    this.analyticsBuffer.push(usage);

    if (this.analyticsBuffer.length >= this.batchSize) {
      this.flushAnalytics();
    }
  }

  private initializePeriodicFlush() {
    setInterval(() => {
      if (this.analyticsBuffer.length > 0) {
        this.flushAnalytics();
      }
    }, this.flushInterval);
  }

  private async flushAnalytics() {
    const batch = [...this.analyticsBuffer];
    this.analyticsBuffer = [];

    try {
      await this.sendAnalyticsBatch(batch);
    } catch (error) {
      console.error('Failed to flush analytics:', error);
      // Retry failed analytics
      this.analyticsBuffer = [...batch, ...this.analyticsBuffer];
    }
  }

  private async sendAnalyticsBatch(batch: FeatureUsage[]) {
    // Implement your analytics backend call here
    await fetch('/api/analytics/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        batch,
        timestamp: new Date().toISOString(),
        user: 'vilohitan'
      })
    });
  }
}
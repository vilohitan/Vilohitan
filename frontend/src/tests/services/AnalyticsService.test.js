import AnalyticsService from '../../services/AnalyticsService';

describe('AnalyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct user and timestamp', () => {
    expect(AnalyticsService.user).toBe('vilohitan');
    expect(AnalyticsService.sessionStartTime).toBe('2025-02-14 19:40:01');
  });

  it('logs events correctly', async () => {
    await AnalyticsService.logEvent('test_event', { param: 'value' });
    const report = AnalyticsService.getAnalyticsReport();
    
    expect(report.user).toBe('vilohitan');
    expect(report.timestamp).toBe('2025-02-14 19:40:01');
  });

  it('calculates session duration correctly', () => {
    const duration = AnalyticsService.getSessionDuration();
    expect(typeof duration).toBe('number');
    expect(duration).toBeGreaterThanOrEqual(0);
  });
});
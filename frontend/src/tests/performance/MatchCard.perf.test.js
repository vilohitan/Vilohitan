import PerformanceTest from './PerformanceTest';
import MatchCard from '../../components/MatchCard';

describe('MatchCard Performance Tests', () => {
  const mockProps = {
    user: {
      id: 'test123',
      name: 'Test User',
      age: 28,
      photos: ['https://example.com/photo.jpg'],
      lastActive: '2025-02-14 19:41:36'
    },
    onLike: jest.fn(),
    onPass: jest.fn()
  };

  it('should render efficiently', async () => {
    const rerender = await PerformanceTest.measureComponentRender(MatchCard, mockProps);
    const report = PerformanceTest.generateReport();
    
    expect(report.averageRenderTime).toBeLessThan(16); // Target 60fps
  });

  it('should handle interactions efficiently', async () => {
    const duration = await PerformanceTest.measureInteraction(async () => {
      await mockProps.onLike();
    });

    expect(duration).toBeLessThan(100); // Max 100ms response time
  });

  it('should maintain stable memory usage', () => {
    for (let i = 0; i < 100; i++) {
      PerformanceTest.measureComponentRender(MatchCard, mockProps);
      PerformanceTest.recordMemoryUsage();
    }

    const report = PerformanceTest.generateReport();
    const memoryGrowth = report.memoryUs ▋
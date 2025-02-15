import { renderHook, act } from '@testing-library/react-hooks';
import { useMatching } from '../../hooks/useMatching';
import ApiService from '../../services/ApiService';
import AnalyticsService from '../../services/AnalyticsService';
import SecurityTest from '../security/SecurityTest';

jest.mock('../../services/ApiService');
jest.mock('../../services/AnalyticsService');

describe('Matching Flow Integration', () => {
  const testContext = {
    user: 'vilohitan',
    timestamp: '2025-02-14 19:42:39'
  };

  const mockProfile = {
    id: 'profile123',
    name: 'Test User',
    photos: ['https://example.com/photo.jpg']
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle like action securely', async () => {
    // Mock API responses
    ApiService.likeProfile.mockResolvedValueOnce({ data: { matched: true } });

    // Initialize hook
    const { result } = renderHook(() => useMatching());

    // Perform like action
    await act(async () => {
      await result.current.handleLike(mockProfile.id);
    });

    // Verify API call
    expect(ApiService.likeProfile).toHaveBeenCalledWith(mockProfile.id);

    // Verify analytics tracking
    expect(AnalyticsService.trackUserInteraction).toHaveBeenCalledWith(
      'like_profile',
      expect.any(Object)
    );

    // Security checks
    const securityReport = SecurityTest.generateSecurityReport();
    expect(securityReport.vulnerabilities).toHaveLength(0);
  });
});
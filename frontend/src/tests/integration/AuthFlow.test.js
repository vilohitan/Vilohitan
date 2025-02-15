import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../../hooks/useAuth';
import ApiService from '../../services/ApiService';
import SecurityTest from '../security/SecurityTest';

jest.mock('../../services/ApiService');

describe('Authentication Flow Integration', () => {
  const testUser = {
    username: 'vilohitan',
    password: 'securePassword123',
    timestamp: '2025-02-14 19:42:39'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle login flow securely', async () => {
    // Mock successful login
    const mockToken = 'mock.jwt.token';
    ApiService.login.mockResolvedValueOnce({ data: { token: mockToken } });

    // Test login flow
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login(testUser);
    });

    // Verify API call
    expect(ApiService.login).toHaveBeenCalledWith({
      username: testUser.username,
      password: expect.any(String)
    });

    // Security checks
    const tokenSecurity = SecurityTest.testJWTSecurity(mockToken);
    expect(tokenSecurity).toBe(true);

    // Verify authentication state
    expect(result.current.isAuthenticated).toBe(true);
  });
});
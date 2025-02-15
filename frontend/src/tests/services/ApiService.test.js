import ApiService from '../../services/ApiService';
import axios from 'axios';

jest.mock('axios');

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes login request correctly', async () => {
    const mockCredentials = {
      username: 'vilohitan',
      password: 'password123'
    };

    const mockResponse = {
      data: {
        token: 'mock-token',
        user: {
          id: 'vilohitan',
          lastActive: '2025-02-14 19:40:01'
        }
      }
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await ApiService.login(mockCredentials);
    
    expect(axios.post).toHaveBeenCalledWith(
      `${ApiService.baseURL}/auth/login`,
      mockCredentials
    );
    expect(response).toEqual(mockResponse);
  });

  it('handles API errors correctly', async () => {
    const mockError = new Error('Network error');
    axios.post.mockRejectedValueOnce(mockError);

    await expect(ApiService ▋
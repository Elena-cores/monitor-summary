import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getConfig, patchConfig } from '../api/configApi';
import getCTFData from '../api/ctfApi';
import { register, login } from '../api/authApi';
import api from '../api/api';


// Mock the API module to intercept HTTP requests during tests
vi.mock('../api/api');


// --------------------------------------------------
// Configure API Tests
// --------------------------------------------------
describe('configApi', () => {
  // Example config data to be used in test responses
  const mockConfig = {
    maxres_min: 1.0,
    maxres_max: 3.0,
    maxres_interval: 0.5
  };

  // Prepare mock responses before each test
  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockConfig });
    api.patch.mockResolvedValue({ data: mockConfig });
  });

  // Reset all mocks after each test to avoid state leakage
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('1. Should fetch config data', async () => {
    const result = await getConfig();

    // Verify the correct endpoint is called
    expect(api.get).toHaveBeenCalledWith('http://localhost:8000/api/config/');

    // confirm the returned data matches the mock config
    expect(result).toEqual(mockConfig);
  });

  it('2. Should handle errors when fetching config', async () => {
    const errorMessage = 'Network Error';
    api.get.mockRejectedValue(new Error(errorMessage));

    //Expect the function to throw when the request fails
    await expect(getConfig()).rejects.toThrow(errorMessage);
  });

  it('3. Should update config data', async () => {
    const updatedConfig = { ...mockConfig, maxres_min: 2.0 };
    api.patch.mockResolvedValue({ data: updatedConfig });

    const result = await patchConfig(updatedConfig);

    // Ensure the correct URL and payload were sent
    expect(api.patch).toHaveBeenCalledWith('http://localhost:8000/api/config/', updatedConfig);

    // check that the function returns the updated config
    expect(result).toEqual(updatedConfig);
  });

  it('4. Should handle errors when updating config', async () => {
    const errorMessage = 'Network Error';
    api.patch.mockRejectedValue(new Error(errorMessage));

    // Expect the function to throw when patching fails
    await expect(patchConfig(mockConfig)).rejects.toThrow(errorMessage);
  });
});

// --------------------------------------------------
// CTF API Tests
// --------------------------------------------------
describe('ctfApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('5. should fetch CTF data successfully', async () => {
    const mockData = [{ id: 1, value: 'A' }];
    api.get.mockResolvedValue({ data: mockData });

    const result = await getCTFData();

    expect(api.get).toHaveBeenCalledWith('http://localhost:8000/api/ctf/');
    expect(result).toEqual(mockData);
  });

  it('6. should handle 401 server error', async () => {
    api.get.mockRejectedValue({
      response: {
        status: 401,
        statusText: 'Unauthorized',
        data: {},
      },
    });

    await expect(getCTFData()).rejects.toThrow('Server error: 401 - Unauthorized');
  });

  it('7. should handle network error (no response)', async () => {
    api.get.mockRejectedValue({
      request: {},
    });

    await expect(getCTFData()).rejects.toThrow('Network error: Could not connect to the server');
  });

  it('8. should handle request setup error', async () => {
    api.get.mockRejectedValue({
      message: 'Request config failed',
    });

    await expect(getCTFData()).rejects.toThrow('Failed to create API request');
  });
});

// --------------------------------------------------
// Authorization API Tests
// --------------------------------------------------
describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('9. should register successfully', async () => {
      const mockResponse = { token: 'abc', user_id: 1, username: 'test' };
      api.post.mockResolvedValue({ data: mockResponse });

      const result = await register({ username: 'test', password: '1234' });
      expect(api.post).toHaveBeenCalledWith('http://localhost:8000/api/auth/register/', { username: 'test', password: '1234' });
      expect(result).toEqual(mockResponse);
    });

    it('10. should handle validation error: username', async () => {
      api.post.mockRejectedValue({
        response: { data: { username: ['Already taken'] } },
      });

      await expect(register({})).rejects.toThrow('Username: Already taken');
    });

    it('11. should handle validation error: password', async () => {
      api.post.mockRejectedValue({
        response: { data: { password: ['Too short'] } },
      });

      await expect(register({})).rejects.toThrow('Password: Too short');
    });

    it('12. should handle unknown error', async () => {
      api.post.mockRejectedValue({
        message: 'Unknown error',
      });

      await expect(register({})).rejects.toThrow('Request failed. Please try again');
    });
  });

  describe('login', () => {
    it('13. should login successfully', async () => {
      const mockData = { token: 'def', user_id: 2, username: 'tester' };
      api.post.mockResolvedValue({ data: mockData });

      const result = await login({ username: 'tester', password: 'secret' });
      expect(api.post).toHaveBeenCalledWith('http://localhost:8000/api/auth/login/', { username: 'tester', password: 'secret' });
      expect(result).toEqual(mockData);
    });

    it('14. should handle invalid credentials (400)', async () => {
      api.post.mockRejectedValue({
        response: { status: 400 },
      });

      await expect(login({})).rejects.toThrow('Invalid username or password');
    });

    it('15. should handle generic error', async () => {
      api.post.mockRejectedValue({
        message: 'Timeout',
      });

      await expect(login({})).rejects.toThrow('Request failed. Please try again');
    });
  });
});
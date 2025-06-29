import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getConfig, patchConfig } from '../api/configApi';
import api from '../api/api';

// Mock the API module to intercept HTTP requests during tests
vi.mock('../api/api');

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

  it('should fetch config data', async () => {
    const result = await getConfig();

    // Verify the correct endpoint is called
    expect(api.get).toHaveBeenCalledWith('http://localhost:8000/api/config/');

    // confirm the returned data matches the mock config
    expect(result).toEqual(mockConfig);
  });

  it('should handle errors when fetching config', async () => {
    const errorMessage = 'Network Error';
    api.get.mockRejectedValue(new Error(errorMessage));

    //Expect the function to throw when the request fails
    await expect(getConfig()).rejects.toThrow(errorMessage);
  });

  it('should update config data', async () => {
    const updatedConfig = { ...mockConfig, maxres_min: 2.0 };
    api.patch.mockResolvedValue({ data: updatedConfig });

    const result = await patchConfig(updatedConfig);

    // Ensure the correct URL and payload were sent
    expect(api.patch).toHaveBeenCalledWith('http://localhost:8000/api/config/', updatedConfig);

    // check that the function returns the updated config
    expect(result).toEqual(updatedConfig);
  });

  it('should handle errors when updating config', async () => {
    const errorMessage = 'Network Error';
    api.patch.mockRejectedValue(new Error(errorMessage));

    // Expect the function to throw when patching fails
    await expect(patchConfig(mockConfig)).rejects.toThrow(errorMessage);
  });
});

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';  // For rendering components and simulating actions
import { ConfigProvider, useConfig } from '../contexts/ConfigContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';  // Importing the Auth context
import { getConfig, patchConfig } from '../api/configApi';  // Importing the API functions to mock
import { DataProvider, useData } from '../contexts/DataContext';
import getCTFData from '../api/ctfApi';

// --------------------------------------------------
// ConfigContext Tests
// --------------------------------------------------

// Mock of useAuth() to control if the user is authenticated
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true })
}));

vi.mock('../api/ctfApi', () => ({
  default: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

// Mock of the API calls for getConfig and patchConfig
vi.mock('../api/configApi', () => ({
  getConfig: vi.fn(),
  patchConfig: vi.fn(),
}));

describe('ConfigContext', () => {
  // Mock configuration object used in the tests
  const mockConfig = {
    maxres_min: 1.0,
    maxres_max: 3.0,
    maxres_interval: 0.5,
    defocuscov_min: 0.5,
    defocuscov_max: 2.0,
    defocuscov_interval: 0.2,
    color_resolution: '#123456',
    color_defocusu: '#654321',
  };

  // Set up before each test to mock the resolved values for the API functions
  beforeEach(() => {
    getConfig.mockResolvedValue(mockConfig);
    patchConfig.mockResolvedValue(mockConfig);
  });

  // Clean up mocks after each test to prevent side effects
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Should load the initial configuration if the user is authenticated
  it('1. Should load the initial configuration if the user is authenticated', async () => {
    render(
      <ConfigProvider>
        <div>Test</div>
      </ConfigProvider>
    );

    // Check that getConfig was called once during initial render
    expect(getConfig).toHaveBeenCalledTimes(1);
  });

  // Test 2: The useConfig hook should provide the expected structure
  it('2. The useConfig hook provides the expected structure', async () => {
    let context;

    function TestComponent() {
      context = useConfig();  // Use the custom hook inside a test component
      return null;
    }

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    // Check that the context matches the expected structure
    expect(context).toMatchObject({
      config: expect.any(Object),
      loading: expect.any(Boolean),
      error: null,
      updateConfig: expect.any(Function),
      refreshConfig: expect.any(Function),
      defocusParameter: expect.any(String),
      setDefocusParameter: expect.any(Function),
    });
  });

  // Test 3: updateConfig should correctly update the configuration
  it('3. updateConfig correctly updates the configuration', async () => {
    const updatedConfig = { ...mockConfig, maxres_min: 2.0 };
    patchConfig.mockResolvedValue(updatedConfig);

    let updateFn;
    function TestComponent() {
      updateFn = useConfig().updateConfig;
      return null;
    }

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    // Test the updateConfig function using act to handle asynchronous updates
    await act(async () => {
      const result = await updateFn(updatedConfig);
      expect(result).toEqual(updatedConfig);  // Ensure the result matches the expected updated config
    });

    // Ensure that patchConfig was called with the correct updated config
    expect(patchConfig).toHaveBeenCalledWith(updatedConfig);
  });

  // Test 4: refreshConfig should reload the configuration
  it('4. refreshConfig reloads the configuration', async () => {
    let refreshFn;

    function TestComponent() {
      refreshFn = useConfig().refreshConfig;  // Get the refreshConfig function from the hook
      return null;
    }

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    // Test the refreshConfig function to ensure it reloads data
    await act(async () => {
      await refreshFn();  // Simulate a refresh
    });

    // Ensure getConfig was called twice (once on mount and once after refresh)
    expect(getConfig).toHaveBeenCalledTimes(2);
  });

  // Test 5: Handle errors when loading the configuration
  it('5. Handles errors when loading the configuration', async () => {
    const errorMsg = 'Network error';
    getConfig.mockRejectedValueOnce(new Error(errorMsg));  // Simulate a network error for the first call

    let errorState;
    function TestComponent() {
      const { error } = useConfig();  // Capture the error from the context
      errorState = error;
      return null;
    }

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    // Wait for the asynchronous operation to complete
    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    // Ensure that the error state has been updated with the correct message
    expect(errorState).toBe(errorMsg);
  });
});

// --------------------------------------------------
// DataContext Tests
// --------------------------------------------------

describe('DataContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  // Test 6: load CTF data when authenticated
  it('loads CTF data when authenticated', async () => {
    const mockData = [{ id: 1, value: 123 }];
    getCTFData.mockResolvedValue(mockData);

    let context;
    function TestComponent() {
      context = useData();
      return null;
    }

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    await act(() => Promise.resolve());

    expect(context.ctfData).toEqual(mockData);
    expect(context.error).toBe(null);
  });

  // Test 7: clear CTF data when not authenticated
  it('shows error if fetching CTF data fails', async () => {
    getCTFData.mockRejectedValue(new Error('fail'));

    let context;
    function TestComponent() {
      context = useData();
      return null;
    }

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    await act(() => Promise.resolve());

    expect(context.ctfData).toEqual([]);
    expect(context.error).toBe('Failed to load CTF data');
  });
});
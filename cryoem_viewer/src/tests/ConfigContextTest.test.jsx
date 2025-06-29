import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'; 
import { render, act } from '@testing-library/react';
import { ConfigProvider, useConfig } from '../contexts/ConfigContext';
import { getConfig, patchConfig } from '../api/configApi';

// Mock the API module to simulate external behavior
vi.mock('../api/configApi', () => ({
  getConfig: vi.fn(),
  patchConfig: vi.fn(),
}));


describe('ConfigContext', () => {
  // Sample mock configuration data used for testing
  const mockConfig = {
    maxres_min: 1.0,
    maxres_max: 3.0,
    maxres_interval: 0.5,
    color_resolution: '#2CAFFE'
  };

  // set up mock implementations before each test
  beforeEach(() => {
    getConfig.mockResolvedValue(mockConfig);
    patchConfig.mockResolvedValue(mockConfig);
  });

  // Clear mock states after each test to prevent cross-test pollution
  afterEach(() => {
    vi.clearAllMocks();
  });

  // -- CORE TEST CASES --

  it('1. Should fetch initial configuration on mount', async () => {
    render(
      <ConfigProvider>
        <div>Test</div>
      </ConfigProvider>
    );

    // Ensures the context attempts to fetch configuration upon initialization
    expect(getConfig).toHaveBeenCalledTimes(1);
  });

  it('2. Should provide expected context structure and initial values', async () => {
    let contextValues;

    function TestComponent() {
      contextValues = useConfig(); // hook to capture context values
      return null;
    }

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    // verify the structure of the context object and types of its properties
    expect(contextValues).toEqual({
      config: expect.any(Object),
      loading: expect.any(Boolean),
      error: null,
      updateConfig: expect.any(Function),
      refreshConfig: expect.any(Function),
      defocusParameter: expect.any(String),
      setDefocusParameter: expect.any(Function)
    });
  });

  it('3. updateConfig should correctly trigger configuration update', async () => {
    let updateFn;

    function TestComponent() {
      const { updateConfig } = useConfig(); // Capture the update function from context
      updateFn = updateConfig;
      return null;
    }

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    const newConfig = { ...mockConfig, maxres_min: 2.0 };

    await act(async () => {
      await updateFn(newConfig); // Simulate calling the update function with new data
    }); 

    // Ensure the patchConfig API is called with the updated config
    expect(patchConfig).toHaveBeenCalledWith(newConfig);
  });

  it('4. Should handle errors when configuration loading fails', async () => {
    const errorMessage = 'Network error';
    getConfig.mockRejectedValue(new Error(errorMessage)); // Simulate API failure

    let errorValue;

    function TestComponent() {
      const { error } = useConfig(); // Capture the error state from context
      errorValue = error;
      return null;
    }

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0)); // Allow time for async effects to run
    });

    // Confirm that the error state reflects the rejection message
    expect(errorValue).toBe(errorMessage);
  });
});

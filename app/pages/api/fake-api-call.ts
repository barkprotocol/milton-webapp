async function fakeApiCall(endpoint: string, data: Record<string, any>): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
    // Simulating random errors for testing
    const randomError = Math.random() < 0.3; // 30% chance to simulate an error
  
    if (randomError) {
      // Simulate different error types
      const errorTypes = [
        'Network Error: Unable to reach the server.',
        'Validation Error: Required fields are missing.',
        'Authentication Error: Invalid credentials.',
        'Server Error: Something went wrong on our end.',
      ];
      const randomErrorMessage = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      return { success: false, error: randomErrorMessage };
    }
  
    return { success: true, data: { ...data, endpoint } }; // Simulated success response
  }
  
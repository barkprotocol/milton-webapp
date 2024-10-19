// src/__tests__/ApiDemo.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApiDemo from '../app/pages/api/endpoint'; // Adjust the import path as necessary
import React from 'react';
import test, { describe } from 'node:test';

// Mock the API call directly
const mockApiCall = jest.fn(async (endpoint: string, data: Record<string, any>) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const randomError = Math.random() < 0.3; // 30% chance to simulate an error

  if (randomError) {
    const errorTypes = [
      'Network Error: Unable to reach the server.',
      'Validation Error: Required fields are missing.',
      'Authentication Error: Invalid credentials.',
      'Server Error: Something went wrong on our end.',
    ];
    const randomErrorMessage = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    return { success: false, error: randomErrorMessage };
  }

  return { success: true, data: { message: 'API call successful!' } };
});

jest.mock('../app/pages/api/endpoint', () => ({
  fakeApiCall: mockApiCall,
}));

describe('ApiDemo Component', () => {
  beforeEach(() => {
    render(<ApiDemo />);
  });

  test('renders the ApiDemo component', () => {
    expect(screen.getByText(/API Demo/i)).toBeInTheDocument();
  });

  test('fills in fields and submits successfully', async () => {
    const blinkTab = screen.getByText(/Blinks/i);
    fireEvent.click(blinkTab);

    fireEvent.change(screen.getByPlaceholderText(/Blink text/i), { target: { value: 'Hello World' } });
    fireEvent.change(screen.getByPlaceholderText(/User ID/i), { target: { value: 'User123' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/Success!/i)).toBeInTheDocument();
      expect(screen.getByText(/API call successful!/i)).toBeInTheDocument();
    });
  });

  test('displays validation error when required fields are missing', async () => {
    const blinkTab = screen.getByText(/Blinks/i);
    fireEvent.click(blinkTab);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  test('simulates different error scenarios', async () => {
    const blinkTab = screen.getByText(/Blinks/i);
    fireEvent.click(blinkTab);

    // Fill in only one required field
    fireEvent.change(screen.getByPlaceholderText(/Blink text/i), { target: { value: 'Hello World' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import { AppContext } from '../AppContext';
import AutoPolicyForm from '../autoform';

const mock = new MockAdapter(axios);

describe('AutoPolicyForm component', () => {
  const contextValue = { suserPolicyId: 123 };

  beforeAll(() => {
    window.alert = jest.fn();
  });

  beforeEach(() => {
    mock.reset();
  });

  test('renders AutoPolicyForm component with all form fields', () => {
    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AutoPolicyForm />
        </MemoryRouter>
      </AppContext.Provider>
    );

    expect(screen.getByText('Auto Insurance')).toBeInTheDocument();
    expect(screen.getByLabelText('Vehicle Model No')).toBeInTheDocument();
    expect(screen.getByLabelText('License Plate No')).toBeInTheDocument();
    expect(screen.getByLabelText('Vehicle Value')).toBeInTheDocument();
    expect(screen.getByLabelText('Vehicle Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Driver\'s Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload Cheat Sheet')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Commercial')).toBeInTheDocument();
  });

  test('validates form inputs and shows error messages', async () => {
    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AutoPolicyForm />
        </MemoryRouter>
      </AppContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Vehicle Value'), { target: { value: '20000' } });
    fireEvent.change(screen.getByLabelText('Vehicle Type'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Driver\'s Age'), { target: { value: '17' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Vehicle value must be greater than ₹30,000 and end in "00".');
      expect(window.alert).toHaveBeenCalledWith('Please select a vehicle type.');
      expect(window.alert).toHaveBeenCalledWith('Please enter a valid age greater than 18.');
    });
  });

  test('handles form submission and shows success message', async () => {
    mock.onPost('http://localhost:8008/policy-documents/create/auto').reply(200);

    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AutoPolicyForm />
        </MemoryRouter>
      </AppContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Vehicle Model No'), { target: { value: 'Model123' } });
    fireEvent.change(screen.getByLabelText('License Plate No'), { target: { value: 'ABC123' } });
    fireEvent.change(screen.getByLabelText('Vehicle Value'), { target: { value: '31000' } });
    fireEvent.change(screen.getByLabelText('Vehicle Type'), { target: { value: '4 wheeler' } });
    fireEvent.change(screen.getByLabelText('Driver\'s Age'), { target: { value: '25' } });

    const file = new File(['cheat sheet content'], 'cheatsheet.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('Upload Cheat Sheet'), { target: { files: [file] } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Policy document created successfully!')).toBeInTheDocument();
    });
  });

  test('handles form submission and shows error message on failure', async () => {
    mock.onPost('http://localhost:8008/policy-documents/create/auto').reply(500);

    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <AutoPolicyForm />
        </MemoryRouter>
      </AppContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Vehicle Model No'), { target: { value: 'Model123' } });
    fireEvent.change(screen.getByLabelText('License Plate No'), { target: { value: 'ABC123' } });
    fireEvent.change(screen.getByLabelText('Vehicle Value'), { target: { value: '31000' } });
    fireEvent.change(screen.getByLabelText('Vehicle Type'), { target: { value: '4 wheeler' } });
    fireEvent.change(screen.getByLabelText('Driver\'s Age'), { target: { value: '25' } });

    const file = new File(['cheat sheet content'], 'cheatsheet.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('Upload Cheat Sheet'), { target: { files: [file] } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Error creating policy document.')).toBeInTheDocument();
    });
  });
});

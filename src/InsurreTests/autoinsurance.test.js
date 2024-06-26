import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContext } from '../AppContext';
import AutoInsurance from '../autoinsurance';

const mock = new axiosMock(axios);

const mockAppContext = {
  suserId: '12345',
  setSuserPolicyId: jest.fn(),
};

const renderComponent = () =>
  render(
    <AppContext.Provider value={mockAppContext}>
      <Router>
        <AutoInsurance />
      </Router>
    </AppContext.Provider>
  );

describe('AutoInsurance Component', () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    renderComponent();
    
    expect(screen.getByText('Auto Insurance Shield')).toBeInTheDocument();
    expect(screen.getByText('Shielding your journey with reliable coverage')).toBeInTheDocument();
    expect(screen.getByLabelText('Vehicle Value (₹)')).toBeInTheDocument();
    expect(screen.getByLabelText('Coverage Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Vehicle Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Primary Use')).toBeInTheDocument();
    expect(screen.getByLabelText('Roadside Assistance')).toBeInTheDocument();
    expect(screen.getByLabelText('Zero Depreciation')).toBeInTheDocument();
    expect(screen.getByLabelText('Engine Protection')).toBeInTheDocument();
    expect(screen.getByLabelText('Payment Frequency:')).toBeInTheDocument();
    expect(screen.getByText('Calculate Premium')).toBeInTheDocument();
    expect(screen.getByText('Buy Now')).toBeInTheDocument();
  });

  test('validates form correctly', async () => {
    renderComponent();
    
    fireEvent.change(screen.getByLabelText('Vehicle Value (₹)'), { target: { value: '20000' } });
    fireEvent.change(screen.getByLabelText('Vehicle Age'), { target: { value: '60' } });
    
    fireEvent.click(screen.getByText('Calculate Premium'));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Vehicle value must be greater than ₹30,000 and end in "00".');
      expect(window.alert).toHaveBeenCalledWith('Vehicle age must be less than 50 years.');
    });
  });

  test('calculates premium and IDV correctly', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Vehicle Value (₹)'), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText('Vehicle Age'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Primary Use'), { target: { value: 'personal' } });
    fireEvent.change(screen.getByLabelText('Coverage Type'), { target: { value: 'STANDARD' } });

    fireEvent.click(screen.getByText('Calculate Premium'));
    
    await waitFor(() => {
      expect(screen.getByText(/Here is your calculated premium: ₹/i)).toBeInTheDocument();
      expect(screen.getByText(/Your Insurance Declared Value \(IDV\): ₹/i)).toBeInTheDocument();
    });
  });

  test('handles form submission correctly', async () => {
    mock.onPost('http://localhost:8008/user-policies/create').reply(200, {
      data: '123456',
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText('Vehicle Value (₹)'), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText('Vehicle Age'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Primary Use'), { target: { value: 'personal' } });
    fireEvent.change(screen.getByLabelText('Coverage Type'), { target: { value: 'STANDARD' } });

    fireEvent.click(screen.getByText('Calculate Premium'));

    await waitFor(() => {
      expect(screen.getByText(/Here is your calculated premium: ₹/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Buy Now'));

    await waitFor(() => {
      expect(mockAppContext.setSuserPolicyId).toHaveBeenCalledWith('123456');
      expect(window.alert).toHaveBeenCalledWith('Data saved successfully!');
    });
  });

  test('handles error when saving data', async () => {
    window.alert = jest.fn();
    mock.onPost('http://localhost:8008/user-policies/create').reply(500);

    renderComponent();

    fireEvent.change(screen.getByLabelText('Vehicle Value (₹)'), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText('Vehicle Age'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Primary Use'), { target: { value: 'personal' } });
    fireEvent.change(screen.getByLabelText('Coverage Type'), { target: { value: 'STANDARD' } });

    fireEvent.click(screen.getByText('Calculate Premium'));

    await waitFor(() => {
      expect(screen.getByText(/Here is your calculated premium: ₹/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Buy Now'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error saving data:');
    });
  });
});

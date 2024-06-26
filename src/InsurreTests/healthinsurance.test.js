import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContext } from '../AppContext';
import HealthInsurance from '../healthinsurance';

const mock = new axiosMock(axios);

const mockAppContext = {
  suserId: '12345',
  setSuserPolicyId: jest.fn(),
};

const renderComponent = () =>
  render(
    <AppContext.Provider value={mockAppContext}>
      <Router>
        <HealthInsurance />
      </Router>
    </AppContext.Provider>
  );

describe('HealthInsurance Component', () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('Health Insurance Shield')).toBeInTheDocument();
    expect(screen.getByText('Peace of mind that never expires, with every heartbeat')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Sum Insured')).toBeInTheDocument();
    expect(screen.getByLabelText('Critical Illness Cover')).toBeInTheDocument();
    expect(screen.getByLabelText('Maternity Cover')).toBeInTheDocument();
    expect(screen.getByLabelText('Daily Hospital Cash')).toBeInTheDocument();
    expect(screen.getByLabelText('Payment Frequency:')).toBeInTheDocument();
    expect(screen.getByText('Calculate Premium')).toBeInTheDocument();
    expect(screen.getByText('Buy')).toBeInTheDocument();
  });

  test('validates form correctly', async () => {
    window.alert = jest.fn();
    renderComponent();

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '17' } });
    fireEvent.change(screen.getByLabelText('Sum Insured'), { target: { value: '' } });

    fireEvent.click(screen.getByText('Calculate Premium'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please enter a valid age greater than 18.');
    });

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
    fireEvent.click(screen.getByText('Calculate Premium'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please select a sum insured amount.');
    });
  });

  test('calculates premium correctly', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Sum Insured'), { target: { value: '1000000' } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'urban' } });
    fireEvent.click(screen.getByText('Calculate Premium'));

    await waitFor(() => {
      expect(screen.getByText(/Calculated Premium: ₹/i)).toBeInTheDocument();
    });
  });

  test('handles form submission correctly', async () => {
    mock.onPost('http://localhost:8008/user-policies/create').reply(200, {
      data: '123456',
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Sum Insured'), { target: { value: '1000000' } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'urban' } });
    fireEvent.click(screen.getByText('Calculate Premium'));

    await waitFor(() => {
      expect(screen.getByText(/Calculated Premium: ₹/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Buy'));

    await waitFor(() => {
      expect(mockAppContext.setSuserPolicyId).toHaveBeenCalledWith('123456');
      expect(window.alert).toHaveBeenCalledWith('Data saved successfully!');
    });
  });

  test('handles error when saving data', async () => {
    window.alert = jest.fn();
    mock.onPost('http://localhost:8008/user-policies/create').reply(500);

    renderComponent();

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Sum Insured'), { target: { value: '1000000' } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'urban' } });
    fireEvent.click(screen.getByText('Calculate Premium'));

    await waitFor(() => {
      expect(screen.getByText(/Calculated Premium: ₹/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Buy'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error saving data:');
    });
  });
});

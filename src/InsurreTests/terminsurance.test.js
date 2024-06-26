import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import TermPolicyDetails from '../terminsurance';
import { AppContext } from '../AppContext';

jest.mock('axios');
global.alert = jest.fn();

const renderWithContext = (component) => {
  const contextValue = { suserId: '123', suserPolicyId: '456', setSuserPolicyId: jest.fn() };
  return render(
    <AppContext.Provider value={contextValue}>
      <MemoryRouter>{component}</MemoryRouter>
    </AppContext.Provider>
  );
};

describe('TermPolicyDetails', () => {
  test('renders the form and inputs correctly', () => {
    renderWithContext(<TermPolicyDetails />);

    expect(screen.getByText('Term Life Insurance Shield')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Term Period')).toBeInTheDocument();
    expect(screen.getByLabelText('Sum Assured')).toBeInTheDocument();
    expect(screen.getByText('Accidental Death')).toBeInTheDocument();
    expect(screen.getByText('Critical Illness')).toBeInTheDocument();
    expect(screen.getByText('Waiver Of Premium')).toBeInTheDocument();
    expect(screen.getByLabelText('Payment Frequency')).toBeInTheDocument();
  });

  test('validates form and shows alert for invalid age', () => {
    renderWithContext(<TermPolicyDetails />);

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '18' } });
    fireEvent.change(screen.getByLabelText('Term Period'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Sum Assured'), { target: { value: '1500000' } });
    fireEvent.change(screen.getByLabelText('Payment Frequency'), { target: { value: 'annually' } });

    fireEvent.click(screen.getByText('Calculate Premium'));

    expect(global.alert).toHaveBeenCalledWith('Please enter a valid age greater than 18.');
  });

  test('validates form and shows alert for missing term period', () => {
    renderWithContext(<TermPolicyDetails />);

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Sum Assured'), { target: { value: '1500000' } });
    fireEvent.change(screen.getByLabelText('Payment Frequency'), { target: { value: 'annually' } });

    fireEvent.click(screen.getByText('Calculate Premium'));

    expect(global.alert).toHaveBeenCalledWith('Please select a term period.');
  });

  test('calculates premium correctly', () => {
    renderWithContext(<TermPolicyDetails />);

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Term Period'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Sum Assured'), { target: { value: '1500000' } });
    fireEvent.change(screen.getByLabelText('Payment Frequency'), { target: { value: 'annually' } });

    fireEvent.click(screen.getByText('Calculate Premium'));

    expect(screen.getByText(/Heyoo!! Here is your calculated premium is/)).toBeInTheDocument();
  });

  test('handles form submission and saves data', async () => {
    axios.post.mockResolvedValue({ data: '456' });

    renderWithContext(<TermPolicyDetails />);

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Term Period'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Sum Assured'), { target: { value: '1500000' } });
    fireEvent.change(screen.getByLabelText('Payment Frequency'), { target: { value: 'annually' } });
    fireEvent.click(screen.getByText('Calculate Premium'));

    await waitFor(() => {
      expect(screen.getByText(/Heyoo!! Here is your calculated premium is/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Buy'));

    await waitFor(() => {
      expect(screen.getByText('Do you want to save the data?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Yes'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8008/user-policies/create',
      expect.objectContaining({
        coverage: 1500000,
        term: 10,
        premiumTerm: 'annually',
        premium: expect.any(String),
        policy: { policyId: 2 },
        user: { userId: '123' }
      })
    ));

    expect(global.alert).toHaveBeenCalledWith('Data saved successfully!');
  });

  test('displays error message on failed data save', async () => {
    axios.post.mockRejectedValue(new Error('Error saving data'));

    renderWithContext(<TermPolicyDetails />);

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Term Period'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Sum Assured'), { target: { value: '1500000' } });
    fireEvent.change(screen.getByLabelText('Payment Frequency'), { target: { value: 'annually' } });
    fireEvent.click(screen.getByText('Calculate Premium'));

    await waitFor(() => {
      expect(screen.getByText(/Heyoo!! Here is your calculated premium is/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Buy'));

    await waitFor(() => {
      expect(screen.getByText('Do you want to save the data?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Yes'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(global.alert).not.toHaveBeenCalledWith('Data saved successfully!');

  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContext } from '../AppContext';
import MyPolicies from '../mypolicy';

const mock = new axiosMock(axios);

const mockAppContext = {
  suserId: '12345',
  setSuserPolicyId: jest.fn(),
};

const renderComponent = () =>
  render(
    <AppContext.Provider value={mockAppContext}>
      <Router>
        <MyPolicies />
      </Router>
    </AppContext.Provider>
  );

describe('MyPolicies Component', () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  test('renders correctly', async () => {
    mock.onGet('http://localhost:8008/user-policies/user/12345').reply(200, [
      {
        userPolicyId: 1,
        policy: { policyType: 'Auto', policyName: 'Auto Policy' },
        status: 'active',
        premium: 1000,
      },
      {
        userPolicyId: 2,
        policy: { policyType: 'Health', policyName: 'Health Policy' },
        status: 'pending',
        premium: 2000,
      },
    ]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Active Policies')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search by status...')).toBeInTheDocument();
      expect(screen.getByText('Auto Insurance')).toBeInTheDocument();
      expect(screen.getByText('Health Insurance')).toBeInTheDocument();
    });
  });

  test('handles search correctly', async () => {
    mock.onGet('http://localhost:8008/user-policies/user/12345').reply(200, [
      {
        userPolicyId: 1,
        policy: { policyType: 'Auto', policyName: 'Auto Policy' },
        status: 'active',
        premium: 1000,
      },
      {
        userPolicyId: 2,
        policy: { policyType: 'Health', policyName: 'Health Policy' },
        status: 'pending',
        premium: 2000,
      },
    ]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Auto Insurance')).toBeInTheDocument();
      expect(screen.getByText('Health Insurance')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search by status...'), { target: { value: 'pending' } });

    await waitFor(() => {
      expect(screen.queryByText('Auto Insurance')).not.toBeInTheDocument();
      expect(screen.getByText('Health Insurance')).toBeInTheDocument();
    });
  });

  test('handles pagination correctly', async () => {
    const policies = Array.from({ length: 10 }, (_, i) => ({
      userPolicyId: i + 1,
      policy: { policyType: 'Type', policyName: `Policy ${i + 1}` },
      status: 'active',
      premium: 1000 * (i + 1),
    }));

    mock.onGet('http://localhost:8008/user-policies/user/12345').reply(200, policies);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Policy 1')).toBeInTheDocument();
      expect(screen.getByText('Policy 8')).toBeInTheDocument();
      expect(screen.queryByText('Policy 9')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('2'));

    await waitFor(() => {
      expect(screen.getByText('Policy 9')).toBeInTheDocument();
      expect(screen.getByText('Policy 10')).toBeInTheDocument();
      expect(screen.queryByText('Policy 1')).not.toBeInTheDocument();
    });
  });

  test('navigates to policy details on view click', async () => {
    mock.onGet('http://localhost:8008/user-policies/user/12345').reply(200, [
      {
        userPolicyId: 1,
        policy: { policyType: 'Auto', policyName: 'Auto Policy' },
        status: 'active',
        premium: 1000,
      },
    ]);

    const { history } = renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Auto Insurance')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('view'));

    await waitFor(() => {
      expect(history.location.pathname).toBe('/policydetails');
    });
  });

  test('navigates to payment on pay click', async () => {
    mock.onGet('http://localhost:8008/user-policies/user/12345').reply(200, [
      {
        userPolicyId: 1,
        policy: { policyType: 'Auto', policyName: 'Auto Policy' },
        status: 'active',
        premium: 1000,
      },
    ]);

    const { history } = renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Auto Insurance')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Pay Premium'));

    await waitFor(() => {
      expect(history.location.pathname).toBe('/payment');
    });
  });

  test('handles error when fetching policies', async () => {
    window.alert = jest.fn();
    mock.onGet('http://localhost:8008/user-policies/user/12345').reply(500);

    renderComponent();

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Error fetching policies:');
    });
  });
});

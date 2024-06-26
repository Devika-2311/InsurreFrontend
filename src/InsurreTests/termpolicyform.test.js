import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import TermPolicyForm from '../termpolicyform';
import { AppContext } from '../AppContext';

jest.mock('axios');
global.alert = jest.fn();

const renderWithContext = (component) => {
  const contextValue = { suserPolicyId: '12345' };
  return render(
    <AppContext.Provider value={contextValue}>
      <MemoryRouter>{component}</MemoryRouter>
    </AppContext.Provider>
  );
};

describe('TermPolicyForm', () => {
  test('renders the form and inputs correctly', () => {
    renderWithContext(<TermPolicyForm />);

    expect(screen.getByText('Term Insurance')).toBeInTheDocument();
    expect(screen.getByText('Annual Income')).toBeInTheDocument();
    expect(screen.getByLabelText('Annual Income')).toBeInTheDocument();
    expect(screen.getByLabelText('Any Disease')).toBeInTheDocument();
    expect(screen.getByLabelText('Nominee Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Nominee Relation')).toBeInTheDocument();
    expect(screen.getByLabelText('Nominee Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Nominee Proof [Upload Pdf]')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('validates annual income and prevents form submission if invalid', () => {
    renderWithContext(<TermPolicyForm />);

    const input = screen.getByLabelText('Annual Income');
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(screen.getByText('Submit'));

    expect(global.alert).toHaveBeenCalledWith('Annual income must end with three zeroes and start with a non-zero digit.');
  });

  test('handles form submission correctly with valid data', async () => {
    axios.post.mockResolvedValue({ data: 'Policy document created successfully!' });

    renderWithContext(<TermPolicyForm />);

    fireEvent.change(screen.getByLabelText('Annual Income'), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText('Nominee Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Nominee Relation'), { target: { value: 'Brother' } });
    fireEvent.change(screen.getByLabelText('Nominee Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Nominee Proof [Upload Pdf]'), {
      target: { files: [new File(['proof'], 'proof.pdf', { type: 'application/pdf' })] }
    });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8008/policy-documents/create/term',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ));
  });

  test('displays success message after successful form submission', async () => {
    axios.post.mockResolvedValue({ data: 'Policy document created successfully!' });

    renderWithContext(<TermPolicyForm />);

    fireEvent.change(screen.getByLabelText('Annual Income'), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText('Nominee Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Nominee Relation'), { target: { value: 'Brother' } });
    fireEvent.change(screen.getByLabelText('Nominee Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Nominee Proof [Upload Pdf]'), {
      target: { files: [new File(['proof'], 'proof.pdf', { type: 'application/pdf' })] }
    });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(screen.getByText('Policy document created successfully!')).toBeInTheDocument());
  });

  test('displays error message after failed form submission', async () => {
    axios.post.mockRejectedValue(new Error('Error creating policy document'));

    renderWithContext(<TermPolicyForm />);

    fireEvent.change(screen.getByLabelText('Annual Income'), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText('Nominee Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Nominee Relation'), { target: { value: 'Brother' } });
    fireEvent.change(screen.getByLabelText('Nominee Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Nominee Proof [Upload Pdf]'), {
      target: { files: [new File(['proof'], 'proof.pdf', { type: 'application/pdf' })] }
    });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(screen.getByText('Error creating policy document.')).toBeInTheDocument());
  });
});

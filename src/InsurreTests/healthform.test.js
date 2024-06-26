import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import { AppContext } from '../AppContext';
import HealthPolicyForm from '../healthform';

const mock = new MockAdapter(axios);

describe('HealthPolicyForm component', () => {
  const contextValue = { suserPolicyId: 123 };

  beforeAll(() => {
    window.alert = jest.fn();
  });

  beforeEach(() => {
    mock.reset();
  });

  test('renders HealthPolicyForm component with all form fields', () => {
    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <HealthPolicyForm />
        </MemoryRouter>
      </AppContext.Provider>
    );

    expect(screen.getByText('Health Policy Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Weight(kg)')).toBeInTheDocument();
    expect(screen.getByLabelText('Height(Inch)')).toBeInTheDocument();
    expect(screen.getByLabelText('Do you Smoke?')).toBeInTheDocument();
    expect(screen.getByLabelText('Do you consume alcohol?')).toBeInTheDocument();
    expect(screen.getByLabelText('Do you have high B.P?')).toBeInTheDocument();
    expect(screen.getByLabelText('Do you have high diabetes?')).toBeInTheDocument();
    expect(screen.getByLabelText('Any other critical illness?')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload Health Report [Upload PDF]')).toBeInTheDocument();
  });

  test('validates form inputs and shows error messages', async () => {
    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <HealthPolicyForm />
        </MemoryRouter>
      </AppContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '17' } });
    fireEvent.change(screen.getByLabelText('Weight(kg)'), { target: { value: '75' } });
    fireEvent.change(screen.getByLabelText('Height(Inch)'), { target: { value: '68' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please enter a valid age greater than 18.');
    });
  });

  test('handles form submission and shows success message', async () => {
    const mockResponse = { data: 'Policy document created successfully!' };
    mock.onPost('http://localhost:8008/policy-documents/create/health').reply(200, mockResponse);

    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <HealthPolicyForm />
        </MemoryRouter>
      </AppContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Weight(kg)'), { target: { value: '75' } });
    fireEvent.change(screen.getByLabelText('Height(Inch)'), { target: { value: '68' } });

    const file = new File(['health report content'], 'healthreport.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('Upload Health Report [Upload PDF]'), { target: { files: [file] } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Policy document created successfully!')).toBeInTheDocument();
    });
  });

  test('handles form submission and shows error message on failure', async () => {
    mock.onPost('http://localhost:8008/policy-documents/create/health').reply(500);

    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <HealthPolicyForm />
        </MemoryRouter>
      </AppContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Weight(kg)'), { target: { value: '75' } });
    fireEvent.change(screen.getByLabelText('Height(Inch)'), { target: { value: '68' } });

    const file = new File(['health report content'], 'healthreport.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('Upload Health Report [Upload PDF]'), { target: { files: [file] } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Error creating policy document.')).toBeInTheDocument();
    });
  });

  test('handles file upload correctly', () => {
    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <HealthPolicyForm />
        </MemoryRouter>
      </AppContext.Provider>
    );

    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText('Upload Health Report [Upload PDF]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files[0]).toStrictEqual(file);
  });

  test('displays response message when health report is not uploaded', async () => {
    render(
      <AppContext.Provider value={contextValue}>
        <MemoryRouter>
          <HealthPolicyForm />
        </MemoryRouter>
      </AppContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Weight(kg)'), { target: { value: '75' } });
    fireEvent.change(screen.getByLabelText('Height(Inch)'), { target: { value: '68' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Please upload the health report.')).toBeInTheDocument();
    });
  });
});

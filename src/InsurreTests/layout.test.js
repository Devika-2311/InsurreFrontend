import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../layout';

describe('Layout Component', () => {
    test('renders Navbar1', () => {
        render(<Layout />, { wrapper: MemoryRouter });
    
        expect(screen.getByRole('navigation')).toBeInTheDocument();
      });
    
  test('renders child components based on current route', () => {
    render(
      <MemoryRouter initialEntries={['/mypolicies']}>
        <Layout />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

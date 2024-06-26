import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar1 from '../navbar1';

describe('Navbar1 component', () => {
  test('renders Navbar1 component with logo and links', () => {
    render(
      <MemoryRouter>
        <Navbar1 />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');

    const usernameLink = screen.getByRole('link', { name: 'Username' });
    expect(usernameLink).toBeInTheDocument();
    expect(usernameLink).toHaveAttribute('href', '/');

   

    const viewTicketsLink = screen.getByRole('link', { name: 'view Tickets' });
    expect(viewTicketsLink).toBeInTheDocument();
    expect(viewTicketsLink).toHaveAttribute('href', '#');

    const raiseTicketLink = screen.getByRole('link', { name: 'Raise Ticket' });
    expect(raiseTicketLink).toBeInTheDocument();
    expect(raiseTicketLink).toHaveAttribute('href', '#');

    const logoutLink = screen.getByRole('link', { name: 'logout' });
    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink).toHaveAttribute('href', '#');
  });

  test('renders child components based on current route', () => {
    render(
      <MemoryRouter initialEntries={['/mypolicies']}>
        <Navbar1 />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

 
});

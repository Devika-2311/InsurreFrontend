import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Section2 from '../section2';


jest.mock('../section1', () => () => <div>Section1 Mock</div>);

describe('Section2', () => {
  test('renders Section1 component', () => {
    render(
      <MemoryRouter>
        <Section2 />
      </MemoryRouter>
    );
    expect(screen.getByText('Section1 Mock')).toBeInTheDocument();
  });

  
  test('renders footer text correctly', () => {
    render(
      <MemoryRouter>
        <Section2 />
      </MemoryRouter>
    );

    expect(screen.getByText('Modern Solutions for')).toBeInTheDocument();
    expect(screen.getByText('modern lives')).toBeInTheDocument();
  });
  test('renders images with correct alt text', () => {
    render(
      <MemoryRouter>
        <Section2 />
      </MemoryRouter>
    );

    expect(screen.getByAltText('insurance')).toBeInTheDocument();
    expect(screen.getByAltText('autoinsurance')).toBeInTheDocument();
    expect(screen.getByAltText('healthinsurance')).toBeInTheDocument();
    expect(screen.getByAltText('terminsurance')).toBeInTheDocument();
  });

  test('navigates to /autoinsurance when auto insurance card is clicked', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Section2 />} />
          <Route path="/autoinsurance" element={<div>Auto Insurance Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(container.querySelector('.card-1'));

    expect(screen.getByText('Auto Insurance Page')).toBeInTheDocument();
  });

  test('navigates to /healthinsurance when health insurance card is clicked', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Section2 />} />
          <Route path="/healthinsurance" element={<div>Health Insurance Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(container.querySelector('.card-2'));

    expect(screen.getByText('Health Insurance Page')).toBeInTheDocument();
  });

  test('navigates to /terminsurance when term insurance card is clicked', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Section2 />} />
          <Route path="/terminsurance" element={<div>Term Insurance Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(container.querySelector('.card-3'));

    expect(screen.getByText('Term Insurance Page')).toBeInTheDocument();
  });
});

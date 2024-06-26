
import React from 'react';
import { render, screen } from '@testing-library/react';
import Section1 from '../section1'; 

describe('Section1 Component', () => {
  test('renders text content correctly', () => {
    render(<Section1 />);
    
    expect(screen.getByText(/Protect Everything you love now!/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Comprehensive Auto,Life, and Health Insurance with Life Guard./i)).toBeInTheDocument();
  });

  test('renders a button with class "get-started"', () => {
    render(<Section1 />);
    
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
  });

  test('renders an image with alt text "family-images"', () => {
    render(<Section1 />);
    
    expect(screen.getByAltText('family-images')).toBeInTheDocument();
  });
});

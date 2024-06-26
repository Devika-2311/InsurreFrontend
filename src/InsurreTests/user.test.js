import React from 'react';
import { render, screen } from '@testing-library/react';
import UserLogin from '../user';
 


jest.mock('../login', () => {
    return function DummyLoginComponent(props) {
        return (
            <div data-testid="login-component">
                <p>{props.welcomsmsg}</p>
                <img src={props.imageUrl} alt="login" />
                <p>{props.role}</p>
            </div>
        );
    };
});

afterEach(() => {
    jest.clearAllMocks(); 
    jest.resetModules();  
});

test('renders UserLogin component with the correct props', async () => {
    render(<UserLogin />);
    
    expect(screen.getByText("Welcome back User")).toBeInTheDocument();
    expect(screen.getByAltText("login")).toBeInTheDocument();
    expect(screen.getByText("user")).toBeInTheDocument();
});

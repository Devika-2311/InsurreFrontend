// App.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
import Section2 from '../section2';
import AutoInsurance from '../autoinsurance';
import TermInsurance from '../terminsurance';
import HealthInsurance from '../healthinsurance';
import HealthPolicyForm from '../healthform';
import AutoPolicyForm from '../autoform';
import TermPolicyForm from '../termpolicyform';
import MyPolicies from '../mypolicy';
import Layout from '../layout';
import { AppProvider } from '../AppContext';

describe('App', () => {
  beforeEach(() => {
    render(
      <AppProvider>
        <Router>
          <App />
        </Router>
      </AppProvider>
    );
  });

  it('should render UserLogin component for the default route', () => {
    expect(screen.getByPlaceholderText('Type your Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your password')).toBeInTheDocument();
  });

  it('should render Layout and nested routes correctly', () => {
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Policy')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Buy Request')).toBeInTheDocument();
    expect(screen.getByText('Claim Request')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should render Section2 component when navigating to /section2', () => {
    window.history.pushState({}, 'Section 2', '/section2');
    render(
      <Router>
        <Section2 />
      </Router>
    );
    expect(screen.getByText('Section 2 Content')).toBeInTheDocument();
  });


  it('should render AutoInsurance component when navigating to /autoinsurance', () => {
    window.history.pushState({}, 'Auto Insurance', '/autoinsurance');
    render(
      <Router>
        <AutoInsurance />
      </Router>
    );
    expect(screen.getByText('Auto Insurance')).toBeInTheDocument(); 
  });



  it('should render TermPolicyForm component when navigating to /term-policy-form', () => {
    window.history.pushState({}, 'Term Policy Form', '/term-policy-form');
    render(
      <Router>
        <TermPolicyForm />
      </Router>
    );
    expect(screen.getByText('Term Policy Form')).toBeInTheDocument(); 
  });


  it('should render MyPolicies component when navigating to /mypolicies', () => {
    window.history.pushState({}, 'My Policies', '/mypolicies');
    render(
      <Router>
        <MyPolicies />
      </Router>
    );
    expect(screen.getByText('My Policies')).toBeInTheDocument(); 
  });
});

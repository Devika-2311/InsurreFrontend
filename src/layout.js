
import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar1 from './navbar1';

const Layout = () => {
  return (
    <div>
      <Navbar1 data-testid="navbar1" />
      <Outlet /> 
    </div>
  );
};

export default Layout;

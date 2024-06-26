import React from 'react';
import { Link } from 'react-router-dom';
import './navbar1.css';
import logo from '../src/images/logosfolder/applogo.png';

function Navbar1() {
  return (
    <nav className="navbar">
      <div>
        <div  className="navbar-logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="logo-name">Insurre</h1>
        </div>
      </div>
      <div>
        <ul className="navbar-links">
        <li className="navbar-item"><Link to="/section2">Home</Link></li>
        <li className="navbar-item"><Link to="#">Username</Link></li> 
        <li className="navbar-item"><Link to="/mypolicies">mypolicies</Link></li>
        <li className="navbar-item"><Link to="#">view Tickets</Link></li>
        <li className="navbar-item"><Link to="#">Raise Ticket</Link></li>
        <li className="navbar-item"><Link to="#">logout</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar1;

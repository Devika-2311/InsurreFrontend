import React from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './section2.css';
import insurance2 from '../src/images/userimages/landingsection.png';
import autoinsurance from '../src/images/userimages/autoinsurance.png';
import healthinsurance from '../src/images/userimages/healthinsurance.png';
import terminsurance from '../src/images/userimages/lifeinsurance.png';
import Section1 from './section1';

function Section2() {
  const navigate = useNavigate();
  const location = useLocation();
 

  const navigateToComponent = (path) => {
    navigate(path);
  };

  return (
    <div>
      <Section1 />
      <div className="footer">
        <p className='text-1'>
          <span style={{ fontWeight: 'bold' }}>Modern Solutions for</span> modern lives
        </p>
        <img src={insurance2} alt='insurance' className='insurance2' />
        
        <button className="card-1" onClick={() => navigateToComponent('/autoinsurance')}>
          <img src={autoinsurance} alt='autoinsurance' className='autoimage' />
          <p className='autotext'>Drive Worry-Free: Your Auto Insurance Solution Starts Here!</p>
        </button>
        
        <button className="card-2" onClick={() => navigateToComponent('/healthinsurance')}>
          <img src={healthinsurance} alt='healthinsurance' className='healthimage' />
          <p className='healthtext'>Thriving Starts Here: Your Health Insurance Solution for a Brighter Tomorrow!</p>
        </button>
        
        <button className="card-3" onClick={() => navigateToComponent('/terminsurance')}>
          <img src={terminsurance} alt='terminsurance' className='termimage' />
          <p className='termtext'>Life’s Safeguard: Your Journey to Financial Security Begins Here!</p>
        </button>
      </div>
    </div>
  );
}

export default Section2;

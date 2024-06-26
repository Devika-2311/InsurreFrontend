import React from 'react';
 
import './section1.css';
import family from '../src/images/userimages/landingsection1.png';

function Section1() {
    return (
        <div className='mid'>
         <p className="text-m">Protect Everything you love now!</p>
         <p className="text-l">Get Comprehensive Auto,Life, and
Health Insurance with Life Guard.</p>
<button className="get-started">Get Started</button>
<img src={family} alt='family-images' className='family'/>
 
        </div>
       
      );
}
 
export default Section1;
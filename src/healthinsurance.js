import React, { useState, useContext } from 'react';
import './healthinsurance.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from './AppContext';

const HealthInsurance = () => {
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('urban');
  const [sumInsured, setSumInsured] = useState('1000000');
  const [criticalIllnessCover, setCriticalIllnessCover] = useState(false);
  const [maternityCover, setMaternityCover] = useState(false);
  const [dailyHospitalCash, setDailyHospitalCash] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState('annually');
  const [premiumResult, setPremiumResult] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { suserId, setSuserPolicyId } = useContext(AppContext);

  const navigate = useNavigate();

  const handleBuyNowClick = () => {
    navigate('/health-policy-form');
  };
  const validateForm=()=>{if (parseInt(age) <= 18) {
    alert('Please enter a valid age greater than 18.');
    return false;
  }

  if (sumInsured === '') {
    alert('Please select a sum insured amount.');
    return false;
  }

  if (paymentFrequency === '') {
    alert('Please select a payment frequency.');
    return false;
  }

  return true;
}

  const calculatePremium = () => {
    if (!validateForm()) return;
    const sumInsuredValue = parseFloat(sumInsured);
    const ageValue = parseInt(age);

    

    const baseRate = getBaseRate(ageValue);
    const basePremium = sumInsuredValue * baseRate;
    const ageFactor = ageValue > 45 ? 0.2 : 0.1;
    const locationFactor = location === 'urban' ? 0.1 : 0.05;

    let adjustedPremium =
      basePremium + basePremium * ageFactor + basePremium * locationFactor;

    if (criticalIllnessCover) adjustedPremium += 3000;
    if (maternityCover) adjustedPremium += 2000;
    if (dailyHospitalCash) adjustedPremium += 500;
    let frequencyMultiplier;
    switch (paymentFrequency) {
      case 'annually':
        frequencyMultiplier = 1;
        break;
      case 'half-yearly':
        frequencyMultiplier = 1 / 2;
        break;
      case 'quarterly':
        frequencyMultiplier = 1 / 4;
        break;
      case 'monthly':
        frequencyMultiplier = 1 / 12;
        break;
    }
    const finalPremium = adjustedPremium * frequencyMultiplier;

    setPremiumResult(finalPremium.toFixed(2));

    setPremiumResult(adjustedPremium.toFixed(2));
   
  };

  const getBaseRate = (age) => {
    if (age <= 30) return 0.007;
    else if (age <= 45) return 0.012;
    else if (age <= 60) return 0.02;
    else return 0.025;
  };

  

  const handleSave = () => {
    if (!validateForm()) return;
    const currentDate = new Date();
    const formattedStartDate = currentDate.toISOString();

    const StartDate = new Date(formattedStartDate);
    const endDate = new Date(StartDate);
    endDate.setFullYear(StartDate.getFullYear() + 1);

    const dataToSave = {
      coverage: parseFloat(sumInsured),
      term: 1,
      premiumTerm: paymentFrequency,
      premium: premiumResult,
      premiumCount: 0,
      startDate: StartDate,
      endDate: endDate,
      status: 'pending',
      leftcoverage: 0,
      policy: { policyId: 3 },
      user: { userId: suserId },
    };

    axios
      .post('http://localhost:8008/user-policies/create', dataToSave)
      .then((response) => {
        setSuserPolicyId(response.data);
        setShowModal(false);
    
      })
      .catch((error) => {
        console.error('Error saving data:', error.response?.data || error.message);
      });
  };
  const handleSubmit = (event) => {
    
    event.preventDefault(); 

    if (validateForm()) {
      setShowModal(true); 
    }
  };
  const handleSaveAndBuy = () => {
    handleSave();
    handleBuyNowClick();
  };

  return (
    <div className='healthinsurancepage'>
  
    <div className="main">
      <div className="health-policy-page">
        <div className="health-policy-container">
          <div className="policy-info">
            <h2>Health Insurance Shield</h2>
            <p className="subtitle">Peace of mind that never expires, with every heartbeat</p>
            <p>
              It helps cover the cost of medical and surgical expenses. It provides financial protection against unexpected healthcare costs and promotes access to preventive care.
            </p>
            <div className="badges">
              <div className="badge">Trending</div>
              <div className="badge">Tax Saver</div>
            </div>
            <h3>Terms and Conditions:</h3>
            <ul>
              <li>Term Period: Typically choose up the period to secure your life (vary based on policy).</li>
              <li>Coverage: Comprehensive coverage including hospitalization, surgery, prescription, and more.</li>
              <li>Premium: Determined based on factors such as age, health conditions, location cost, and Optional Riders.</li>
              <li>Renewals: Renew your policy towards the end of term life for continued protection and peace of mind.</li>
            </ul>
            <h3>Optional Riders:</h3>
            <ul>
              <li>Critical Illness Cover (₹3000)</li>
              <li>Maternity Cover (₹2000)</li>
              <li>Daily Hospital Cash (₹500)</li>
            </ul>
            <p>To buy the insurance calculate the premium, click on buy and submit the respective documents</p>
          </div>
          <div className="premium-calculator">
          <div className='astyles'>
            <h2 className="calculator-title">Premium Calculator</h2>
            <form className="form-main" onSubmit={handleSubmit} >
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  className="form-control"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <select
                  className="form-control"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                >
                  <option value="urban">Urban</option>
                  <option value="rural">Rural</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="sumInsured">Sum Insured</label>
                <select
                  className="form-control"
                  id="sumInsured"
                  value={sumInsured}
                  onChange={(e) => setSumInsured(e.target.value)}
                  required
                >
                  <option value="1000000">₹10,00,000</option>
                  <option value="2500000">₹25,00,000</option>
                  <option value="5000000">₹50,00,000</option>
                </select>
              </div>
              <div className="form-group">
                <label>Optional Riders</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="criticalIllnessCover"
                    checked={criticalIllnessCover}
                    onChange={() => setCriticalIllnessCover(!criticalIllnessCover)}
                  />
                  <label className="form-check-label" htmlFor="criticalIllnessCover">
                    Critical Illness Cover
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="maternityCover"
                    checked={maternityCover}
                    onChange={() => setMaternityCover(!maternityCover)}
                  />
                  <label className="form-check-label" htmlFor="maternityCover">
                    Maternity Cover
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="dailyHospitalCash"
                    checked={dailyHospitalCash}
                    onChange={() => setDailyHospitalCash(!dailyHospitalCash)}
                  />
                  <label className="form-check-label" htmlFor="dailyHospitalCash">
                    Daily Hospital Cash
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="paymentFrequency">Payment Frequency:</label>
                <select
                  className="form-control"
                  id="paymentFrequency"
                  value={paymentFrequency}
                  onChange={(e) => setPaymentFrequency(e.target.value)}
                >
                  <option value="annually">Annually</option>
                  <option value="half-yearly">Half-Yearly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              {premiumResult && (
                <div className="result-text">
                  Calculated Premium: ₹{premiumResult}
                </div>
              )}
              <div className="button-group">
                <button
                  type="button"
                  className="calculate-button"
                  onClick={calculatePremium}
                >
                  Calculate Premium
                </button>
                <button
                  type="submit"
                  className="save-button"
                 
                  disabled={!premiumResult}
                >
                  Buy
                </button>
              </div>
              
            </form>
            </div>
          </div>
        </div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Calculated Premium: ₹{premiumResult}</h3>
              <p>Do you want to save the data?</p>
              <div className="modal-buttons">
                <button onClick={handleSaveAndBuy} className="btn btn-success">
                  Yes
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-danger"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default HealthInsurance;

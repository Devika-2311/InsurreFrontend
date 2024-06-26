
import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import './autoinsurance.css';
import axios from 'axios';
import { AppContext } from './AppContext';

function AutoInsurance() {
  const [vehicleValue, setVehicleValue] = useState('');
  const [coverageType, setCoverageType] = useState('BASIC');
  const [vehicleAge, setVehicleAge] = useState('');
  const [primaryUse, setPrimaryUse] = useState('');
  const [roadsideAssistance, setRoadsideAssistance] = useState(false);
  const [zeroDepreciation, setZeroDepreciation] = useState(false);
  const [engineProtection, setEngineProtection] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState('annually');
  const [premiumResult, setPremiumResult] = useState('');
  const [idvResult, setIDVResult] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { suserId, setSuserPolicyId } = useContext(AppContext);
  const navigate = useNavigate();

  const handleBuyNowClick = () => {
    navigate('/auto-policy-form');
  };

  const validateForm = () => {

    if (!vehicleValue || parseInt(vehicleValue) <= 30000 || vehicleValue % 100 !== 0) {
      alert('Vehicle value must be greater than ₹30,000 and end in "00".');
      return false;
    }

    if (!vehicleAge || parseInt(vehicleAge) >= 50) {
      alert('Vehicle age must be less than 50 years.');
      return false;
    }

    if (!paymentFrequency) {
      alert('Please select a payment frequency.');
      return false;
    }

    return true;
  };

  const calculatePremium = () => {
    if (!validateForm()) return; 

    let primaryUses = primaryUse;
    
    let basePremium;

    switch (coverageType) {
      case 'BASIC':
        basePremium = 5000;
        break;
      case 'STANDARD':
        basePremium = 15000;
        break;
      default:
        basePremium = 25000;
        break;
    }
    let UseFactor = (primaryUses === 'commercial') ? 0.15 : 0.05;
    let adjustedPremium = basePremium + (basePremium * UseFactor);

    if (roadsideAssistance) adjustedPremium += 2000;
    if (zeroDepreciation) adjustedPremium += 3000;
    if (engineProtection) adjustedPremium += 1000;

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
  };

  const calculateIDV = () => {
    if (!validateForm()) return; 

    let exShowroomPrice = parseFloat(vehicleValue);
    let vehicleAgeValue = parseInt(vehicleAge);

    let depreciationRate = 0.50;

    if (vehicleAgeValue <= 0.5) {
      depreciationRate = 0.05;
    } else if (vehicleAgeValue <= 1) {
      depreciationRate = 0.15;
    } else if (vehicleAgeValue <= 2) {
      depreciationRate = 0.20;
    } else if (vehicleAgeValue <= 3) {
      depreciationRate = 0.30;
    } else if (vehicleAgeValue <= 4) {
      depreciationRate = 0.40;
    }

    let idv = exShowroomPrice * (1 - depreciationRate);

    setIDVResult(idv.toFixed(2));
  };

  const handleSave = async () => {
    if (!validateForm()) return; 

    const currentDate = new Date();
    const formattedStartDate = currentDate.toISOString();
    const StartDate = new Date(formattedStartDate);
    const endDate = new Date(StartDate);
    endDate.setFullYear(StartDate.getFullYear() + 1);

    const dataToSave = {
      coverage: idvResult,
      term: 1,
      premiumTerm: paymentFrequency,
      premium: premiumResult,
      premiumCount: 0,
      startDate: StartDate,
      endDate: endDate,
      status: "pending",
      leftcoverage: 0,
      policy: { policyId: 1 },
      user: { userId: suserId },
    };

    try {
      const response = await axios.post('http://localhost:8008/user-policies/create', dataToSave);
      setSuserPolicyId(response.data);
      setShowModal(false);
   
    } catch (error) {
      console.error('Error saving data:', error.response?.data || error.message);
    
    }
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
    <div className="autoinsurancepage">
   
      <div className="auto-policy-page">
        <div className="auto-policy-container">
          <div className="policy-info">
            <h2>Auto Insurance Shield</h2>
            <p className="subtitle">Shielding your journey with reliable coverage</p>
            <p>It provides financial protection against physical damage or bodily injury resulting from traffic collisions and against liability that could also arise from incidents in a vehicle.</p>
            <div className="badges">
              <div className="badge">Trending</div>
              <div className="badge">Tax Saver</div>
            </div>
            <h3>Terms and Conditions:</h3>
            <ul>
              <li>Term Period: Typically choose up the period to shield your vehicle (vary based on policy).</li>
              <li>Coverage: Comprehensive coverage including damage to the insured vehicle, liability for bodily injury or property damage and more.</li>
              <li>Premium: Determined based on factors such as the type of vehicle, vehicle cost, driver's age, driving record, coverage limits, and Optional Riders.</li>
              <li>Renewals: Renew your policy towards the end of term life for continued protection and peace of mind.</li>
            </ul>
            <h3>Optional Riders:</h3>
            <ul>
              <li>Roadside Assistance</li>
              <li>Zero Depreciation Cover</li>
              <li>Engine Protection</li>
            </ul>
            <p>To buy the insurance calculate the premium, click on buy and submit the respective documents.</p>
          </div>
          <div className="premium-calculator">
            <h2 className="calculator-title">Premium Calculator</h2>
            <form className="form-main" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="vehicleValue">Vehicle Value (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  id="vehicleValue"
                  value={vehicleValue}
                  onChange={(e) => setVehicleValue(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="coverageType">Coverage Type</label>
                <select
                  className="form-control"
                  id="coverageType"
                  value={coverageType}
                  onChange={(e) => setCoverageType(e.target.value)}
                  required
                >
                  <option value="BASIC">Basic</option>
                  <option value="STANDARD">Standard</option>
                  <option value="COMPREHENSIVE">Comprehensive</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="vehicleAge">Vehicle Age</label>
                <input
                  type="number"
                  className="form-control"
                  id="vehicleAge"
                  value={vehicleAge}
                  onChange={(e) => setVehicleAge(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="primaryUse">Primary Use</label>
                <select
                  className="form-control"
                  id="primaryUse"
                  value={primaryUse}
                  onChange={(e) => setPrimaryUse(e.target.value)}
                  required
                >
                  <option value="personal">Personal</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="optionalRiders">Optional Riders</label>
                <div className="form-check-div">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="roadsideAssistance"
                    checked={roadsideAssistance}
                    onChange={(e) => setRoadsideAssistance(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="roadsideAssistance">
                    Roadside Assistance
                  </label>
                </div>
                <div className="form-check-1">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="zeroDepreciation"
                    checked={zeroDepreciation}
                    onChange={(e) => setZeroDepreciation(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="zeroDepreciation">
                    Zero Depreciation
                  </label>
                </div>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="engineProtection"
                    checked={engineProtection}
                    onChange={(e) => setEngineProtection(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="engineProtection">
                    Engine Protection
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
                <div className="premium-result">
                   Calculated premium: ₹{premiumResult}
            
                  Your Insurance Declared Value (IDV): ₹{idvResult}
                  
                  
                </div>
              )}
              <div className="button-group">
                <button type="button" className="calculate-button" onClick={() => { calculatePremium(); calculateIDV(); }}>
                  Calculate Premium
                </button>
                <button type="submit" className="save-button" disabled={!premiumResult}>
                  Buy Now
                </button>
              </div>
              
            </form>
        </div>
      </div>
     
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Calculated Premium: ₹{premiumResult}</h3>
            <p>Do you want to buy the insurance?</p>
            <div className="modal-buttons">
              <button onClick={handleSaveAndBuy} className="btn btn-success">
                Yes
              </button>
              <button onClick={() => setShowModal(false)} className="btn btn-danger">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default AutoInsurance;

import React, { useState,useContext } from 'react';
import './terminsurance.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from './AppContext';

const TermPolicyDetails = () => {
  const [age, setAge] = useState('');
  const [termPeriod, setTermPeriod] = useState('');
  const [sumAssured, setSumAssured] = useState('');
  const [occupation, setOccupation] = useState('normal');
  const [accidentalDeath, setAccidentalDeath] = useState(false);
  const [criticalIllness, setCriticalIllness] = useState(false);
  const [waiverOfPremium, setWaiverOfPremium] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState('');
  const [premiumResult, setPremiumResult] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { suserId, suserPolicyId, setSuserPolicyId } = useContext(AppContext);
  const navigate = useNavigate();
  console.log(suserId);
 
    const handleBuyNowClick = () => {
      navigate('/term-policy-form');
    };
    const validateForm=()=>{
   
    if (parseInt(age) <= 18) {
      alert('Please enter a valid age greater than 18.');
      return false;
    }
  
    if (termPeriod === '') {
      alert('Please select a term period.');
      return false;
    }
   
    if (sumAssured === '') {
      alert('Please select a sum assured amount.');
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
    const sumAssuredValue = parseFloat(sumAssured);
    const baseRate = 0.001;
    const ageValue = parseInt(age);
    const smoker = false; 
    const occupationFactor = occupation === 'high' ? 0.15 : 0.05;
 
    const basePremium = sumAssuredValue * baseRate;
    const ageFactor = ageValue > 45 ? 0.25 : 0.10;
    const healthFactor = smoker ? 0.20 : 0.10;
 
    let adjustedPremium = basePremium + (basePremium * ageFactor) + (basePremium * healthFactor) + (basePremium * occupationFactor);
 
    if (accidentalDeath) adjustedPremium += 2000;
    if (criticalIllness) adjustedPremium += 3000;
    if (waiverOfPremium) adjustedPremium += 1000;
 
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
 
  const handleSave = () => {if (!validateForm()) return;
    const currentDate = new Date();
    const formattedStartDate = currentDate.toISOString();
    
   
    const StartDate = new Date(formattedStartDate);
    
   
    const endDate = new Date(StartDate);
    endDate.setFullYear(StartDate.getFullYear() +  parseInt(document.getElementById('termPeriod').value));
    const dataToSave = {
      coverage: parseFloat(document.getElementById('sumAssured').value),
      term: parseInt(document.getElementById('termPeriod').value),
      premiumTerm: document.getElementById('paymentFrequency').value,
      premium: premiumResult,
      premiumCount: 0,
      startDate:StartDate,
      endDate:endDate,
      status: "pending",
      leftcoverage:0,
      policy: { policyId: 2 },
      user:{userId:suserId},
    };
    console.log(suserId);

    axios.post('http://localhost:8008/user-policies/create', dataToSave)
      .then(response => {
        setSuserPolicyId(response.data);
        console.log(suserPolicyId);
        console.log('Data saved successfully:', response.data);
        
      })
      .catch(error => {
        console.error('Error saving data:', error);
      });
    setShowModal(false);
    alert("Data saved successfully!");
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
    <div className='termbody1'>

    <div className="term-policy-page">
      <div className="term-policy-container">
        <div className="term-policy-info">
          <h2>Term Life Insurance Shield</h2>
          <p className="subtitle">Security that lasts a lifetime, for the ones you cherish</p>
          <p>
            It provides coverage for a specific term and pays a benefit in the event of the insured's death during that term.
            It is designed to provide financial protection for your loved ones.
          </p>
          <div className="badges">
            <div className="badge">Trending</div>
            <div className="badge">Tax Saver</div>
          </div>
          <h3>Terms and Conditions:</h3>
          <ul>
            <li>Term Period: Typically choose up the period to secure your loved ones after your demise.</li>
            <li>Coverage: Death benefit paid to beneficiaries if the insured dies during the term.</li>
            <li>Premium: Determined based on factors such as age, health conditions, term period, and Optional Riders.</li>
            <li>Renewals: Renew your policy towards the end of term life for continued protection and peace of mind.</li>
          </ul>
          <h3>Optional Riders:</h3>
          <ul>
            <li>Accidental Death Benefit</li>
            <li>Critical Illness Rider</li>
            <li>Waiver Of Premium</li>
          </ul>
          <p>To buy the insurance calculate the premium , click on buy and submit the respective documents </p>
        </div>
        <div className="term-premium-calculator">
          <h2 className="calculator-title">Premium Calculator</h2>
          <form className='form-main'  onSubmit={handleSubmit}>
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
              <label htmlFor="termPeriod">Term Period</label>
              <select
                className="form-control"
                id="termPeriod"
                value={termPeriod}
                onChange={(e) => setTermPeriod(e.target.value)}
                required
              >
            <option value="Select">Select</option>
                <option value="5">5 years</option>
                <option value="10">10 years</option>
                <option value="15">15 years</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sumAssured">Sum Assured</label>
           
              <select
                className="form-control"
                id="sumAssured"
                value={sumAssured}
                onChange={(e) => setSumAssured(e.target.value)}
                required
              >
               <option value="Select">Select</option>
                <option value="1500000">15 lakh</option>
                <option value="2500000">25 lakh</option>
                <option value="5000000">50 years</option>
              </select>
            </div>
            <div className="form-groupO">
              <label htmlFor='occupation'>Occupation</label>
              <div className="form-check" style={{marginLeft:'10px'}}>
                <input
                  className="form-check-input"
                  type="radio"
                  id="normalRisk"
                  name="occupation"
                  value="normal"
                  checked={occupation === 'normal'}
                  onChange={() => setOccupation('normal')}
                />
              
                <label className="form-check-label" htmlFor="normalRisk">
                  Normal Risk
                </label>
              </div>
              <div className="form-checkhigh" style={{marginLeft:'20px'}} >
                <input
                  className="form-check-input"
                  type="radio"
                  id="highRisk"
                  name="occupation"
                  value="high"
                  checked={occupation === 'high'}
                  onChange={() => setOccupation('high')}
                />
                <label className="form-check-label" htmlFor="highRisk">
                  High Risk
                </label>
              </div>
            </div>
            <div className="form-groupR">
             
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="accidentalDeath"
                  checked={accidentalDeath}
                  onChange={() => setAccidentalDeath(!accidentalDeath)}
                />
                <label className="form-check-label" htmlFor="accidentalDeath">
                  Accidental Death
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="criticalIllness"
                  checked={criticalIllness}
                  onChange={() => setCriticalIllness(!criticalIllness)}
                />
                <label className="form-check-label" htmlFor="criticalIllness">
                  Critical Illness
                </label>
              </div>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="waiverOfPremium"
                  checked={waiverOfPremium}
                  onChange={() => setWaiverOfPremium(!waiverOfPremium)}
                />
                <label className="form-check-label" htmlFor="waiverOfPremium">
                  Waiver Of Premium
                </label>
              
            </div>
            <div className="form-group">
              <label htmlFor="paymentFrequency">Payment Frequency</label>
              <select
                className="form-control"
                id="paymentFrequency"
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
                required>
               <option value="Select">Select</option>  
                <option value="annually">Annually</option>
                <option value="half-yearly">Half-Yearly</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            {premiumResult && (
            <div className="premium-result">
             Calculated premium is&#8377;{premiumResult}
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
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Calculated Premium:&#8377;{premiumResult}</h3>
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
  );
};
 
export default TermPolicyDetails;
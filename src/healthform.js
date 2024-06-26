import React, { useState, useContext } from 'react';
import { AppContext } from './AppContext';
import axios from 'axios';
import './healthform.css'; 
import { useNavigate } from 'react-router-dom';

const HealthPolicyForm = () => {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [smoke, setSmoke] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [bp, setBp] = useState(false);
  const [diabetics, setDiabetics] = useState(false);
  const [criticalDisease, setCriticalDisease] = useState('');
  const [healthReport, setHealthReport] = useState(null);
  const { suserPolicyId } = useContext(AppContext);
  const [responseMessage, setResponseMessage] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setHealthReport(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (age < 18) {
      setValidationMessage('Please enter a valid age greater than 18.');
      return;
    }

    if (!healthReport) {
      setValidationMessage('Please upload the health report.');
      return;
    }

    const formData = new FormData();
    formData.append('policyType', 'HEALTH');
    formData.append('age', parseInt(age, 10));
    formData.append('height', parseFloat(height));
    formData.append('weight', parseFloat(weight));
    formData.append('smoke', smoke); 
    formData.append('alcohol', alcohol); 
    formData.append('bp', bp); 
    formData.append('diabetics', diabetics); 
    formData.append('criticalDisease', criticalDisease);
    formData.append('healthReport', healthReport); 
    formData.append('userPolicyId', suserPolicyId);

    try {
      const response = await axios.post('http://localhost:8008/policy-documents/create/health', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Policy document created successfully:', response.data); 
      setResponseMessage('Policy document created successfully!');
      navigate('/mypolicies');
    } catch (error) {
      console.error('Error creating policy document:', error);
      setResponseMessage('Error creating policy document.');
    }
  };

  return (
    <div className='healthbody'>
    <h1 className="health-form-title">Health Insurance</h1>
    <p className="health-form-subtitle">Peace of mind that never expires, with every heartbeat</p>
    <div className="health-form-wrapper">
      <div className="health-form-container">
        <div className="health-form-left">
          <button className="health-purchase-request">Purchase Request</button>
          <img src={require('../src/images/userimages/purchaseimage.png')} alt="Health Insurance" className="health-form-image" />
        </div>
        <div className="health-form-right">
          <form onSubmit={handleSubmit}>
            <div className="health-form-row">
              <div className="health-form-group">
                <label htmlFor="age">Age</label>
                <input id="age" type="number" className="health-form-input" value={age} onChange={(e) => setAge(e.target.value)} required />
              </div>
              <div className="health-form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input id="weight" type="number" className="health-form-input" value={weight} onChange={(e) => setWeight(e.target.value)} required />
              </div>
              <div className="health-form-group">
                <label htmlFor="height">Height (Inch)</label>
                <input id="height" type="number" className="health-form-input" value={height} onChange={(e) => setHeight(e.target.value)} required />
              </div>
            </div>
            <div className="health-form-row">
              <div className="health-form-group">
                <label htmlFor="smoke">Do you Smoke?</label>
                <div className="health-form-options">
                  <input type="radio" name="smoke" value="true" checked={smoke === true} onChange={() => setSmoke(true)} /> Yes
                  <input type="radio" name="smoke" value="false" checked={smoke === false} onChange={() => setSmoke(false)} /> No
                </div>
              </div>
              <div className="health-form-group">
                <label htmlFor="alcohol">Do you consume alcohol?</label>
                <div className="health-form-options">
                  <input type="radio" name="alcohol" value="true" checked={alcohol === true} onChange={() => setAlcohol(true)} /> Yes
                  <input type="radio" name="alcohol" value="false" checked={alcohol === false} onChange={() => setAlcohol(false)} /> No
                </div>
              </div>
            </div>
            <div className="health-form-row">
              <div className="health-form-group">
                <label htmlFor="bp">Do you have high B.P?</label>
                <div className="health-form-options">
                  <input type="radio" name="bp" value="true" checked={bp === true} onChange={() => setBp(true)} /> Yes
                  <input type="radio" name="bp" value="false" checked={bp === false} onChange={() => setBp(false)} /> No
                </div>
              </div>
              <div className="health-form-group">
                <label htmlFor="diabetics">Do you have high diabetes?</label>
                <div className="health-form-options">
                  <input type="radio" name="diabetics" value="true" checked={diabetics === true} onChange={() => setDiabetics(true)} /> Yes
                  <input type="radio" name="diabetics" value="false" checked={diabetics === false} onChange={() => setDiabetics(false)} /> No
                </div>
              </div>
            </div>
            <div className="health-form-group">
              <label htmlFor="criticalDisease">Any other critical illness?</label>
              <textarea id="criticalDisease" className="health-form-input" value={criticalDisease} onChange={(e) => setCriticalDisease(e.target.value)} required style={{width:'200%'}}></textarea>
            </div>
            <div className="upload-container">
              <div className="health-form-group">
                <label htmlFor="healthReport">Upload Health Report </label>
                <input type="file"  className="health-form-input-file" onChange={handleFileChange} required />
              </div>
            </div>
            <div className="health-form-buttons">
              <button type="submit" className="health-submit-button">Submit</button>
            </div>
          </form>
          {responseMessage && <div className="health-alert">{responseMessage}</div>}
        </div>
      </div>
    </div>
  </div>
  );
};

export default HealthPolicyForm;
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from './AppContext';
import './autoPolicyForm.css'; 
import { useNavigate } from 'react-router-dom';

const AutoPolicyForm = () => {
  const [vehicleModelNo, setVehicleModelNo] = useState('');
  const [licensePlateNo, setLicensePlateNo] = useState('');
  const [vehicleValue, setVehicleValue] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [primaryUse, setPrimaryUse] = useState('personal');
  const [driverAge, setDriverAge] = useState('');
  const [cheatSheet, setCheatSheet] = useState(null);
  const { suserPolicyId } = useContext(AppContext);
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setCheatSheet(e.target.files[0]); 
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('policyType', 'AUTO');
    formData.append('vehicleModelNo', vehicleModelNo);
    formData.append('licensePlateNo', licensePlateNo);
    formData.append('vehicleValue', vehicleValue ? Number(vehicleValue) : null);
    formData.append('primaryUse', primaryUse);
    formData.append('vehicleType', vehicleType);
    formData.append('driverAge', driverAge ? parseInt(driverAge, 10) : null);
    formData.append('cheatSheet', cheatSheet);
    formData.append('userPolicyId', suserPolicyId);

    try {
      await axios.post('http://localhost:8008/policy-documents/create/auto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponseMessage('Policy document created successfully!');
      navigate('/mypolicies');
    } catch (error) {
      console.error('Error creating policy document:', error);
      setResponseMessage('Error creating policy document.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let isValid = true;
    

    if (parseInt(vehicleValue) <= 30000 || vehicleValue % 100 !== 0) {
      alert('Vehicle value must be greater than ₹30,000 and end in "00".');
      isValid = false;
    } 
    if(vehicleType === '') {
      alert('Please select a vehicle type.');
      isValid = false;
    }

    if (parseInt(driverAge) <= 18) {
      alert('Please enter a valid age greater than 18.');
      isValid = false;
    } 

    if (isValid) {
      handleSave();     }
  };

  return (
    <div className='autopurchasebody'>
      <div className="auto-form-wrapper">
        <h1 className="auto-form-title">Auto Insurance</h1>
        <p className="auto-form-subtitle">Shielding your Journey with reliable coverage</p>
        <div className="auto-form-container">
          <div className="auto-form-content">
            <div className="auto-form-left">
              <button className="auto-purchase-request">Purchase Request</button>
              <img src={require('../src/images/userimages/purchaseimage.png')} alt="Auto Insurance" className="auto-form-image" />
            </div>
            <div className="auto-form-right">
              <form onSubmit={handleSubmit}>
              <div className="auto-form-row">
                  <div className="auto-form-group">
                    <label htmlFor="vehicleModelNo">Vehicle Model No</label>
                    <input id="vehicleModelNo" type="text" className="auto-form-input" value={vehicleModelNo} onChange={(e) => setVehicleModelNo(e.target.value)} required />
                  </div>
                  <div className="auto-form-group">
                    <label htmlFor="licensePlateNo">License Plate No</label>
                    <input id="licensePlateNo" type="text" className="auto-form-input" value={licensePlateNo} onChange={(e) => setLicensePlateNo(e.target.value)} required />
                  </div>
                </div>
                <div className="auto-form-row">
                  <div className="auto-form-group">
                    <label htmlFor="vehicleValue">Vehicle Value</label>
                    <input id="vehicleValue" type="number" className="auto-form-input" value={vehicleValue} onChange={(e) => setVehicleValue(e.target.value)} required />
                  </div>
                  <div className="auto-form-group" style={{marginLeft:'90px'}}>
                    <label htmlFor="vehicleType">Vehicle Type</label>
                    <select id="vehicleType" className="auto-form-input" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} required>
                      <option value="">Select</option>
                      <option value="2 wheeler">2 Wheeler</option>
                      <option value="3 wheeler">3 Wheeler</option>
                      <option value="4 wheeler">4 Wheeler</option>
                    </select>
                  </div>
                </div>
                <div className="auto-form-row">
                  <div className="auto-form-group">
                    <label htmlFor="primaryUse">Primary Use</label>
                    <select id="primaryUse" className="auto-form-input" value={primaryUse} onChange={(e) => setPrimaryUse(e.target.value)} required>
                      <option value="personal">Personal</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                  <div className="auto-form-group" style={{marginLeft:'90px'}}>
                    <label htmlFor="driverAge">Driver's Age</label>
                    <input id="driverAge" type="number" className="auto-form-input" value={driverAge} onChange={(e) => setDriverAge(e.target.value)} required />
                  </div>
                </div>
                <div className='upload-files'>
                <div className="auto-form-group">
                  <label htmlFor="cheatSheet">Upload Clear Sheet</label>
                  <input id="cheatSheet" type="file" className="auto-form-input-file" onChange={handleFileChange} required />
                </div>
                
                </div>
                <div className="auto-form-buttons">
                  <button type="submit" className="auto-submit" style={{marginLeft:'250px'}}>Submit</button>
                </div>
              </form>
            {responseMessage && <div className="alert alert-info mt-2">{responseMessage}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoPolicyForm;

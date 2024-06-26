import React, { useState, useContext } from 'react';
import { AppContext } from './AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './termpolicyform.css';

const TermPolicyForm = () => {
  const [annualIncome, setAnnualIncome] = useState('');
  const [anyDisease, setAnyDisease] = useState(false);
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('');
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [nomineeProof, setNomineeProof] = useState(null);
  const { suserPolicyId } = useContext(AppContext);
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setNomineeProof(e.target.files[0]); 
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('policyType', 'TERM');
    formData.append('annualIncome', annualIncome ? Number(annualIncome) : null);
    formData.append('anyDisease', anyDisease);
    formData.append('nomineeName', nomineeName);
    formData.append('nomineeRelation', nomineeRelation);
    formData.append('nomineeEmail', nomineeEmail);
    formData.append('nomineeProof', nomineeProof); 
    formData.append('userPolicyId', suserPolicyId);
    console.log(formData);

    try {
      const response = await axios.post('http://localhost:8008/policy-documents/create/term', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      setResponseMessage('Policy document created successfully!');
      navigate('/mypolicies');
    } catch (error) {
      console.error('Error creating policy document:', error);
      setResponseMessage('Error creating policy document.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (annualIncome === '' || !/^[1-9]\d*\d{3}$/.test(annualIncome)) {
      alert('Annual income must end with three zeroes and start with a non-zero digit.');
      valid = false;
    }

    if (valid) {
      handleSave(e);
    }
  };

  return (
    <div className='termbody'>
    <div className="term-form-wrapper">
      <div className="term-form-container">
        <h1 className="term-form-title">Term Life Insurance</h1>
        <p className="term-form-subtitle">Security that lasts a lifetime, for the ones you cherish</p>
        <div className="term-form-content">
          <div className="term-form-left">
            <button className="purchase-request">Purchase Request</button>
            <img src={require('../src/images/userimages/purchaseimage.png')} alt="Term Insurance" className="form-image" />
          </div>
          <div className="term-form-right">
            <form onSubmit={handleSubmit}>
              <div className="term-form-row">
              <div className="term-form-row"></div>
            <div className="term-form-group">
              <label>Any Disease</label>
              <div className="term-form-options">
                <label className="term-form-check">
                  <input id="diseaseYes" type="radio" name="anyDisease" value="true" checked={anyDisease === true} onChange={() => setAnyDisease(true)} />
                  Yes
                </label>
                <label className="term-form-check">
                  <input id="diseaseNo" type="radio" name="anyDisease" value="false" checked={anyDisease === false} onChange={() => setAnyDisease(false)} />
                  No
                </label>
              </div>
            </div>
                <div className="term-form-group-1">
                  <label htmlFor="annualIncome">Annual Income</label>
                  <input id="annualIncome" type="number" className="term-form-input" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} required />
                </div>
              </div>
              <div className="term-form-row">
                <div className="term-form-group">
                  <label htmlFor="nomineeName">Nominee Name</label>
                  <input id="nomineeName" type="text" className="term-form-input" value={nomineeName} onChange={(e) => setNomineeName(e.target.value)} required />
                </div>
                <div className="term-form-group-1">
                  <label htmlFor="nomineeRelation">Nominee Relation</label>
                  <input id="nomineeRelation" type="text" className="term-form-input" value={nomineeRelation} onChange={(e) => setNomineeRelation(e.target.value)} required />
                </div>
              </div>
              <div className="term-form-row">
                <div className="term-form-group">
                  <label htmlFor="nomineeEmail">Nominee Email</label>
                  <input id="nomineeEmail" type="email" className="term-form-input" value={nomineeEmail} onChange={(e) => setNomineeEmail(e.target.value)} required />
                </div>
              </div>
              <div className="term-upload-container">
                <div className="term-form-group">
                  <label htmlFor="nomineeProof">Upload Nominee ID Proof</label>
                  <input id="nomineeProof" type="file"  className="term-form-input-file" onChange={handleFileChange} required />
                </div>
              </div>
              <div className="term-form-buttons">
                <button type="submit" className="term-submit-button">Submit</button>
              </div>
            </form>
            {responseMessage && <div className="term-alert alert-info mt-4">{responseMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default TermPolicyForm;

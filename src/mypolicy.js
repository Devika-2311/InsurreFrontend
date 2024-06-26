import React, { useEffect, useState,useContext} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';

import './mypolicy.css';
 
const MyPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const policiesPerPage = 8; 
  const { suserId } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const user = sessionStorage.getItem('user');


  
  console.log(user);
 

  const handleViewClick = (userpolicyId) => {
    navigate('/policydetails', { state: { userpolicyId } });
  };
  const handlePayClick = (userpolicyId) => {
    navigate('/payment', { state: { userpolicyId } });
  };
  const handlePayHistoryClick = (userpolicyId) => {
    navigate('/paymentHistory', { state: { userpolicyId } });
  };

 
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get(`http://localhost:8008/user-policies/user/${user}`);
        const initialPolicies = response.data;
        console.log(response.data);
        if (location.state && location.state.newPolicy) {
          initialPolicies.push(location.state.newPolicy);
        }
        console.log('Fetched policies:', initialPolicies);
        setPolicies(initialPolicies);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };
    if (user) {
        fetchPolicies();
      }
    }, [user]);
 
   
 
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); 
  };
 
  const filteredPolicies = policies.filter(policy =>
    policy.status && policy.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const indexOfLastPolicy = currentPage * policiesPerPage;
  const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage;
  const currentPolicies = filteredPolicies.slice(indexOfFirstPolicy, indexOfLastPolicy);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
  return (
    <div className="my-policies">
      <h2 className='h2'>Active Policies</h2>
      <input
        type="text"
        placeholder="Search by status..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar-small"
      />
      <div className="policy-cards">
        {currentPolicies.map(policy => (
          <div key={policy.userPolicyId} className="policy-card">
            {policy.policy ? (
              <>
                <h3>{policy.policy.policyType} Insurance</h3>
                <p>Policy Name: {policy.policy.policyName}</p> 
                <p>Status: {policy.status}</p>
                <p>Premium: ₹{policy.premium}</p>
                {policy.status === 'pending' ? (
                  <button className="status-pending">Status: Pending</button>
                ) : (
                  <>
                    <button className="buy-again"  onClick={() => handleViewClick(policy.userPolicyId)}>view</button>
                    <button className="pay-premium"  onClick={() => handlePayClick(policy.userPolicyId)}>Pay Premium</button>
                    <button className="pay-premium"  onClick={() => handlePayHistoryClick(policy.userPolicyId)}>Premium History</button>
                  </>
                )}
              </>
            ) : (
              <>
                <h3>Policy ID: {policy.userPolicyId}</h3>
                <p>Status: {policy.status}</p>
                <p>Premium: ₹{policy.premium}</p>
                <p>Policy data is missing</p>
              </>
            )}
          </div>
        ))}
      </div>
      {filteredPolicies.length > policiesPerPage && (
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredPolicies.length / policiesPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`page-link ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default MyPolicies;
 
import React, { useState, useEffect, useContext } from 'react';
import logo from './images/logosfolder/applogo.png';
import './loginComponent.css';
import { useNavigate } from 'react-router-dom';
import homeImage from './images/logosfolder/loginhomelogo.png';
import { AppContext } from './AppContext';
 
const LoginComponent = ({  imageUrl, welcomsmsg, role }) => {
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { suserId, setSuserId } = useContext(AppContext);
 
    const navigate = useNavigate();
 
    useEffect(() => {
        sessionStorage.clear();
    }, []);
 
    const handlehomeclick = () => {
        navigate("/");
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('emailId', emailId);
            formData.append('password', password);
            formData.append('role', role);
            const response = await fetch('http://localhost:8008/users/login', {
                method: 'POST',
                body: formData
            });
 
            if (response.status === 401) {
                setError('Invalid email or password');
                return;
            }
 
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
 
            const data = await response.json();
                console.log('Login response:', data);
                
                setSuserId(data); 
                console.log(suserId); 

 
            if (data) {
                sessionStorage.setItem('user', JSON.stringify(data));
                if (role === "user") {
                    navigate('/section2', { state: { user: data } });
                } else if (role === "admin") {
                    navigate('/admindashboard', { state: { user: data } });
                } else if (role === "agent") {
                    navigate('/agentdashboard', { state: { user: data } });
                }
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again later.');
        }
    };
 
    return (
        <div className='logincomponent-body'>
            <div className='logincomponent-top-total'>
                <div className='logincomponent-top-le'>
                    <img src={logo} alt="Logo" className="logincomponent-logo" />
                    <h1 id='logincomponent-ins'>Insurre</h1>
                </div>
                <div className="logincomponent-top-ri" onClick={handlehomeclick}>
                    <img src={homeImage} alt="User" style={{ cursor: 'pointer' }} />
                </div>
            </div>
            <div className='logincomponent-main'>
                <div className='logincomponent-body-us'>
                    <div className='logincomponent-body-us-left'>
                        <h1 id='logincomponent-say-hola'>Hello,</h1>
                        <h2 id='logincomponent-hellomsg'>{welcomsmsg}</h2>
                        <h3 id='logincomponent-after-hola'>Hey, Welcome back to your special place</h3>
                        <form className='login-form' onSubmit={handleSubmit}>
                            <div>
                                <label className='logincomponent-fld-head'>Email:</label>
                                <br />
                                <input className='logincomponent-fld' type="email" placeholder="Type your Email" value={emailId} onChange={(e) => setEmailId(e.target.value)} required />
                            </div>
                            <div>
                                <label className='logincomponent-fld-head'>Password:</label>
                                <br />
                                <input className='logincomponent-fld' type="password" placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className='logincomponent-btm-ct'>
                                <a id='logincomponent-forget-password' href="/forget-password" >forget password?</a>
                                <br />
                                {error && <div className="login-error">{error}</div>}
                                <button id='logincomponent-signin' type="submit">Sign in</button>
                            </div>
                           
                        </form>
 
                        {role === "user" && (
                            <h3 className='signupg'>Don't have an account? <span> <a id='signup-op' href="/signup"> Sign up </a></span> </h3>
                        )}
                    </div>
                    <div className='logincomponent-body-us-right'>
                        <img src={imageUrl} alt="Logo" className="logincomponent-right-im-bt" />
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default LoginComponent;
 
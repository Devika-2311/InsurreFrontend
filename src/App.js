
import './App.css';

import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';


import UserLogin from './user';
import Section2 from './section2';

import AutoInsurance from './autoinsurance';
import TermInsurance from './terminsurance';
import HealthInsurance from './healthinsurance';

import AutoPolicyForm from './autoform';
import TermPolicyForm from './termpolicyform';
import MyPolicies from './mypolicy';

import { AppProvider } from './AppContext';
import HealthPolicyForm from './healthform';
import Layout from './layout';



function App() {
  return (

    <AppProvider>
       <Router>
      <Routes>
      
      <Route path='/' element={<UserLogin />} />
      <Route path="/" element={<Layout />}>
         
          <Route path='/section2' element={<Section2 />} />
          
          <Route path="/autoinsurance" element={<AutoInsurance />} />
          <Route path="/terminsurance" element={<TermInsurance />} />
          <Route path="/healthinsurance" element={<HealthInsurance />} />
          <Route path="/health-policy-form" element={<HealthPolicyForm/>} />
          <Route path="/auto-policy-form" element={<AutoPolicyForm />} />
          <Route path="/term-policy-form" element={<TermPolicyForm />} />
          <Route path="/mypolicies" element={<MyPolicies />} />
          </Route>
         
         
      </Routes>
    </Router>
      
      

    </AppProvider>


  );
}








export default App;

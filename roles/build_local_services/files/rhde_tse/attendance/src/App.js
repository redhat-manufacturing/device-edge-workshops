import React from 'react';
import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly.css"
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';




import Overview from './Overview';
import Homepage from './pages';
import Student from './pages/Student';


import GithubIcon from '@patternfly/react-icons/dist/esm/icons/github-icon';
import AnisbleIcon from '@patternfly/react-icons/dist/esm/icons/ansible-tower-icon';
import Background from './images/pfbg_1200.jpg';
import './App.css';
import { Button } from '@patternfly/react-core';







// get the current year for the footer
const getCurrYear = () => {
  var today = new Date(),
    currYear = today.getFullYear(); 
  return currYear;
}


const App = () => {
  return (
    <Router>
      <span>
        <footer className="footer">&#169; {getCurrYear()} - Red Hat</footer> 
      </span>
      <Routes>
        <Route exact path='/' exact element={<Homepage />} />
        <Route path='/Student' element={<Overview />} />
      </Routes> 
    </Router>
  );
}

export default App; 
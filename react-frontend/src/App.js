import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';
import Keys from './components/keys';
import Analysis from './components/analysis';
import Analysis_form from './components/analysis_form';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/keys" element={<Keys/>} />
        <Route path="/analysis" element={<Analysis/>} />{/** 
        <Route path="/detailed_analysis" element={<Analysis_form/>} />*/}
        <Route path="/*" element={<Navigate to="/" />}/>
      </Routes>
    </Router>
  );
};

export default App;
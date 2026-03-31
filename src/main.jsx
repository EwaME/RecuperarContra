import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import RecuperarPassword from './RecuperarPassword.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecuperarPassword />} />
        
        <Route path="/login" element={
          <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <p className="font-bold text-gray-500 uppercase tracking-widest">Login</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
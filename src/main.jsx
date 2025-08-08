import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import CustomerServiceApp from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<CustomerServiceApp />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
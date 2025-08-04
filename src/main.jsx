import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import CustomerServiceApp from './App.jsx';
import CallCustomerPage from './CallCustomerPage.jsx';
import ScheduleServicePage from './ScheduleServicePage.jsx';
import UpdateInfoPage from './UpdateInfoPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        {/* Rute utama akan menampilkan daftar customer */}
        <Route path="/" element={<CustomerServiceApp />} />

        {/* Rute untuk setiap halaman baru */}
        <Route path="/call" element={<CallCustomerPage />} />
        <Route path="/schedule" element={<ScheduleServicePage />} />
        <Route path="/update" element={<UpdateInfoPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
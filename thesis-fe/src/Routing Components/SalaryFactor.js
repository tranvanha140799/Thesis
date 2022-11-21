import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import SalaryFactorPage from '../components/SalaryFactor';

const SalaryFactor = () => (
  <>
    <Routes>
      <Route exact path="/salary-factors" element={<SalaryFactorPage />} />
    </Routes>

    <Outlet />
  </>
);
export default SalaryFactor;

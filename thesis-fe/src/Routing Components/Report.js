import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import TuitionFeeReportPage from '../components/Report/TuitionFeeReport';
import SalaryReportPage from '../components/Report/SalaryReport';

const Report = () => (
  <>
    <Routes>
      <Route exact path="/tuition-reports" element={<TuitionFeeReportPage />} />
      <Route exact path="/salary-reports" element={<SalaryReportPage />} />
    </Routes>

    <Outlet />
  </>
);
export default Report;

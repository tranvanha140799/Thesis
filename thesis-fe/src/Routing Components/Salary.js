import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import SalaryPage from '../components/Salary';

const Salary = () => (
  <>
    <Routes>
      <Route exact path="/pay-salaries" element={<SalaryPage />} />
      <Route exact path="/pay-salaries/:teacherId" element={<SalaryPage />} />
    </Routes>

    <Outlet />
  </>
);
export default Salary;

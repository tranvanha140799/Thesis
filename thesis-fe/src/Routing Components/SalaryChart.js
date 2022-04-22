import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import SalaryChartPage from '../components/SalaryChart';
import AddSalary from '../components/SalaryChart/add';
import EditSalary from '../components/SalaryChart/edit';

const SalaryChart = () => (
  <>
    <Routes>
      <Route exact path="/salary-chart" element={<SalaryChartPage />} />
      <Route exact path="/salary-chart/add" element={<AddSalary />} />
      <Route exact path="salary-chart/:salaryRankId" element={<EditSalary />} />
    </Routes>

    <Outlet />
  </>
);
export default SalaryChart;

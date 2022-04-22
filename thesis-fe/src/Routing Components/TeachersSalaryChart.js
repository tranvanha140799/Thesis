import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import TeachersSalaryChartPage from '../components/TeachersSalaryChart';
// import AddTeacher from '../components/Teachers/add';
// import EditTeacher from '../components/Teachers/edit';

const TeachersSalaryChart = () => (
  <>
    <Routes>
      <Route
        exact
        path="/teachers-salary-chart"
        element={<TeachersSalaryChartPage />}
      />
      {/* <Route exact path="/teachers-salary-chart/add" element={<AddTeacher />} />
      <Route exact path="teachers-salary-chart/:teacherId" element={<EditTeacher />} /> */}
    </Routes>

    <Outlet />
  </>
);
export default TeachersSalaryChart;

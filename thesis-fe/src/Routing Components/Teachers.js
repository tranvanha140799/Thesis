import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import TeacherPage from '../components/Teachers';
import AddTeacher from '../components/Teachers/add';
import EditTeacher from '../components/Teachers/edit';

const Teachers = () => (
  <>
    <Routes>
      <Route exact path="/teachers" element={<TeacherPage />} />
      <Route exact path="/teachers/add" element={<AddTeacher />} />
      <Route exact path="teachers/:teacherId" element={<EditTeacher />} />
    </Routes>

    <Outlet />
  </>
);
export default Teachers;

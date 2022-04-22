import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import StudentPage from '../components/Students';
import AddStudent from '../components/Students/add';
import EditStudent from '../components/Students/edit';

const Students = () => (
  <>
    <Routes>
      <Route exact path="/students" element={<StudentPage />} />
      <Route exact path="/students/add" element={<AddStudent />} />
      <Route exact path="students/:studentId" element={<EditStudent />} />
    </Routes>

    <Outlet />
  </>
);
export default Students;

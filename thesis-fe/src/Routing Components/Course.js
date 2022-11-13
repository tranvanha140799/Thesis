import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import ClassPage from '../components/Class';
import AddClass from '../components/Class/add';
import EditCLass from '../components/Class/edit';

const Courses = () => (
  <>
    <Routes>
      <Route exact path="/courses" element={<ClassPage />} />
      <Route exact path="/courses/add" element={<AddClass />} />
      <Route exact path="courses/:classId" element={<EditCLass />} />
    </Routes>

    <Outlet />
  </>
);
export default Courses;

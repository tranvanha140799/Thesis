import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import CoursePage from '../components/Course';
import AddCourse from '../components/Course/add';
import EditCourse from '../components/Course/edit';

const Courses = () => (
  <>
    <Routes>
      <Route exact path="/courses" element={<CoursePage />} />
      <Route exact path="/courses/add" element={<AddCourse />} />
      <Route exact path="courses/:courseId" element={<EditCourse />} />
    </Routes>

    <Outlet />
  </>
);
export default Courses;
